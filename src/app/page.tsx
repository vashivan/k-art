// app/page.tsx
import Link from "next/link";
import styles from "../style/MainPage.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.container__black}></div>
      <main className={styles.container__main}>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
          Become Part of <span className="text-blue-600">K-Art</span>
        </h2>
        <p className="max-w-2xl text-lg text-white font-bold mb-8">
          Join our international community of artists and dancers.  
          Fill out a short application form, and we will sent your profile directly to our partner companies.
        </p>
        <Link
          href="/form"
          className="px-6 py-3 bg-blue-700 text-white font-bold hover:bg-blue-600 transition">
          Fill Out the Application
        </Link>
      </main>
      {/* Footer */}
      <footer className={styles.container__footer}>
        © {new Date().getFullYear()} K-Art. All rights reserved.
      </footer>
    </div>
  );
}
