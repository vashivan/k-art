// app/page.tsx
'use client'
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../style/MainPage.module.scss";
import Image from "next/image";

const images = [
  '/bg1.jpg',
  '/bg2.jpg',
  '/bg3.jpg',
  '/bg4.jpg',
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  });

  return (
    <div className={styles.container}>
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`Background ${i}`}
          fill
          priority={i === 0}
          className={`object-cover md:object-fill transition-opacity duration-1200 ${i === index ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}
      <div className={styles.container__black}></div>
      <main className={styles.container__main}>
        <p className="max-w-2xl text-lg md:text-xl text-white text-shadow-lg font-extrabold mb-8 leading-relaxed text-justify">
          <span>
            <Image
              src="/logo.PNG"
              alt="logo"
              width={120}
              height={0}
              className="inline-block align-bottom mr-2"
            />
            <span>is a company </span>
            <span>that provides performance opportunities and contracts for international artists in Korea.</span>
          </span>{" "}
          Join our global community of artists and dancers by filling out a short application form to take part in an audition.
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
