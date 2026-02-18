"use client";

import { useState, useEffect } from "react";
import { MAP_STYLES, MAP_STYLES_DARK } from "./map-styles";
import type { MapStyle } from "./map-styles";

export function useMapStyles(): MapStyle[] {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = () => setIsDark(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDark ? MAP_STYLES_DARK : MAP_STYLES;
}
