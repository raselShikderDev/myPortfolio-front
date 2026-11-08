import { Marquee } from "@/components/ui/marquee";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { BiLogoTypescript } from "react-icons/bi";
import { ComponentType } from "react";

interface TechIconProps {
  name: string;
  icon: ComponentType<{ className?: string }>;
}

const TechIcon = ({ name, icon: Icon }: TechIconProps) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <Icon className="text-2xl text-blue-600 dark:text-blue-400" />
      <span className="font-medium text-sm">
        {name}
      </span>
    </div>
  );
};

export const TechStackMarquee = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-2 overflow-hidden">
      <Marquee className="whitespace-nowrap">
        <div className="flex gap-4">
          <TechIcon name="React" icon={FaReact} />
          <TechIcon name="Node.js" icon={FaNodeJs} />
          <TechIcon name="Next.js" icon={RiNextjsFill} />
          <TechIcon name="TypeScript" icon={BiLogoTypescript} />
          <TechIcon name="React" icon={FaReact} />
          <TechIcon name="Node.js" icon={FaNodeJs} />
        </div>
      </Marquee>
    </div>
  );
};
