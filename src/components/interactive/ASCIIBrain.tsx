import Image from "next/image";

interface ASCIIBrainProps {
  className?: string;
}

export function ASCIIBrain({ className = "" }: ASCIIBrainProps) {
  return (
    <div
      aria-hidden="true"
      className={`ascii-brain-stage ${className}`}
    >
      <div className="ascii-brain-turn">
        <Image
          src="/images/ascii-brain.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-contain"
        />
        <div className="ascii-brain-scan" />
      </div>
    </div>
  );
}
