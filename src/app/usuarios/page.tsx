"use client";

import { useEffect, useState } from "react";

type Usuario = {
  id: string;
  email: string;
  nombre: string;
  rol: "admin" | "operador" | "auditor";
  activo: boolean;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Usuario["rol"]>("operador");

  async function fetchUsuarios() {
    setLoading(true);
    const res = await fetch("/api/usuarios", { cache: "no-store" });
    const data = await res.json();
    setUsuarios(data);
    setLoading(false);
  }

  async function crearUsuario() {
    await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre, password, rol }),
    });
    setEmail("");
    setNombre("");
    setPassword("");
    setRol("operador");
    fetchUsuarios();
  }

  async function actualizarUsuario(id: string, data: Partial<Usuario>) {
    await fetch(`/api/usuarios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchUsuarios();
  }

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading) return <p>Cargando usuarios…</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Usuarios</h1>

      <h2>Crear usuario</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <select value={rol} onChange={e => setRol(e.target.value as any)}>
        <option value="admin">Admin</option>
        <option value="operador">Operador</option>
        <option value="auditor">Auditor</option>
      </select>
      <button onClick={crearUsuario}>Crear</button>

      <h2 style={{ marginTop: 32 }}>Listado</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.nombre}</td>
              <td>
                <select
                  value={u.rol}
                  onChange={e => actualizarUsuario(u.id, { rol: e.target.value as any })}
                >
                  <option value="admin">Admin</option>
                  <option value="operador">Operador</option>
                  <option value="auditor">Auditor</option>
                </select>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={u.activo}
                  onChange={e => actualizarUsuario(u.id, { activo: e.target.checked })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
