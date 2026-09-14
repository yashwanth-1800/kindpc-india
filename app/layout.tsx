import type {Metadata} from "next";
import {Space_Grotesk,Manrope} from "next/font/google";
import {SiteHeader} from "../components/site-header";
import "./globals.css";
const display=Space_Grotesk({subsets:["latin"],variable:"--font-display"});const body=Manrope({subsets:["latin"],variable:"--font-body"});
export const metadata:Metadata={title:"KindPC India — AI Device Advisor",description:"Ask Kavi about laptops, desktops and custom PCs in India.",icons:{icon:"/favicon.svg"}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteHeader/>{children}<footer className="footer"><span>© 2026 KINDPC INDIA</span><span>SMARTER DEVICES. CLEARER DECISIONS.</span></footer></body></html>}

