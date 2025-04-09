import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-blue-800 via-black to-black text-white">
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
        Welcome to Product Manager 🚀
      </h1>
      <p className="text-lg text-gray-300 mb-10 max-w-xl">
        A Minimalistic and Powerful Product Management Web Application built to simplify your workflow.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Signup
        </Link>
        <Link
          href="/products"
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          View Products
        </Link>
      </div>
    </main>
  );
}