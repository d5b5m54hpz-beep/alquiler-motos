"use client";

import { useEffect, useRef, useState } from "react";
import { AlertBadge } from "./AlertBadge";

type Alerta = {
  id: string;
  tipo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
};

export function AlertDropdown() {
  const [open, setOpen] = useState(false);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  async function fetchAlertas() {
    const res = await fetch("/api/alertas", { cache: "no-store" });
    const data: Alerta[] = await res.json();
    setAlertas(data.filter(a => !a.leida));
  }

  async function marcarLeida(id: string) {
    await fetch(`/api/alertas/${id}/leer`, { method: "POST" });
    await fetchAlertas();
    setOpen(false);
    window.location.href = "/alertas";
  }

  useEffect(() => {
    fetchAlertas();
  }, []);

  // cerrar al click afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => {
          setOpen(!open);
          fetchAlertas();
        }}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
        }}
        aria-label="Alertas"
      >
        🔔 <AlertBadge />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "120%",
            width: 320,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 1000,
          }}
        >
          <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
            <strong>Alertas</strong>
          </div>

          {alertas.length === 0 && (
            <div style={{ padding: 12, color: "#666" }}>
              No hay alertas nuevas.
            </div>
          )}

          {alertas.map((a) => (
            <div
              key={a.id}
              onClick={() => marcarLeida(a.id)}
              style={{
                padding: 12,
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: 600 }}>{a.tipo}</div>
              <div style={{ fontSize: 13 }}>{a.mensaje}</div>
              <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>
                {new Date(a.createdAt).toLocaleString()}
              </div>
            </div>
          ))}

          <div style={{ padding: 10, textAlign: "center" }}>
            <a href="/alertas" style={{ fontSize: 13 }}>
              Ver todas
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
