import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 dark:bg-gray-950">
      <div className="w-full max-w-md text-center">
        <p className="text-6xl font-bold text-red-500">404</p>

        <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-300 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
