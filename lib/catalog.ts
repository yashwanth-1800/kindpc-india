export type Product={id:string;category:string;name:string;price:number;socket?:string;ram?:string;tdp?:number;wattage?:number;form?:string;uses:string[];retailer:string;url:string;checkedAt:string};
const t="2026-09-13T10:15:00+05:30",md="https://mdcomputers.in/",vd="https://www.vedantcomputers.com/",pa="https://www.primeabgb.com/";
export const products:Product[]=[
{id:"r5",category:"CPU",name:"AMD Ryzen 5 7600",price:18500,socket:"AM5",ram:"DDR5",tdp:65,uses:["gaming","coding","everyday"],retailer:"MDComputers",url:md,checkedAt:t},
{id:"r7",category:"CPU",name:"AMD Ryzen 7 7700",price:28500,socket:"AM5",ram:"DDR5",tdp:65,uses:["creator","coding"],retailer:"Vedant Computers",url:vd,checkedAt:t},
{id:"b650",category:"Motherboard",name:"MSI PRO B650M-A WiFi",price:14500,socket:"AM5",ram:"DDR5",form:"mATX",uses:["gaming","creator","coding"],retailer:"MDComputers",url:md,checkedAt:t},
{id:"rx7600",category:"GPU",name:"AMD Radeon RX 7600 8GB",price:26900,tdp:165,uses:["gaming"],retailer:"Vedant Computers",url:vd,checkedAt:t},
{id:"rtx4060",category:"GPU",name:"NVIDIA GeForce RTX 4060 8GB",price:30500,tdp:115,uses:["gaming","creator","coding"],retailer:"MDComputers",url:md,checkedAt:t},
{id:"rtx4070s",category:"GPU",name:"NVIDIA GeForce RTX 4070 SUPER 12GB",price:59500,tdp:220,uses:["gaming","creator","coding"],retailer:"PrimeABGB",url:pa,checkedAt:t},
{id:"ram16",category:"Memory",name:"16GB DDR5-6000 (2×8GB)",price:5200,ram:"DDR5",uses:["gaming","everyday"],retailer:"MDComputers",url:md,checkedAt:t},
{id:"ram32",category:"Memory",name:"32GB DDR5-6000 (2×16GB)",price:8900,ram:"DDR5",uses:["gaming","creator","coding"],retailer:"Vedant Computers",url:vd,checkedAt:t},
{id:"ssd",category:"Storage",name:"WD Blue SN580 1TB NVMe SSD",price:5900,uses:["gaming","creator","coding","everyday"],retailer:"PrimeABGB",url:pa,checkedAt:t},
{id:"psu650",category:"Power supply",name:"DeepCool PK650D 650W Bronze",price:5100,wattage:650,uses:["gaming","creator","coding"],retailer:"MDComputers",url:md,checkedAt:t},
{id:"psu750",category:"Power supply",name:"Corsair RM750e 750W Gold",price:9900,wattage:750,uses:["gaming","creator","coding"],retailer:"PrimeABGB",url:pa,checkedAt:t},
{id:"case",category:"Case",name:"DeepCool CH370 Airflow mATX",price:4700,form:"mATX",uses:["gaming","creator","coding","everyday"],retailer:"Vedant Computers",url:vd,checkedAt:t},
{id:"cooler",category:"Cooler",name:"DeepCool AG400",price:2300,socket:"AM5",uses:["gaming","creator","coding"],retailer:"MDComputers",url:md,checkedAt:t}];
