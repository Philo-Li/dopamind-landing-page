"use client";

import { useEffect } from "react";

interface MarketingBodyClassProps {
  className?: string;
}

export default function MarketingBodyClass({ className = "marketing-page" }: MarketingBodyClassProps) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);

  return null;
}
