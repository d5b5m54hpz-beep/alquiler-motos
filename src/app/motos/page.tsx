"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("disponible");

  useEffect(() => {
    fetchMotos();
  }, []);

  const fetchMotos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/motos");
      if (!res.ok) throw new Error("Error cargando motos");
      const data = await res.json();
      setMotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const motosFiltradas = motos.filter(moto => filtroEstado === "todos" || moto.estado === filtroEstado);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              🏍️ MotoRent
            </Link>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">Inicio</Link>
              <Link href="/motos" className="text-indigo-600 font-medium">Motos</Link>
              <Link href="/perfil" className="text-gray-700 hover:text-gray-900">Perfil</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Motocicletas</h1>
          <p className="text-gray-600">Elige la moto perfecta para tu aventura</p>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFiltroEstado("disponible")}
              className={`px-4 py-2 rounded-lg ${
                filtroEstado === "disponible"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Disponibles
            </button>
            <button
              onClick={() => setFiltroEstado("todos")}
              className={`px-4 py-2 rounded-lg ${
                filtroEstado === "todos"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Todas
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando motocicletas...</p>
          </div>
        )}

        {/* Grid de motos */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {motosFiltradas.map((moto) => (
              <div key={moto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-6xl">🏍️</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {moto.marca} {moto.modelo}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>Año: {moto.anio}</p>
                    <p>Patente: {moto.patente}</p>
                    <p className={`inline-block px-2 py-1 rounded-full text-xs ${
                      moto.estado === "disponible"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {moto.estado}
                    </p>
                  </div>
                  <Link
                    href={`/alquiler/${moto.id}`}
                    className={`w-full block text-center py-2 px-4 rounded-lg font-medium transition-colors ${
                      moto.estado === "disponible"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={(e) => moto.estado !== "disponible" && e.preventDefault()}
                  >
                    {moto.estado === "disponible" ? "Alquilar Ahora" : "No Disponible"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && motosFiltradas.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl">🏍️</span>
            <h3 className="text-xl font-semibold text-gray-900 mt-4">No hay motocicletas disponibles</h3>
            <p className="text-gray-600">Intenta cambiar los filtros o vuelve más tarde.</p>
          </div>
        )}
      </main>
    </div>
  );
}