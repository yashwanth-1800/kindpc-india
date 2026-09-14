import { askOpenAI } from "../../../lib/openai";
import { createPcAgent } from "../../../lib/agent";
import { recommend, Profile } from "../../../lib/recommender";
import { refreshMarketPrices } from "../../../lib/market";

type Body = { message: string; history?: { role: string; text: string }[]; profile: Profile };
type Rec = Awaited<ReturnType<typeof refreshMarketPrices>>;
const money = (value: number) => new Intl.NumberFormat("en-IN").format(value);

function fallback(profile: Profile, rec: Rec) {
  const parts = rec.parts.map((part) => `• ${part.name} — ₹${money(part.price)} (${part.priceStatus === "live" ? "live retailer check" : "last verified snapshot"})\n  Product: ${part.url}`).join("\n");
  if (!rec.parts.length) return `${rec.title}. ${rec.warnings[0]}`;
  return `I found a ${profile.kind} match within your ₹${money(profile.budget)} limit.\n\n${parts}\n\nEstimated total: ₹${money(rec.total)}. ${rec.warnings[0]} Prices marked as snapshots are not claimed as current; open the product link to confirm checkout price and stock.`;
}

function enforceLiveBudget(profile: Profile, rec: Rec): Rec {
  if (rec.total <= profile.budget) return rec;
  return { ...rec, title: `No currently verified ${profile.use} ${profile.kind} within ₹${money(profile.budget)}`, total: 0, parts: [], checks: ["Budget checked again after the retailer price refresh", "No over-budget product was shown"], warnings: [`The selected product rose to ₹${money(rec.total)}. Try a slightly higher budget or check again later.`] };
}

function effectiveProfile(profile: Profile, message: string): Profile {
  const text = message.toLowerCase(), next = { ...profile };
  if (/\b(laptop|notebook)\b/.test(text)) next.kind = "laptop";
  else if (/\b(desktop|prebuilt)\b/.test(text)) next.kind = "desktop";
  else if (/\b(custom pc|pc build|build me|components?)\b/.test(text)) next.kind = "custom";
  if (/\b(gaming|games?|fps)\b/.test(text)) next.use = "gaming";
  else if (/\b(editing|design|creator|video|blender)\b/.test(text)) next.use = "creator";
  else if (/\b(coding|programming|developer|ai|machine learning)\b/.test(text)) next.use = "coding";
  else if (/\b(study|student|office|everyday|browsing)\b/.test(text)) next.use = "everyday";
  const match = text.match(/(?:₹|rs\.?\s*)?([0-9][0-9,]*(?:\.[0-9]+)?)\s*(k|thousand|lakh|lac)?/i);
  if (!match) return next;
  let budget = Number(match[1].replace(/,/g, ""));
  const unit = match[2]?.toLowerCase();
  if (unit === "k" || unit === "thousand") budget *= 1000;
  if (unit === "lakh" || unit === "lac") budget *= 100000;
  if (budget >= 10000 && budget <= 250000) next.budget = Math.round(budget);
  return next;
}

const isBuyingRequest = (message: string) => /\b(recommend|suggest|best|buy|build me|pc build|custom pc|under|budget)\b/i.test(message);
const isCompatibilityCheck = (message: string) => /\b(check|verify|review|compatible|compatibility|work together|fit)\b/i.test(message) && /\b(parts?|components?|cpu|motherboard|ram|gpu|graphics card|power supply|psu|case|cooler)\b/i.test(message);

