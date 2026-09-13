"use client";
import dynamic from "next/dynamic";
import type {ComponentKey} from "./Workshop3D";
type Props={selected:ComponentKey;exploded:boolean;aiState:"idle"|"thinking"|"responding"|"success";onSelect:(key:ComponentKey)=>void};
const BrowserWorkshop=dynamic(()=>import("./Workshop3D"),{ssr:false,loading:()=> <div className="viewport scene-loading"><div className="fallback-tower">INITIALIZING<br/>3D WORKSHOP</div></div>});
export default function WorkshopLoader(props:Props){return <BrowserWorkshop {...props}/>}
