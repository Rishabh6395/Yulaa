import Image from "next/image";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="text-center text-white p-4">
        <h1 className="font-sans mb-4 text-[3rem] font-extrabold animate-fadeUp leading-tight">
          The Modern
          <br />
          <span className="bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            School OS
          </span>
          <br />
          You&apos;ve Been Waiting For
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          A unified platform for admissions, attendance, homework, fees,
          <br /> transport, and academic results — all in one beautiful
          interface.
        </p>
      </div>
    </div>
  );
}
