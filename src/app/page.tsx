import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      <img
        src="/backgound.jpg"
        alt="Background Image"
        className="absolute inset-0 w-full h-full object-cover z-0" 
      />
      <div className="relative z-10 text-center text-white p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Website</h1>
        <p className="text-lg">This is the best place to explore!</p>
      </div>
    </div>
  );
}
