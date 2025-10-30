"use client";
import { useState } from "react";
import React from "react";
import Input from "./ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArtistForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

// Стиснення + збереження EXIF-орієнтації, якщо можливо
async function compressImage(
  file: File,
  { maxSide = 1600, quality = 0.85 }: { maxSide?: number; quality?: number } = {}
): Promise<Blob> {
  // Спроба через createImageBitmap (краще з орієнтацією)
  try {
    // @ts-ignore: imageOrientation опціонально підтримується
    const bmp: ImageBitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();

    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b || new Blob()), "image/jpeg", quality)
    );

    return blob.size ? blob : file; // fallback якщо раптом пусто
  } catch {
    // Фолбек через <img> (деякі браузери можуть ігнорити EXIF в canvas)
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });

    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b || new Blob()), "image/jpeg", quality)
    );

    return blob.size ? blob : file;
  }
}

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);
  setStatus("idle");

  try {
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // Стискаємо фото, якщо воно велике (наприклад > 3 МБ)
    const input = formEl.elements.namedItem("photo") as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (file && file.size > 3 * 1024 * 1024) {
      // можна підкрутити поріг, розмір і якість
      const compressed = await compressImage(file, { maxSide: 1600, quality: 0.85 });
      // Підміняємо у FormData тим самим полем 'photo'
      fd.set("photo", new File([compressed], "photo.jpg", { type: "image/jpeg" }));
    }

    const res = await fetch("/api/artist-application", {
      method: "POST",
      body: fd, // не став заголовок Content-Type — браузер виставить boundary сам
    });

    setStatus(res.ok ? "success" : "error");

    // Перенаправлення після короткої паузи
    if (res.ok) {
      setTimeout(() => {
        router.push("/success");
      }, 1200);
    }
  } catch (err) {
    console.error(err);
    setStatus("error");
  } finally {
    setLoading(false);
  }
}


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-xl justify-center items-center w-full">
      <label className="text-m font-bold self-start">Enter name of the place you want to work at:</label>
      <p className="text-gray-500 self-start text-sm">Fill in this field with the name of the place you want to apply to.</p>
      <Input name="project" placeholder="Lotte World Seoul 2026" />

      <label className="text-m font-bold self-start">Full name:</label>
      <p className="text-gray-500 self-start text-sm">Please, enter your real name exactly as in your passport.</p>
      <Input name="fullName" placeholder="Full name" />

      <label className="text-m font-bold self-start">Email:</label>
      <p className="text-gray-500 self-start text-sm">Please, provide your real email so we can contact you directly.</p>
      <Input name="email" type="email" placeholder="Email" />

      <label className="text-m font-bold self-start">Phone number:</label>
       <p className="text-gray-500 self-start text-sm">Enter you phone number in international format, please. It helps us to contact with you properly without any hesitation.</p>
      <Input name="phone" placeholder="Phone" />

      <label className="text-m font-bold self-start">Nationality:</label>
      <p className="text-gray-500 self-start text-sm">Which coutry passport do you hold? This information is required because in some cases we may not be able to obtain a work visa for you.</p>
      <Input name="country" placeholder="Country" />

      <label className="text-m font-bold self-start">Current country/city:</label>
      <Input name="city" placeholder="City" />

      <label className="text-m font-bold self-start">Date of birth:</label>
      <Input name="dateOfBirth" type="date" placeholder="Date of birth" />

      <label className="text-m font-bold self-start">Body shape:</label>
      <Input name="height" placeholder="Height (e.g. 175 cm)" type="number" />
      <Input name="weight" placeholder="Weight (e.g. 62 kg)" type="number" />
      <Input name="waist" placeholder="Waist (e.g. 70 cm)" type="number" />
      <Input name="bust" placeholder="Bust (e.g. 90 cm)" type="number" />

      <label className="text-m font-bold self-start">Instagram name:</label>
      <Input name="instagram" placeholder="Instagram" />

      <label className="text-m font-bold self-start">Telegram id:</label>
      <Input name="telegram" placeholder="Telegram" />

      <label className="text-m font-bold self-start">Position:</label>
      <Input name="position" placeholder="Dancer, acrobat, juggle etc." />

      <label className="text-m font-bold self-start">Experience:</label>
      <p className="text-gray-500 self-start text-sm">In format: Place of work (date from - date to, city/country)</p>
      <textarea name="experience" placeholder="Lotte World (2018-2019, Seoul), Chimelong (2021-2022, China)..." className="border-2 border-blue-900  p-2 w-full mb-5" rows={5} />

      <label className="text-m font-bold self-start">Education (University or College):</label>
      <p className="text-gray-500 self-start text-sm">Enter your degree(s), institution(s), field of study and years attended.</p>
      <textarea name="education" placeholder="Bachelor of Arts in Dance — Kyiv National University of Culture and Arts (2016–2020)" className="border-2 border-blue-900  p-2 w-full mb-5" rows={5} />

      <label className="text-m font-bold self-start">Additional information:</label>
      <p className="text-gray-500 self-start text-sm">Here you can tell about your degree, awards or other additional skills you have</p>
      <textarea name="additional" placeholder="Professional dancer with bachelor degree. Strong technique in modern and ballroom dancers. Skills in acrobatic, singing, acting etc....." className="border-2 border-blue-900  p-2 w-full mb-5" rows={5} />

      <label className="text-m font-bold self-start">Photo (portrait / headshot)</label>
      <p className="text-gray-500 self-start text-sm">Click on the button below to upload picture.</p>
      <input name="photo" type="file" accept="image/*" className="bg-blue-950 p-2 w-full mb-5 cursor-pointer text-white flex items-center" />
        <p className="text-gray-500 text-justify text-sm">
          *by submitting this form I confirm that I agree to send my personal information and consent to its use by the company to contact me and assist in finding employment.
        </p>
      <button type="submit" disabled={loading} className="bg-blue-950 text-white font-bold px-4 py-2 w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Sending..." : "Submit"}
      </button>
      {status === "success" && <p className="text-green-600">✅ Sent successfully. Thank you.</p>}
      {status === "error" && <p className="text-red-600">❌ Something went wrong. Try again later.</p>}
    </form>
  );
}
