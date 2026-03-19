"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Overlay from "./Overlay";
import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import {
  FRAME_COUNT,
  sequenceFrames,
} from "@/assets/sequenceFrames";

const READY_RATIO = 0.4;

const findClosestLoadedFrame = (
  frames: Array<HTMLImageElement | undefined>,
  frameIndex: number
) => {
  const exact = frames[frameIndex];
  if (exact?.complete && exact.naturalWidth > 0) return exact;

  for (let distance = 1; distance < FRAME_COUNT; distance++) {
    const left = frameIndex - distance;
    const right = frameIndex + distance;

    if (left >= 0) {
      const leftImage = frames[left];
      if (leftImage?.complete && leftImage.naturalWidth > 0) return leftImage;
    }

    if (right < FRAME_COUNT) {
      const rightImage = frames[right];
      if (rightImage?.complete && rightImage.naturalWidth > 0) return rightImage;
    }
  }

  return undefined;
};

export default function ScrollyCanvas() {
  const t = useT();
  const ui = translations.ui;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const [isReady, setIsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Preload Images
  useEffect(() => {
    let isCancelled = false;
    const loadArray: Array<HTMLImageElement | undefined> = new Array(FRAME_COUNT);
    imagesRef.current = loadArray;

    const readyTarget = Math.max(1, Math.ceil(FRAME_COUNT * READY_RATIO));
    let loadedCount = 0;
    let readyTriggered = false;

    const preload = () => {
      const selectedFrames = sequenceFrames;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = "async";
        if (i < 4) {
          img.fetchPriority = "high";
        }
        img.src = selectedFrames[i].src;

        const checkDone = () => {
          if (isCancelled) return;

          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));

          if (!readyTriggered && loadedCount >= readyTarget) {
            readyTriggered = true;
            setIsReady(true);

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            const currentFrameIndex = Math.min(
              FRAME_COUNT - 1,
              Math.floor(scrollYProgress.get() * FRAME_COUNT)
            );
            const firstVisibleFrame = findClosestLoadedFrame(loadArray, currentFrameIndex);

            if (ctx && canvas && firstVisibleFrame) {
              drawObjectFitCover(ctx, canvas, firstVisibleFrame);
            }
          }
        };

        img.onload = () => {
          loadArray[i] = img; // Ensure order is exact
          checkDone();
        };

        img.onerror = () => {
          console.error(`Frame ${i} failed to load`);
          checkDone(); // Failsafe to not break the scroll entirely
        };
      }
    };

    preload();

    return () => {
      isCancelled = true;
    };
  }, [scrollYProgress]);

  // Update canvas on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isReady || imagesRef.current.length !== FRAME_COUNT || !canvasRef.current) return;
    
    // Map scroll progress (0-1) to frame index (0-159)
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );

    const frame = findClosestLoadedFrame(imagesRef.current, frameIndex);
    const ctx = canvasRef.current.getContext("2d");
    if (ctx && frame) {
      drawObjectFitCover(ctx, canvasRef.current, frame);
    }
  });

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (imagesRef.current.length > 0) {
        const ctx = canvas.getContext("2d");
        const latestInfo = scrollYProgress.get();
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(latestInfo * FRAME_COUNT)
        );
        const frame = findClosestLoadedFrame(imagesRef.current, frameIndex);
        if (ctx && frame) {
          drawObjectFitCover(ctx, canvas, frame);
        }
      }
    };

    handleResize(); // Initial resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scrollYProgress, isReady]);

  // Draw image replicating CSS object-fit: cover
  const drawObjectFitCover = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
    const y = (canvasHeight / 2) - (imgHeight / 2) * scale;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: "relative" }}
      className="relative w-full h-[800vh] bg-black"
      aria-busy={!isReady}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#050505]">
        {/* Canvas Engine */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
        />
        
        {/* Overlay Content */}
        {isReady ? (
          <div className="absolute inset-0 z-10 pointer-events-none animate-in fade-in duration-500">
            <Overlay scrollYProgress={scrollYProgress} />
          </div>
        ) : null}

        {!isReady ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 text-white/90">
            <div className="h-14 w-14 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            <p className="text-sm md:text-base tracking-[0.2em] uppercase text-white/70">
              {t(ui.sequenceLoading)}
            </p>
            <div className="w-55 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-xs tracking-[0.2em] text-white/60">{loadingProgress}%</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