function localDeviceAnswer(message: string, profile: Profile, rec: Rec) {
  const question = message.toLowerCase();
  if (/^(hi|hello|hey|good\s+(morning|afternoon|evening))\b/.test(question)) return "Hi! I’m Kavi 👋 I can help with laptops, custom PCs, desktops, upgrades, compatibility, and performance. Tell me what you use the device for and your budget—or ask any technical question.";
  if (isBuyingRequest(message)) return fallback(profile, rec);
  if (/cpu.*gpu|gpu.*cpu|processor.*graphics/.test(question)) return "The CPU handles general instructions, app logic, compilation, and game simulation. The GPU runs many calculations in parallel, so it matters most for games, 3D work, video effects, and local AI models. For coding, prioritize CPU and RAM; for gaming or local AI, reserve more of the budget for the GPU. Tell me your workload and I’ll suggest a sensible balance.";
  if (/ram|memory/.test(question)) return "For everyday work, 16GB RAM is the practical minimum. Choose 32GB for large coding projects, virtual machines, 4K editing, or local AI tools. Match DDR4 or DDR5 to the motherboard—these generations are not interchangeable—and prefer two matched sticks for dual-channel performance.";
  if (/bottleneck/.test(question)) return "A bottleneck means one component limits the others in a specific task. It is workload- and resolution-dependent, not a single universal percentage. Share your CPU, GPU, screen resolution, and main apps or games, and I’ll check the balance.";
  if (isCompatibilityCheck(message)) return "Send the exact CPU, motherboard, RAM, GPU, power supply, case, and cooler names. I’ll check socket and chipset support, RAM generation, BIOS requirements, PSU capacity and connectors, plus GPU and cooler clearance.";
  return "I can help with that device question. Please include the exact model or component names and what you want to know—performance, compatibility, upgrade options, value, or a buying recommendation. I’ll use the previous messages in this chat as context.";
}

export async function POST(request: Request) {
  let body: Body | undefined;
  try {
    body = await request.json() as Body;
    if (typeof body.message !== "string" || body.message.length < 2 || body.message.length > 2000) return Response.json({ error: "Please send 2–2,000 characters." }, { status: 400 });
    body.profile = effectiveProfile(body.profile, body.message);
    const rec = enforceLiveBudget(body.profile, await refreshMarketPrices(recommend(body.profile)));
    const keys = process.env as { OPENAI_API_KEY?: string; GEMINI_API_KEY?: string };
    const history = (body.history ?? []).map((item) => `${item.role}: ${String(item.text).slice(0, 600)}`).join("\n");
    const system = `You are Kavi, a warm, capable Indian device advisor. Answer device questions using conversation history. A request to recommend or build a PC means present the supplied recommendation; never ask the buyer to send component names. Ask for exact component names only when the buyer explicitly wants an existing list checked. The recommendation JSON is authoritative: never change its products, prices, URLs, total or budget result. Explain simply in under 220 words.\nProfile: ${JSON.stringify(body.profile)}\nRecommendation: ${JSON.stringify(rec)}\nConversation: ${history}\nBuyer: ${body.message}`;
    if (isBuyingRequest(body.message)) return Response.json({ text: fallback(body.profile, rec), recommendation: rec, marketCheckedAt: new Date().toISOString(), model: "verified-recommender" });
    if (keys.OPENAI_API_KEY) return Response.json({ text: await askOpenAI(keys.OPENAI_API_KEY, system), recommendation: rec, marketCheckedAt: new Date().toISOString(), model: "openai" });
    if (keys.GEMINI_API_KEY) {
      const result = await createPcAgent(keys.GEMINI_API_KEY).generate({ prompt: system });
      const sources = (result.sources ?? []).map((source: any) => ({ title: source.title || "Market source", url: source.url })).filter((source: any) => source.url).slice(0, 6);
      const sourceText = sources.length ? "\n\nSources:\n" + sources.map((source: any, index: number) => `${index + 1}. ${source.title}: ${source.url}`).join("\n") : "";
      return Response.json({ text: result.text + sourceText, recommendation: rec, sources, marketCheckedAt: new Date().toISOString(), model: "gemini" });
    }
    return Response.json({ text: localDeviceAnswer(body.message, body.profile, rec), recommendation: null, model: "local-device-advisor" });
  } catch (error: any) {
    console.error("agent_provider_failed", String(error?.message ?? error));
    if (body?.profile) {
      const rec = enforceLiveBudget(body.profile, await refreshMarketPrices(recommend(body.profile)));
      return Response.json({ text: localDeviceAnswer(body.message, body.profile, rec), recommendation: isBuyingRequest(body.message) ? rec : null, model: "local-device-advisor" });
    }
    return Response.json({ error: "I could not read that request. Please try again." }, { status: 400 });
  }
}

