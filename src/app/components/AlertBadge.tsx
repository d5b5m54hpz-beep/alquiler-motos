"use client";

import { useEffect, useState } from "react";

export function AlertBadge() {
  const [count, setCount] = useState<number>(0);

  async function fetchCount() {
    try {
      const res = await fetch("/api/alertas/count", {
        cache: "no-store",
      });
      const data = await res.json();
      setCount(data.count ?? 0);
    } catch (e) {
      console.error("Error fetching alert count", e);
    }
  }

  useEffect(() => {
    // fetch inicial
    fetchCount();

    // polling cada 10 segundos
    const interval = setInterval(fetchCount, 10_000);

    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <span
      style={{
        backgroundColor: "#dc2626", // rojo
        color: "white",
        borderRadius: "999px",
        padding: "2px 8px",
        fontSize: "12px",
        marginLeft: "6px",
        fontWeight: "bold",
      }}
    >
      {count}
    </span>
  );
}
