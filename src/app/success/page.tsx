import styles from "../../style/MainPage.module.scss";
import Link from "next/link";

export default function Page() { 
  return(
        <div className={styles.container}>
      <div className={styles.container__black}></div>
      <main className={styles.container__main}>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
          Thank you for submitting your application!
        </h2>
        <p className="max-w-2xl text-lg text-white font-bold mb-8">
          Thank you — we’ve received your application.<br/>Our team will review it and contact you with the next steps. We appreciate your interest in working with K‑Art.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-700 text-white font-bold hover:bg-blue-600 transition">
          Come back to Home Page
        </Link>
      </main>
      {/* Footer */}
      <footer className={styles.container__footer}>
        © {new Date().getFullYear()} K-Art. All rights reserved.
      </footer>
    </div>
  )
}