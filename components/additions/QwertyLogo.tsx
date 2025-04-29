import Image from "next/image";

export default function QwertyLogo() {
  return (
    <div className="flex flex-col items-center p-6 bg-qwerty-white rounded-xl shadow-lg border-2 border-qwerty-dark-blue">
      <div className="relative w-40 h-40 mb-4">
        <Image 
          src="/logo/qwertyb.png" 
          alt="QWERTY Logo" 
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
      <p className="text-qwerty-dark-blue font-telegraph-medium text-xl text-center">
        Move the canvas freely
      </p>
      <p className="text-qwerty-gray text-sm mt-2 text-center max-w-xs">
        This infinite canvas will gradually fill with content based on viewer comments. Explore by dragging in any direction!
      </p>
    </div>
  );
}