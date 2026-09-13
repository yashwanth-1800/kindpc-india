type Part={category:string;name:string;price:number;retailer:string;url:string;priceStatus?:"live"|"snapshot"};
type Recommendation={title:string;total:number;parts:Part[];checks:string[];warnings:string[];priceCheckedAt:string};
const plausible=(value:number)=>Number.isFinite(value)&&value>=10000&&value<=1000000;
async function readRetailPrice(url:string){
 if(!url.includes("flipkart.com/"))return null;
 try{const response=await fetch(url,{headers:{"accept-language":"en-IN,en;q=0.9","user-agent":"Mozilla/5.0 (compatible; KindPC/1.0)"},signal:AbortSignal.timeout(5000)});if(!response.ok)return null;const html=await response.text();const patterns=[/itemprop=["']price["'][^>]*content=["']([\d,.]+)/i,/"price"\s*:\s*"?([\d,.]+)/i,/₹\s*([\d,]{4,})/];for(const pattern of patterns){const found=html.match(pattern);if(found){const value=Number(found[1].replace(/,/g,""));if(plausible(value))return value;}}}catch{}return null;
}
export async function refreshMarketPrices(rec:Recommendation):Promise<Recommendation>{const parts=await Promise.all(rec.parts.map(async part=>{const live=await readRetailPrice(part.url);return{...part,price:live??part.price,priceStatus:live?"live" as const:"snapshot" as const}}));const total=parts.reduce((sum,part)=>sum+part.price,0),hasLive=parts.some(part=>part.priceStatus==="live");return{...rec,parts,total,priceCheckedAt:hasLive?new Date().toISOString():rec.priceCheckedAt}}
