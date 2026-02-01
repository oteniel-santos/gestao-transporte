"use client";

import { useEffect } from "react";

export function SyncOnline() {
  useEffect(() => {
    function handleOnline() {
      console.log("🔄 Voltou online, sincronizar...");
      // aqui entra sua lógica de sync
    }

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null; // não renderiza nada
}
