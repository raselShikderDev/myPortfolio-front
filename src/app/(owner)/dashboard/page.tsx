import { Card, CardContent } from "@/components/ui/card";
import { getUserSession } from "@/lib/getUserSession";
import { BASE_URL } from "@/lib/apiConfig";

interface BlogStats {
  totalBlog: number;
  totalViews: number;
  avgViews: number;
  totalExperience: number;
  totalProject: number;
}

interface BlogStatsData {
  stats: BlogStats;
  featuredCount: number;
  lastWeekPostCount: number;
  lastMonthPostCount: number;
}

interface BlogStatsResponse {
  data: BlogStatsData;
}

export default async function Page() {
  const token = await getUserSession();

  let data: BlogStatsData | null = null;
  let fetchError: string | null = null;

  if (token) {
    try {
      const res = await fetch(`${BASE_URL}/blogs/stats`, {
        method: "GET",
        headers: {
          Authorization: token as string,
        },
        next: {
          revalidate: 60,
        },
      });

      if (!res.ok) {
        fetchError = "Failed to load dashboard stats.";
      } else {
        const result: BlogStatsResponse = await res.json();
        data = result.data;
      }
    } catch {
      fetchError = "Failed to load dashboard stats.";
    }
  }

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
  console.log({ data });

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

      {fetchError ? (
        <section className="text-center py-8">
          <p className="text-red-500">{fetchError}</p>
        </section>
      ) : data ? (
        <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <CompactCard title="Total Blogs" value={data.stats.totalBlog} />
          <CompactCard title="Featured Blogs" value={data.featuredCount} />
          <CompactCard title="Total Views" value={data.stats.totalViews} />
          <CompactCard
            title="Average Views"
            value={data.stats.avgViews?.toFixed(0)}
          />
          <CompactCard title="Experiences" value={data.stats.totalExperience ?? 0} />
          <CompactCard title="Projects" value={data.stats.totalProject ?? 0} />
          <CompactCard title="Posts Last Week" value={data.lastWeekPostCount ?? 0} />
          <CompactCard title="Posts Last Month" value={data.lastMonthPostCount ?? 0} />
        </section>
      ) : null}
    </main>
  );
}