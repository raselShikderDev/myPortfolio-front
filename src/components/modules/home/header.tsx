import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import { assets } from "@/assets/assets";
import { MotionDiv, MotionH2, MotionH3, MotionP } from "../animations/motionElements";

const Header = () => (
  <section className="container-editorial flex min-h-[calc(100dvh-76px)] items-center py-16 lg:py-24">
    <div className="grid w-full items-center gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
      <div>
        <MotionP initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-label mb-7">Available for thoughtful collaborations</MotionP>
        <MotionH2 initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-5 flex items-center gap-3 font-serif text-xl sm:text-2xl">Hi, I&apos;m Rasel <span className="text-2xl">✦</span></MotionH2>
        <MotionH3 initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }} className="max-w-4xl font-serif text-5xl leading-[0.98] sm:text-7xl lg:text-[6.5rem]">I build digital products with <em className="text-accent">clarity</em>.</MotionH3>
        <MotionP initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.25 }} className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">MERN stack developer based in Dhaka, Bangladesh. I turn complex ideas into fast, accessible, and useful web experiences.</MotionP>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-primary-foreground transition hover:bg-accent">Start a conversation <ArrowUpRight data-icon="inline-end" /></Link>
          <Link href="/rasel_resume.pdf" download className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm transition hover:border-accent hover:text-accent">Download resume <Download data-icon="inline-end" /></Link>
        </div>
      </div>
      <MotionDiv initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="relative mx-auto w-full max-w-sm lg:ml-auto">
        <div className="absolute -right-3 -top-3 h-full w-full border border-accent" />
        <div className="relative border border-border bg-card p-3">
          <Image src={assets.profile_img} alt="Portrait of Rasel Shikder" className="aspect-[4/5] w-full object-cover grayscale" priority />
          <div className="flex items-center justify-between border-t border-border px-1 pb-1 pt-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin data-icon="inline-start" /> Dhaka, Bangladesh</span><span className="font-mono">01 / 01</span></div>
        </div>
      </MotionDiv>
    </div>
  </section>
);
export default Header;
