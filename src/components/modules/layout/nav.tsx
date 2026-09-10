"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { ModeToggle } from "@/components/modeToggler";
import { useEffect, useState } from "react";

export const Navbar2 = () => {
  const [tokens, setTokens] = useState<{ user?: { email?: string } } | null>(null);
  useEffect(() => { fetch("/api/profile").then(async (res) => (res.ok ? res.json() : null)).then(setTokens).catch(() => null); }, []);
  const menu = [{ title: "Home", url: "/" }, { title: "About", url: "/about" }, { title: "Writing", url: "/blogs" }, { title: "Projects", url: "/projects" }, { title: "Contact", url: "/contact" }, ...(tokens?.user?.email ? [{ title: "Dashboard", url: "/dashboard" }] : [{ title: "Login", url: "/login" }])];
  return <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-sm"><div className="container-editorial flex items-center justify-between py-4"><Link href="/" className="font-serif text-xl">Rasel Shikder<span className="accent-dot">.</span></Link><ul className="hidden items-center gap-6 text-sm lg:flex">{menu.map((item) => <li key={item.url}><Link href={item.url} className="text-muted-foreground transition hover:text-accent">{item.title}</Link></li>)}</ul><div className="flex items-center gap-2"><ModeToggle /><Sheet><SheetTrigger asChild><Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation"><Menu /></Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle className="font-serif">Rasel Shikder<span className="accent-dot">.</span></SheetTitle></SheetHeader><div className="mt-8 flex flex-col gap-1">{menu.map((item) => <Link key={item.url} href={item.url} className="border-b border-border py-3 text-lg text-muted-foreground hover:text-accent">{item.title}</Link>)}</div></SheetContent></Sheet></div></div></nav>;
};
