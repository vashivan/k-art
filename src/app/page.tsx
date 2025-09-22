// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-blue-600">K-Art</h1>
          <nav className="hidden sm:flex items-center gap-6 text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/form" className="hover:text-blue-600">Application</Link>
            <a href="#about" className="hover:text-blue-600">About</a>
          </nav>
          <Link
            href="/form"
            className="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            Apply Now
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
          Become Part of <span className="text-blue-600">K-Art</span>
        </h2>
        <p className="max-w-2xl text-lg text-gray-600 mb-8">
          Join our international community of artists and dancers.  
          Fill out a short application form, and we will create a professional PDF profile for you,
          sent directly to our partner companies.
        </p>
        <Link
          href="/form"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition text-lg font-medium"
        >
          Fill Out the Application
        </Link>
      </main>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Why K-Art?</h3>
          <p className="text-gray-600 text-lg">
            We connect talented dancers with top companies and events across Korea and worldwide.  
            Our platform makes applying easy and professional — you send us your details, 
            we generate a polished PDF profile, and employers receive it directly.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} K-Art. All rights reserved.
      </footer>
    </div>
  );
}
