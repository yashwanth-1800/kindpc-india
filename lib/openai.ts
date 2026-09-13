export async function askOpenAI(apiKey:string,input:string){
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"authorization":`Bearer ${apiKey}`,"content-type":"application/json"},body:JSON.stringify({model:"gpt-5.2",store:false,text:{verbosity:"low"},max_output_tokens:450,input})});
  if(!response.ok)throw new Error(`OpenAI request failed (${response.status})`);
  const data=await response.json() as {output?:Array<{content?:Array<{type?:string;text?:string}>}>};
  const text=data.output?.flatMap(x=>x.content??[]).filter(x=>x.type==="output_text").map(x=>x.text??"").join("\n").trim();
  if(!text)throw new Error("OpenAI returned no text");
  return text;
}
