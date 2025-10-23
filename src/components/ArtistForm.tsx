"use client";
import { useState } from "react";
import React from "react";
import Input from "./ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArtistForm() {
  const router  = useRouter();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/artist-application", {
        method: "POST",
        body: formData,
      });
      setStatus(res.ok ? "success" : "error");
      router.push("/");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-xl justify-center items-center w-full">
      <label className="text-m font-bold self-start">Enter name of the place you want to work at:</label>
      <Input name="project" placeholder="Exp. Lotte World Seoul 2026" />

      <label className="text-m font-bold self-start">Full name:</label>
      <Input name="fullName" placeholder="Full name" />

      <label className="text-m font-bold self-start">Email:</label>
      <Input name="email" type="email" placeholder="Email" />

      <label className="text-m font-bold self-start">Phone number:</label>
      <Input name="phone" placeholder="Phone" />

      <label className="text-m font-bold self-start">Nationality:</label>
      <p className="text-gray-500 self-start text-sm">Which coutry passport do you have</p>
      <Input name="country" placeholder="Country" />

      <label className="text-m font-bold self-start">Current country/city:</label>
      <Input name="city" placeholder="City"/>

      <label className="text-m font-bold self-start">Date of birth:</label>
      <Input name="dateOfBirth" type="date" placeholder="Date of birth" />

      <label className="text-m font-bold self-start">Body shape:</label>
      <Input name="height" placeholder="Height (e.g. 175 cm)" type="number" />
      <Input name="weight" placeholder="Weight (e.g. 62 kg)" type="number"  />
      <Input name="waist" placeholder="Waist (e.g. 70 cm)" type="number"  />
      <Input name="bust" placeholder="Bust (e.g. 90 cm)" type="number"  />

      <label className="text-m font-bold self-start">Instagram name:</label>
      <Input name="instagram" placeholder="Instagram" />

      <label className="text-m font-bold self-start">Telegram id:</label>
      <Input name="telegram" placeholder="Telegram" />

      <label className="text-m font-bold self-start">Position:</label>
      <Input name="position" placeholder="Dancer, acrobat, juggle etc." />

      <label className="text-m font-bold self-start">Experience:</label>
      <p className="text-gray-500 self-start text-sm">In format: Place of work (date from - date to, city/country)</p>
      <textarea name="experience" placeholder="Lotte World (2018-2019, Seoul), Chimelong (2021-2022, China)..." className="border-2 border-blue-900  p-2 w-full mb-5" rows={5} />

      <label className="text-m font-bold self-start">Additional information:</label>
      <p className="text-gray-500 self-start text-sm">Here you can tell about your degree, awards or other additional skills you have</p>
      <textarea name="additional" placeholder="Professional dancer with bachelor degree: Kyiv National University of Culture and Arts (2020-2024). Strong technique in modern and ballroom dancers. Skills in acrobatic, singing, acting etc....." className="border-2 border-blue-900  p-2 w-full mb-5"  rows={5} />

      <label className="text-m font-bold self-start">Photo (portrait / headshot)</label>
      <p className="text-gray-500 self-start text-sm">Click on the button below to upload picture</p>
      <input name="photo" type="file" accept="image/*" className="bg-blue-950 p-2 w-full mb-5 cursor-pointer text-white flex items-center" />
      <button type="submit" disabled={loading} className="bg-blue-950 text-white font-bold px-4 py-2 w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Sending..." : "Submit"}
      </button>
      <button className="bg-blue-950 text-white font-bold px-4 py-2 w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        <Link href="/">Back to home</Link>
      </button>
      {status === "success" && <p className="text-green-600">✅ Sent successfully</p>}
      {status === "error" && <p className="text-red-600">❌ Something went wrong</p>}
    </form>
  );
}
