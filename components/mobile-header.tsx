import Link from "next/link";
import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
  return (
    <nav className="lg:hidden fixed top-0 w-full h-[50px] bg-[#7C3AED] z-50 flex items-center border-b border-purple-700 px-4">
      <MobileSidebar />
      <div className="flex-1 flex justify-center">
        <Link href="/">
          <span className="text-white font-extrabold text-xl tracking-wide">
            Bol Bol Ke
          </span>
        </Link>
      </div>
      <div className="w-[50px]" /> {/* balanced spacing for symmetry */}
    </nav>
  );
};