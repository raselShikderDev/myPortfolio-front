import { serviceData } from "@/assets/assets";
import { MotionDiv, MotionH2, MotionP } from "../animations/motionElements";

const Services = () => (
  <section className="container-editorial scroll-mt-20 py-20 lg:py-28" id="services">
    <div className="mb-12 grid gap-5 border-t border-border pt-5 md:grid-cols-[0.7fr_1.3fr] md:items-end">
      <p className="section-label">What I do</p>
      <div><MotionH2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-4xl sm:text-5xl">A practical toolkit for ambitious ideas.</MotionH2><MotionP initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-5 max-w-2xl text-muted-foreground">From a first interface to the systems behind it, I work across the stack to make products feel considered, dependable, and easy to use.</MotionP></div>
    </div>
    <div className="divide-y divide-border border-y border-border">
      {serviceData.map(({ title, description }, index) => (
        <MotionDiv key={title} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="grid gap-3 py-6 md:grid-cols-[0.7fr_1.3fr] md:items-center">
          <div className="flex items-center gap-4"><span className="font-mono text-xs text-accent">0{index + 1}</span><h3 className="font-serif text-2xl">{title}</h3></div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{description}</p>
        </MotionDiv>
      ))}
    </div>
  </section>
);
export default Services;
