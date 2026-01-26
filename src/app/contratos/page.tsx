"use client";
import { useState, useEffect } from "react";

type Contrato = {
  id: string;
  clienteId: string;
  motoId: string;
  fechaInicio: string;
  fechaFin: string;
  precioSemana: number;
  estado: string;
  cliente?: { nombre: string };
  moto?: { marca: string; modelo: string; patente: string };
  _count?: { pagos: number };
};

type Cliente = { id: string; nombre: string };
type Moto = { id: string; marca: string; modelo: string; patente: string };

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clienteId: "",
    motoId: "",
    fechaInicio: "",
    fechaFin: "",
    precioSemana: 0,
    estado: "activo",
  });

  useEffect(() => {
    fetchContratos();
    fetchClientes();
    fetchMotos();
  }, []);

  const fetchContratos = async () => {
    const res = await fetch("/api/contratos");
    const data = await res.json();
    setContratos(data);
  };

  const fetchClientes = async () => {
    const res = await fetch("/api/clientes");
    const data = await res.json();
    setClientes(data);
  };

  const fetchMotos = async () => {
    const res = await fetch("/api/motos");
    const data = await res.json();
    setMotos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/contratos/${editingId}` : "/api/contratos";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchContratos();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        clienteId: "",
        motoId: "",
        fechaInicio: "",
        fechaFin: "",
        precioSemana: 0,
        estado: "activo",
      });
    } else {
      const text = await res.text();
      alert(text);
    }
  };

  const handleEdit = (contrato: Contrato) => {
    setFormData({
      clienteId: contrato.clienteId,
      motoId: contrato.motoId,
      fechaInicio: contrato.fechaInicio.substring(0, 10),
      fechaFin: contrato.fechaFin.substring(0, 10),
      precioSemana: contrato.precioSemana,
      estado: contrato.estado,
    });
    setEditingId(contrato.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar contrato?")) return;
    const res = await fetch(`/api/contratos/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchContratos();
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Contratos</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              clienteId: "",
              motoId: "",
              fechaInicio: "",
              fechaFin: "",
              precioSemana: 0,
              estado: "activo",
            });
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
          {showForm ? "Cancelar" : "+ Nuevo Contrato"}
        </button>
      </div>

      {showForm && (
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Cliente *</label>
              <select
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                }}
              >
                <option value="">Seleccionar...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Moto *</label>
              <select
                value={formData.motoId}
                onChange={(e) => setFormData({ ...formData, motoId: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                }}
              >
                <option value="">Seleccionar...</option>
                {motos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.marca} {m.modelo} - {m.patente}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Precio Semanal *</label>
              <input
                type="number"
                value={formData.precioSemana}
                onChange={(e) => setFormData({ ...formData, precioSemana: Number(e.target.value) })}
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
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Fecha Inicio *</label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
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
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Fecha Fin *</label>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
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
                <option value="activo">Activo</option>
                <option value="vencido">Vencido</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            style={{
              marginTop: 12,
              padding: "8px 16px",
              background: "#10b981",
              color: "white",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
            }}
          >
            {editingId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Cliente</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Moto</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Inicio</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Fin</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Precio/Sem</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Estado</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Pagos</th>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contratos.map((contrato) => (
              <tr key={contrato.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 12 }}>{contrato.cliente?.nombre}</td>
                <td style={{ padding: 12 }}>
                  {contrato.moto?.marca} {contrato.moto?.modelo}
                  <br />
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{contrato.moto?.patente}</span>
                </td>
                <td style={{ padding: 12 }}>{new Date(contrato.fechaInicio).toLocaleDateString()}</td>
                <td style={{ padding: 12 }}>{new Date(contrato.fechaFin).toLocaleDateString()}</td>
                <td style={{ padding: 12 }}>${contrato.precioSemana}</td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      background:
                        contrato.estado === "activo"
                          ? "#d1fae5"
                          : contrato.estado === "vencido"
                          ? "#fee2e2"
                          : "#e5e7eb",
                      color:
                        contrato.estado === "activo"
                          ? "#065f46"
                          : contrato.estado === "vencido"
                          ? "#991b1b"
                          : "#374151",
                    }}
                  >
                    {contrato.estado}
                  </span>
                </td>
                <td style={{ padding: 12 }}>{contrato._count?.pagos || 0}</td>
                <td style={{ padding: 12 }}>
                  <button
                    onClick={() => handleEdit(contrato)}
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
                    onClick={() => handleDelete(contrato.id)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
