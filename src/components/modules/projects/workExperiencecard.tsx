import { MotionDiv } from "../animations/motionElements";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ExperienceCardProps {
  companyName: string;
  role: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export function ExperienceCard({
  companyName,
  role,
  description,
  startDate,
  endDate,
}: ExperienceCardProps) {
  const formatDate = (date?: Date | null) => {
    if (!date) return "Present";
    if (!(date instanceof Date) || isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="w-full flex"
    >
      <Card className="w-full border border-border bg-white/90 dark:bg-slate-900/80 hover:shadow-md transition-shadow duration-300 flex flex-col">
        <CardHeader className="pb-2 flex flex-col items-start">
          <CardTitle className="text-lg md:text-xl font-semibold text-primary break-words w-full">
            {companyName}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground w-full truncate">
            {role}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-foreground/80 break-words">
            {description}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(startDate)} – {formatDate(endDate)}
          </p>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
