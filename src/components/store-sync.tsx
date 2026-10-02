"use client";

import { useEffect } from "react";
import { STORE_KEY, useStore } from "@/lib/store";

export function StoreSync() {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORE_KEY) {
        useStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
