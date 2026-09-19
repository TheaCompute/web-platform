"use client";

import { useEffect, useRef, useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className = "" }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const id = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(id);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className={[
        "fixed inset-0 z-50 flex items-center justify-center px-4",
        "bg-ink/40 backdrop-blur-sm",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "sticker relative w-full max-h-[90vh] overflow-y-auto rounded-[28px]",
          "transition-all duration-200",
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
