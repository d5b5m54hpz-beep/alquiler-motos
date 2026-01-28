"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type Moto = {
  id: string;
  marca: string;
  modelo: string;
  patente: string;
  anio: number;
  estado: string;
  _count?: { contratos: number };
};

export default function MotosPage() {
  const { data: session } = useSession();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    patente: "",
    anio: new Date().getFullYear(),
    estado: "disponible",
  });

  useEffect(() => {
    fetchMotos();
  }, []);

  const fetchMotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/motos");
      if (!res.ok) throw new Error("No se pudieron obtener motos");
      const data = await res.json();
      setMotos(data);
    } catch (err: any) {
      setError(err.message || "Error cargando motos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!formData.marca.trim() || !formData.modelo.trim() || !formData.patente.trim()) {
      setError("Marca, modelo y patente son obligatorios");
      return;
    }

    setSubmitting(true);
    const url = editingId ? `/api/motos/${editingId}` : "/api/motos";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error guardando");
      }

      await fetchMotos();
      setShowForm(false);
      setEditingId(null);
      setFormData({ marca: "", modelo: "", patente: "", anio: new Date().getFullYear(), estado: "disponible" });
      setMessage(editingId ? "Moto actualizada" : "Moto creada");
    } catch (err: any) {
      setError(err.message || "Error guardando");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (moto: Moto) => {
    setFormData({
      marca: moto.marca,
      modelo: moto.modelo,
      patente: moto.patente,
      anio: moto.anio,
      estado: moto.estado,
    });
    setEditingId(moto.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar moto?")) return;
    try {
      const res = await fetch(`/api/motos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      await fetchMotos();
      setMessage("Moto eliminada");
    } catch (err: any) {
      setError(err.message || "Error eliminando");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Motos</h1>
        {session?.user && (session.user as any).role !== "auditor" && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ marca: "", modelo: "", patente: "", anio: new Date().getFullYear(), estado: "disponible" });
            }}
            style={{
              padding: "8px 16px",
              background: "#3b82f6",
              color: "white",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            {showForm ? "Cancelar" : "+ Nueva Moto"}
          </button>
        )}
      </div>

      {message && (
        <div style={{ marginBottom: 12, color: "#065f46", background: "#d1fae5", padding: 10, borderRadius: 6 }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ marginBottom: 12, color: "#991b1b", background: "#fee2e2", padding: 10, borderRadius: 6 }}>
          {error}
        </div>
      )}

      {showForm && session?.user && (session.user as any).role !== "auditor" && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#f9fafb",
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Marca *</label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Modelo *</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Patente *</label>
              <input
                type="text"
                value={formData.patente}
                onChange={(e) => setFormData({ ...formData, patente: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Año *</label>
              <input
                type="number"
                value={formData.anio}
                onChange={(e) => setFormData({ ...formData, anio: Number(e.target.value) })}
                required
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Estado *</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                }}
              >
                <option value="disponible">Disponible</option>
                <option value="alquilada">Alquilada</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 12,
              padding: "8px 16px",
              background: submitting ? "#9ca3af" : "#10b981",
              color: "white",
              borderRadius: 4,
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ padding: 12 }}>Cargando motos...</p>
      ) : motos.length === 0 ? (
        <p style={{ padding: 12 }}>No hay motos cargadas.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Marca</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Modelo</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Patente</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Año</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Estado</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Contratos</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {motos.map((moto) => (
              <tr key={moto.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 12 }}>{moto.marca}</td>
                <td style={{ padding: 12 }}>{moto.modelo}</td>
                <td style={{ padding: 12 }}>{moto.patente}</td>
                <td style={{ padding: 12 }}>{moto.anio}</td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      background:
                        moto.estado === "disponible"
                          ? "#d1fae5"
                          : moto.estado === "alquilada"
                          ? "#fef3c7"
                          : "#fee2e2",
                      color:
                        moto.estado === "disponible"
                          ? "#065f46"
                          : moto.estado === "alquilada"
                          ? "#92400e"
                          : "#991b1b",
                    }}
                  >
                    {moto.estado}
                  </span>
                </td>
                <td style={{ padding: 12 }}>{moto._count?.contratos || 0}</td>
                <td style={{ padding: 12 }}>
                  {session?.user && (session.user as any).role !== "auditor" ? (
                    <>
                      <button
                        onClick={() => handleEdit(moto)}
                        style={{
                          padding: "4px 8px",
                          background: "#3b82f6",
                          color: "white",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                          marginRight: 8,
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(moto.id)}
                        style={{
                          padding: "4px 8px",
                          background: "#ef4444",
                          color: "white",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <span style={{ color: "#6b7280" }}>Solo lectura</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
