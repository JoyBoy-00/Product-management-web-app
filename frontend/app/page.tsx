import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Product Manager 🚀</h1>
      <p className="text-lg text-gray-600 mb-8">
        A Minimilistic Project Management Web Application.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Signup
        </Link>
        <Link
          href="/products"
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition"
        >
          View Products
        </Link>
      </div>
    </main>
  );
}