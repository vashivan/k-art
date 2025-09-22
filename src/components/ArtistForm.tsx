"use client";
import { useState } from "react";

export default function ArtistForm() {
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
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-xl justify-center items-center w-full">
      <label className="text-m font-bold self-start">Select place:</label>
      <select name="project" id="project">
        <option value="Lotte World Seoul 2026">Lotte World Seoul 2026</option>
        <option value="Lotte World Busan 2026">Lotte World Busan 2026</option>
        <option value="Gyeongju World 2026">Gyeongju World 2026</option>
      </select>

      <label className="text-m font-bold self-start">Full name:</label>
      <input name="fullName" placeholder="Full name" required className="border p-2 rounded-xl w-full mb-5" />

      <label className="text-m font-bold self-start">Email:</label>
      <input name="email" type="email" placeholder="Email" required className="border p-2 rounded-xl w-full mb-5" />

      <label className="text-m font-bold self-start">Phone number:</label>
      <input name="phone" placeholder="Phone" className="border p-2 rounded-xl w-full mb-5" />

      <label className="text-m font-bold self-start">Nationality:</label>
      <input name="country" placeholder="Country" className="border p-2 rounded-xl w-full mb-5" />

      <label className="text-m font-bold self-start">Current country/city:</label>
      <input name="city" placeholder="City" className="border p-2 rounded-xl w-full mb-5" />

      <label className="text-m font-bold self-start">Date of birth:</label>
      <input name="dateOfBirth" type="date" placeholder="Date of birth" className="border p-2 rounded-xl w-full mb-5" />

      <label className="text-m font-bold self-start">Body shape:</label>
      <input name="height" placeholder="Height (e.g. 175 cm)" className="border p-2 rounded-xl w-full" />
      <input name="weight" placeholder="Weight (e.g. 62 kg)" className="border p-2 rounded-xl w-full" />
      <input name="waist" placeholder="Waist (e.g. 70 cm)" className="border p-2 rounded-xl w-full" />
      <input name="bust" placeholder="Bust (e.g. 90 cm)" className="border p-2 rounded-xl w-full mb-5" />

      <label className="text-m font-bold self-start">Instagram name:</label>
      <input name="instagram" placeholder="Instagram" className="border p-2 rounded-xl w-full mb-5" />

      <label className="text-m font-bold self-start">Position:</label>
      <input name="position" placeholder="Dancer, acrobat, juggle etc." className="border p-2 rounded-xl w-full mb-5" />

      <label className="text-m font-bold self-start">Experience:</label>
      <p className="text-gray-500 self-start">In format: Place of work (date from - date to, city/country)</p>
      <textarea name="experience" placeholder="Lotte World (2018-2019, Seoul), Chimelong (2021-2022, China)..." className="border p-2 rounded-xl w-full mb-5" rows={5} />

      <label className="text-m font-bold self-start">Additional information:</label>
      <p className="text-gray-500 self-start">Here you can tell about your degree, awards or other additional skills yu have</p>
      <textarea name="additional" placeholder="Professional dancer with bachelor degree: Kyiv National University of Culture and Arts (2020-2024). Strong technique in modern and ballroom dancers. Skills in acrobatic, singing, acting etc....." className="border p-2 rounded-xl w-full mb-5" rows={5} />

      <label className="text-m font-bold self-start">Additional information:</label>
      <p className="text-gray-500 self-start">Here you can tell about your degree, awards or other additional skills yu have</p>
      <textarea name="following" placeholder="You can add some other links (video, promo, pictures etc.) to present yourself better or add following text about you." className="border p-2 rounded-xl w-full mb-5" rows={5} />

      <label className="text-m font-bold self-start">Photo (portrait / headshot)</label>
      <input name="photo" type="file" accept="image/*" className="border p-2 rounded-xl w-full mb-5" />
      <button type="submit" disabled={loading} className="bg-blue-700 text-white px-4 py-2 rounded-xl w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Sending..." : "Submit"}
      </button>
      {status === "success" && <p className="text-green-600">✅ Sent successfully</p>}
      {status === "error" && <p className="text-red-600">❌ Something went wrong</p>}
    </form>
  );
}
