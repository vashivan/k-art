import ArtistForm  from "@/components/ArtistForm";

export default function Page() {
  return (
    <main className="p-10 flex flex-col w-full justify-center items-center">
      <h1 className="text-2xl font-bold mb-10">Please, fill the form below to apply</h1>
      <ArtistForm />
    </main>
  )
}