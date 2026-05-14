import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center">
        <p className="text-8xl font-bold text-[#03254c] mb-2">404</p>
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary py-2.5 px-6">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
