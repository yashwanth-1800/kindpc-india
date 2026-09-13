import type {Metadata} from "next";import "./globals.css";
export const metadata:Metadata={title:"KindPC India — AI Buying Advisor",description:"A kind AI agent for choosing compatible computers and PC parts in India.",icons:{icon:"/favicon.svg"}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
