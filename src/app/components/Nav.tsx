'use client'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
/**
 *
 *
 * @return {*} 
 */
const Nav = () => {
    const router = useRouter()
    const redirectLink = () => {
        router.push('/signin')
    }

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between px-8 py-1 
                      backdrop-blur-md bg-white/5 
                      border-b border-white/10">

        {/* Logo */}
        <div>
            <Link href={'/'}>
            <Image
            src="/Logo.png" alt="Logo" width={180} height={30} priority
                className="h-18 object-contain"
            />
          </Link>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-white/80">
          <Link href="#">Attendance</Link>
          <Link href="#">Fees</Link>
          <Link href="#">Homework</Link>
          <Link href="#">Admissions</Link>
          <Link href="#">Exams</Link>
          <Link href="/about">About</Link>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button className="text-white/70 hover:text-white transition"
          onClick={redirectLink}>
            Sign In
          </button>

          <button className="bg-white text-black px-5 py-2 rounded-full 
                             font-medium hover:bg-gray-200 transition">
            Get Started →
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;