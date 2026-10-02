"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function StoreSync() {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "guchini-demo-v2") {
        useStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
