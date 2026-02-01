"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    try {
      const res = await fetch("/api/usuarios", { cache: "no-store" });
      if (!res.ok) {
        console.error("Error en API:", res.status, res.statusText);
        setUsuarios([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsuarios(data || []);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }

  async function crearUsuario() {
    if (!email || !nombre || !password) {
      alert("Completa todos los campos");
      return;
    }
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nombre, password, rol }),
      });
      if (!res.ok) {
        const error = await res.json();
        alert("Error: " + (error.error || "No se pudo crear el usuario"));
        return;
      }
      setEmail("");
      setNombre("");
      setPassword("");
      setRol("operador");
      await fetchUsuarios();
    } catch (error) {
      console.error("Error creating usuario:", error);
      alert("Error al crear usuario");
    }
  }

  async function actualizarUsuario(id: string, data: Partial<Usuario>) {
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        alert("Error al actualizar usuario");
        return;
      }
      await fetchUsuarios();
    } catch (error) {
      console.error("Error updating usuario:", error);
      alert("Error al actualizar usuario");
    }
  }

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground">Cargando usuarios…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">Gestiona los usuarios del sistema y sus roles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crear nuevo usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full sm:w-64" />
            <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full sm:w-64" />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full sm:w-64" />
            <Select value={rol} onValueChange={(val) => setRol(val as any)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
                <SelectItem value="auditor">Auditor</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={crearUsuario}>Crear Usuario</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Activo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>
                    <Select value={u.rol} onValueChange={(val) => actualizarUsuario(u.id, { rol: val as any })}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="operador">Operador</SelectItem>
                        <SelectItem value="auditor">Auditor</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <input type="checkbox" checked={u.activo} onChange={(e) => actualizarUsuario(u.id, { activo: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
