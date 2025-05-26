// /home/edtech1985/Documents/Digibee/app/intercom/intercom-esc-tkt/src/app/page.tsx

"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetchInitialCanvas();
  }, []);

  async function fetchInitialCanvas() {
    try {
      const response = await fetch("/api/initialize", { method: "POST" });
      const data = await response.json();
      console.log("Initial Canvas:", data);
    } catch (error) {
      console.error("Failed to fetch initial canvas", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Intercom Canvas Kit Demo
      </h1>
      <p className="text-center text-gray-700 dark:text-gray-300 max-w-xl">
        Esse é um projeto exemplo para integração com Intercom Canvas Kit.
        Confira o console do navegador para ver o objeto inicial retornado pelo
        endpoint <code>/api/initialize</code>.
      </p>
    </main>
  );
}
