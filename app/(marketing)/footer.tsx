import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/odia.png" 
            alt="Odia" 
            height={40} 
            width={80}
            className="mr-4 rounded-md"
          />
          Odia
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/telugu.png" 
            alt="Telugu" 
            height={40} 
            width={80}
            className="mr-4 rounded-md"
          />
          Telugu
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/tamil.png" 
            alt="Tamil" 
            height={40} 
            width={80}
            className="mr-4 rounded-md"
          />
          Tamil
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/kannad.png" 
            alt="Kannad" 
            height={40} 
            width={80}
            className="mr-4 rounded-md"
          />
          Kannad
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/bengali.png" 
            alt="Bengali" 
            height={40} 
            width={80}
            className="mr-4 rounded-md"
          />
          Bengali
        </Button>
      </div>
    </footer>
  );
};
