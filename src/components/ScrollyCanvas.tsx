"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import Overlay from "./Overlay";
import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import {
  FRAME_COUNT,
  sequenceFrames,
} from "@/assets/sequenceFrames";

const READY_RATIO = 0.4;
const CHECKPOINTS = [0, 0.5, 1] as const;
const CHECKPOINT_LOCK_MS = 1000;
const SWIPE_THRESHOLD_PX = 42;
const HERO_RELOCK_RATIO = 0.99;

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

  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const touchStartYRef = useRef<number | null>(null);
  const progress = useMotionValue(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const checkpointLockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasExitedHeroAfterUnlockRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const [isCheckpointLocked, setIsCheckpointLocked] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (!scrollUnlocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }

    const preventEvent = (event: Event) => {
      if (!scrollUnlocked) {
        event.preventDefault();
      }
    };

    const preventKeys = (event: KeyboardEvent) => {
      if (scrollUnlocked) return;

      const blockedKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

    window.addEventListener("touchmove", preventEvent, { passive: false });
    window.addEventListener("keydown", preventKeys);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("touchmove", preventEvent);
      window.removeEventListener("keydown", preventKeys);
    };
  }, [scrollUnlocked]);

  useEffect(() => {
    if (!scrollUnlocked) {
      hasExitedHeroAfterUnlockRef.current = false;
      return;
    }

    const handleScrollRelock = () => {
      const hero = heroRef.current;
      if (!hero) return;

      const viewportHeight = window.innerHeight;
      const rect = hero.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
      );
      const visibleRatio = viewportHeight > 0 ? visibleHeight / viewportHeight : 0;

      if (visibleRatio < HERO_RELOCK_RATIO) {
        hasExitedHeroAfterUnlockRef.current = true;
      }

      if (hasExitedHeroAfterUnlockRef.current && visibleRatio >= HERO_RELOCK_RATIO) {
        setScrollUnlocked(false);
        hasExitedHeroAfterUnlockRef.current = false;
      }
    };

    window.addEventListener("scroll", handleScrollRelock, { passive: true });
    handleScrollRelock();
    return () => {
      window.removeEventListener("scroll", handleScrollRelock);
    };
  }, [scrollUnlocked]);

  const lockCheckpointNavigation = () => {
    setIsCheckpointLocked(true);

    if (checkpointLockTimeoutRef.current) {
      clearTimeout(checkpointLockTimeoutRef.current);
    }

    checkpointLockTimeoutRef.current = setTimeout(() => {
      setIsCheckpointLocked(false);
    }, CHECKPOINT_LOCK_MS);
  };

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
              Math.floor(progress.get() * FRAME_COUNT)
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
  }, [progress]);

  // Update canvas when checkpoint animation changes progress
  useMotionValueEvent(progress, "change", (latest) => {
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

  const goNextCheckpoint = () => {
    if (isCheckpointLocked) return;

    lockCheckpointNavigation();

    if (checkpointIndex >= CHECKPOINTS.length - 1) {
      setScrollUnlocked(true);
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const nextIndex = checkpointIndex + 1;
    setCheckpointIndex(nextIndex);
    animationRef.current?.stop();
    animationRef.current = animate(progress, CHECKPOINTS[nextIndex], {
      duration: 0.9,
      ease: "easeInOut",
    });
  };

  const goPrevCheckpoint = () => {
    if (isCheckpointLocked) return;
    if (checkpointIndex <= 0) return;

    lockCheckpointNavigation();

    const prevIndex = checkpointIndex - 1;
    setCheckpointIndex(prevIndex);
    animationRef.current?.stop();
    animationRef.current = animate(progress, CHECKPOINTS[prevIndex], {
      duration: 0.9,
      ease: "easeInOut",
    });
  };

  useEffect(() => {
    const handleWheelNavigation = (event: WheelEvent) => {
      if (scrollUnlocked) return;

      event.preventDefault();

      if (!isReady || isCheckpointLocked) return;

      const threshold = 16;
      if (event.deltaY > threshold) {
        goNextCheckpoint();
      } else if (event.deltaY < -threshold) {
        goPrevCheckpoint();
      }
    };

    window.addEventListener("wheel", handleWheelNavigation, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheelNavigation);
    };
  }, [goNextCheckpoint, goPrevCheckpoint, isCheckpointLocked, isReady, scrollUnlocked]);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (scrollUnlocked || !isReady) return;
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (scrollUnlocked || !isReady || isCheckpointLocked) return;

      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;
      touchStartYRef.current = null;

      if (startY == null || endY == null) return;

      const deltaY = startY - endY;
      if (deltaY > SWIPE_THRESHOLD_PX) {
        goNextCheckpoint();
      } else if (deltaY < -SWIPE_THRESHOLD_PX) {
        goPrevCheckpoint();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goNextCheckpoint, goPrevCheckpoint, isCheckpointLocked, isReady, scrollUnlocked]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (imagesRef.current.length > 0) {
        const ctx = canvas.getContext("2d");
        const latestInfo = progress.get();
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
  }, [progress, isReady]);

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
      if (checkpointLockTimeoutRef.current) {
        clearTimeout(checkpointLockTimeoutRef.current);
      }
    };
  }, []);

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
      ref={heroRef}
      style={{ position: "relative" }}
      className="relative w-full hero-dvh bg-black"
      aria-busy={!isReady}
    >
      <div className="w-full hero-dvh overflow-hidden bg-[#050505]">
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
            <Overlay scrollYProgress={progress} />
          </div>
        ) : null}

        {isReady ? (
          <div
            className="absolute inset-x-0 z-30 flex flex-col items-center gap-4 pointer-events-auto px-4"
            style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center gap-2">
              {CHECKPOINTS.map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    index <= checkpointIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            <div className="flex w-full max-w-md items-center justify-center gap-3">
              <button
                type="button"
                onClick={goPrevCheckpoint}
                disabled={checkpointIndex === 0 || isCheckpointLocked}
                className="flex-1 sm:flex-none rounded-full border border-white/40 bg-white/10 backdrop-blur px-4 md:px-6 py-3 text-xs md:text-base uppercase tracking-[0.14em] text-white hover:bg-white/20 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t(ui.sequencePrevCheckpoint)}
              </button>

              <button
                type="button"
                onClick={goNextCheckpoint}
                disabled={isCheckpointLocked}
                className="flex-1 sm:flex-none rounded-full border border-white/40 bg-white/10 backdrop-blur px-4 md:px-6 py-3 text-xs md:text-base uppercase tracking-[0.14em] text-white hover:bg-white/20 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {checkpointIndex >= CHECKPOINTS.length - 1
                  ? t(ui.sequenceGoProjects)
                  : t(ui.sequenceNextCheckpoint)}
              </button>
            </div>
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
