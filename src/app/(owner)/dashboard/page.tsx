import { Card, CardContent } from "@/components/ui/card";
import { getUserSession } from "@/lib/getUserSession";

interface BlogStatsResponse {
  stats: {
    totalBlog: number;
    totalViews: number;
    avgViews: number;
    totalExperience: number;
    totalProject: number;
  };
  featuredCount: number;
  lastWeekPostCount: number;
  lastMonthPostCount: number;
}

export default async function Page() {
  const token = await getUserSession();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/stats`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
    next: {
      revalidate: 60,
    },
  });

  const result = await res.json();
  const data: BlogStatsResponse = result.data;

  // Compact card component
  const CompactCard = ({
    title,
    value,
    description,
  }: {
    title: string;
    value: string | number;
    description?: string;
  }) => (
    <Card className="p-3">
      <CardContent className="flex flex-col items-start gap-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8 space-y-6">
      <header className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Blog Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your blogs and metrics
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <CompactCard title="Total Blogs" value={data.stats.totalViews} />
        <CompactCard title="Featured Blogs" value={data.featuredCount} />
        <CompactCard title="Total Views" value={data.stats.totalViews} />
        <CompactCard
          title="Average Views"
          value={data.stats.avgViews?.toFixed(0)}
        />
        <CompactCard title="Experiences" value={data.stats.totalExperience} />
        <CompactCard title="Projects" value={data.stats.totalProject} />
        <CompactCard title="Posts Last Week" value={data.lastWeekPostCount} />
        <CompactCard title="Posts Last Month" value={data.lastMonthPostCount} />
      </section>
    </main>
  );
}
