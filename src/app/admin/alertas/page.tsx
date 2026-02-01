"use client";

import { useEffect, useRef, useState } from "react";

type Alerta = {
  id: string;
  tipo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
};

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  async function fetchAlertas() {
    try {
      const res = await fetch("/api/alertas", { cache: "no-store" });
      const data = await res.json();
      setAlertas(data);
      setLoading(false);
    } catch (e) {
      console.error("Error cargando alertas", e);
      setLoading(false);
    }
  }

  async function marcarLeida(id: string) {
    await fetch(`/api/alertas/${id}/leer`, { method: "POST" });
    await fetchAlertas();
  }

  useEffect(() => {
    // carga inicial
    fetchAlertas();

    // polling cada 10 segundos
    intervalRef.current = setInterval(fetchAlertas, 10_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Alertas</h1>

      {loading && <p>Cargando alertas…</p>}

      {!loading && alertas.length === 0 && <p>No hay alertas.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {alertas.map((a) => (
          <li
            key={a.id}
            style={{
              marginBottom: 12,
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 6,
              background: a.leida ? "#f9f9f9" : "#ffffff",
            }}
          >
            <strong>{a.tipo}</strong>
            <p style={{ margin: "6px 0" }}>{a.mensaje}</p>
            <small>{new Date(a.createdAt).toLocaleString()}</small>

            {!a.leida && (
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => marcarLeida(a.id)}
                  style={{
                    padding: "6px 12px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Marcar como leída
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
