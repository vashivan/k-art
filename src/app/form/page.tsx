import ArtistForm from "@/components/ArtistForm";
import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="p-10 flex flex-col w-full justify-center items-center">
      <h1 className="text-2xl font-bold mb-10 text-center">Please, fill the form below to apply</h1>
      <ArtistForm />
        <Link href="/" className="mt-5 text-bold text-xl underline">Back to home</Link>
    </main>
  )
}