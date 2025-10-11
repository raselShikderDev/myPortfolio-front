import Link from "next/link";

export default function SomeThingWrong() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground dark:bg-background dark:text-foreground">
      <h1 className="text-6xl font-bold mb-4">Oops!</h1>
      <p className="text-lg mb-6 text-muted-foreground">
        Something went wrong. The page you are looking for doesn’t exist.
      </p>
      <Link href="/dashboard" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
        Go to Dashboard
      </Link>
    </div>
  );
}
