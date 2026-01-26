"use client";
import { useState, useEffect } from "react";

type Cliente = {
  id: string;
  nombre: string;
  dni: string;
  telefono?: string;
  email?: string;
  _count?: { contratos: number };
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: "", dni: "", telefono: "", email: "" });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    const res = await fetch("/api/clientes");
    const data = await res.json();
    setClientes(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/clientes/${editingId}` : "/api/clientes";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchClientes();
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre: "", dni: "", telefono: "", email: "" });
    } else {
      const text = await res.text();
      alert(text);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      nombre: cliente.nombre,
      dni: cliente.dni,
      telefono: cliente.telefono || "",
      email: cliente.email || "",
    });
    setEditingId(cliente.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar cliente?")) return;
    const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchClientes();
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Clientes</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ nombre: "", dni: "", telefono: "", email: "" });
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
          {showForm ? "Cancelar" : "+ Nuevo Cliente"}
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>DNI *</label>
              <input
                type="text"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
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
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                }}
              />
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

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
            <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Nombre</th>
            <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>DNI</th>
            <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Teléfono</th>
            <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Email</th>
            <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Contratos</th>
            <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: 12 }}>{cliente.nombre}</td>
              <td style={{ padding: 12 }}>{cliente.dni}</td>
              <td style={{ padding: 12 }}>{cliente.telefono || "-"}</td>
              <td style={{ padding: 12 }}>{cliente.email || "-"}</td>
              <td style={{ padding: 12 }}>{cliente._count?.contratos || 0}</td>
              <td style={{ padding: 12 }}>
                <button
                  onClick={() => handleEdit(cliente)}
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
                  onClick={() => handleDelete(cliente.id)}
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
  );
}
