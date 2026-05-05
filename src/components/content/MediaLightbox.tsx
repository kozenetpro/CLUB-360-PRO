"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, ExternalLink, Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import { isSafeMediaUrl } from "@/lib/safe-url";

interface MediaLightboxProps {
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const SCALE_STEP = 0.25;

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(value.toFixed(2))));
}

function getDownloadName(src: string) {
  const cleanPath = src.split("?")[0] ?? src;
  const fileName = cleanPath.split("/").filter(Boolean).at(-1);

  return fileName || "image";
}

export default function MediaLightbox({ src, alt, children, className }: MediaLightboxProps) {
  const safeSrc = isSafeMediaUrl(src) ? src : "";
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef<{ pointerId: number; x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const titleId = useId();
  const scaled = scale > 1;

  const resetView = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const closeViewer = useCallback(() => {
    setOpen(false);
    resetView();
  }, [resetView]);

  const openViewer = () => {
    if (!safeSrc) {
      return;
    }

    resetView();
    setOpen(true);
  };

  const zoomBy = useCallback((delta: number) => {
    setScale((currentScale) => {
      const nextScale = clampScale(currentScale + delta);

      if (nextScale <= 1) {
        setOffset({ x: 0, y: 0 });
      }

      return nextScale;
    });
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!scaled) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    const dragStart = dragStartRef.current;

    if (!dragStart || dragStart.pointerId !== event.pointerId) {
      return;
    }

    setOffset({
      x: dragStart.offsetX + event.clientX - dragStart.x,
      y: dragStart.offsetY + event.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLImageElement>) => {
    if (dragStartRef.current?.pointerId === event.pointerId) {
      dragStartRef.current = null;
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "+" || event.key === "=") {
        zoomBy(SCALE_STEP);
      }

      if (event.key === "-") {
        zoomBy(-SCALE_STEP);
      }

      if (event.key === "0") {
        resetView();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeViewer, open, resetView, zoomBy]);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={openViewer}
        aria-label={`Open image: ${alt}`}
      >
        {children}
      </button>

      {open ? createPortal(
        <div
          className="media-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="media-lightbox-backdrop"
            aria-label="Close image preview"
            onClick={closeViewer}
          />
          <div className="media-lightbox-panel">
            <div className="media-lightbox-toolbar">
              <button type="button" onClick={() => zoomBy(-SCALE_STEP)} aria-label="Zoom out">
                <Minus size={16} />
              </button>
              <span>{Math.round(scale * 100)}%</span>
              <button type="button" onClick={() => zoomBy(SCALE_STEP)} aria-label="Zoom in">
                <Plus size={16} />
              </button>
              <button type="button" onClick={resetView} aria-label="Reset zoom">
                <RotateCcw size={16} />
              </button>
              <button type="button" onClick={() => setScale(2)} aria-label="View larger">
                <Maximize2 size={16} />
              </button>
              <a href={safeSrc} download={getDownloadName(safeSrc)} aria-label="Download image">
                <Download size={16} />
              </a>
              <a href={safeSrc} target="_blank" rel="noreferrer" aria-label="Open original image">
                <ExternalLink size={16} />
              </a>
              <button type="button" onClick={closeViewer} aria-label="Close image preview">
                <X size={16} />
              </button>
            </div>
            <span id={titleId} className="sr-only">
              {alt}
            </span>
            <div className="media-lightbox-stage" onClick={closeViewer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={safeSrc}
                alt={alt}
                className="media-lightbox-image"
                draggable={false}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onClick={(event) => event.stopPropagation()}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  if (scaled) {
                    resetView();
                  } else {
                    setScale(2);
                  }
                }}
                style={{
                  transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                  cursor: scaled ? "grab" : "zoom-in",
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}
