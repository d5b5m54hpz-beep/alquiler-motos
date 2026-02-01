"use client";

import { useEffect, useState } from "react";

type Factura = {
  id: string;
  numero: string;
  monto: number;
  estado: string;
  emitidaAt: string;
  contrato: {
    cliente: { nombre: string };
    moto: { patente: string };
  };
};

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/facturas", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setFacturas(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando facturas…</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Facturas</h1>

      {facturas.length === 0 && <p>No hay facturas emitidas.</p>}

      {facturas.length > 0 && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Número</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Cliente</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Moto</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Monto</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Estado</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Fecha</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((f) => (
              <tr key={f.id}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{f.numero}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{f.contrato.cliente.nombre}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{f.contrato.moto.patente}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>${f.monto}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{f.estado}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{new Date(f.emitidaAt).toLocaleDateString()}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  <a
                    href={`/api/facturas/${f.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    📥 Descargar PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
