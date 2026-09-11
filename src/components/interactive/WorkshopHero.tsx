"use client";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";

export function WorkshopHero() {
  const ref = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty(
      "--art-x",
      `${((event.clientX - rect.left) / rect.width - 0.5) * 10}px`,
    );
    ref.current?.style.setProperty(
      "--art-y",
      `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`,
    );
  }
  function reset() {
    ref.current?.style.setProperty("--art-x", "0px");
    ref.current?.style.setProperty("--art-y", "0px");
  }
  return (
    <div
      className="workshop-art"
      onPointerMove={move}
      onPointerLeave={reset}
      aria-hidden="true"
    >
      <span className="art-cross art-cross-tl">+</span>
      <span className="art-cross art-cross-br">+</span>
      <div ref={ref} className="workshop-art-image">
        <Image
          src="/images/workshop-sculpture.webp"
          alt=""
          width={1440}
          height={960}
          priority
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 55vw, 680px"
        />
      </div>
      <div className="art-annotation annotation-top">
        <span>01 / INTENT</span>
        <i />
      </div>
      <div className="art-annotation annotation-bottom">
        <i />
        <span>04 / WORKING CODE</span>
      </div>
      <svg className="art-path" viewBox="0 0 600 440" fill="none">
        <path d="M38 74H112V145M550 354H496V298" pathLength="1" />
      </svg>
      <div className="art-caption">
        <span>FIG. 01</span>
        <span>Good work has layers.</span>
        <span>↗</span>
      </div>
    </div>
  );
}
