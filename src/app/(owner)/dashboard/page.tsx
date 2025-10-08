import { Card, CardContent } from "@/components/ui/card";

export default async function Page() {
  let stats = {
    totalBlog: 0,
    totalViews: 0,
    avgViews: 0,
    minViews: 0,
    maxViews: 0,
  };

  let featured = {
    count: 0,
    topPost: null as { title: string } | null,
  };

  let lastWeekPostCount = 0;
  let lastMonthPostCount = 0;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/all`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const result = await res.json();
    const data = result.data;

    stats = data?.stats ?? stats;
    featured = data?.featured ?? featured;
    lastWeekPostCount = data?.lastWeekPostCount ?? 0;
    lastMonthPostCount = data?.lastMonthPostCount ?? 0;
  } catch (error) {
    console.error("Failed to fetch blogs, using default stats:", error);
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
        <CompactCard title="Total Blogs" value={stats.totalBlog} />
        <CompactCard title="Total Views" value={stats.totalViews} />
        <CompactCard title="Average Views" value={stats.avgViews?.toFixed(0)} />
        <CompactCard title="Min Views" value={stats.minViews} />
        <CompactCard title="Max Views" value={stats.maxViews} />
        <CompactCard
          title="Featured Blogs"
          value={featured.count}
          description={
            featured.topPost ? `Top: ${featured.topPost.title}` : "No top post"
          }
        />
        <CompactCard title="Posts Last Week" value={lastWeekPostCount} />
        <CompactCard title="Posts Last Month" value={lastMonthPostCount} />
      </section>
    </main>
  );
}
