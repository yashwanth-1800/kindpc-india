"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
const links=[["/","Home"],["/advisor","AI advisor"],["/builds","Builds"],["/trust","Why KindPC"]];
export function SiteHeader(){const path=usePathname();return <header className="site-header"><Link className="brand" href="/"><b>K</b><span>kind<strong>PC</strong></span></Link><nav>{links.map(([href,label])=><Link key={href} className={path===href?"active":""} href={href}>{label}</Link>)}</nav><Link className="header-cta" href="/advisor">ASK KAVI <span>↗</span></Link></header>}

