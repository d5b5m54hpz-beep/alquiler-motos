"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type PricingConfig = {
  id: string;
  precioBaseMensual: number;
  descuentoSemanal: number; // porcentaje
  duraciones: {
    meses3: number; // descuento adicional para 3 meses
    meses6: number;
    meses9: number;
    meses12: number;
  };
};

// Función para formatear números sin decimales con puntos
const formatNumber = (num: number): string => {
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Función para parsear string con puntos a número
const parseNumber = (str: string): number => {
  return parseInt(str.replace(/\./g, ''), 10) || 0;
};

export default function PricingPage() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/pricing", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      } else {
        // Si no existe, crear configuración por defecto
        setConfig({
          id: "default",
          precioBaseMensual: 150,
          descuentoSemanal: 10,
          duraciones: {
            meses3: 0,
            meses6: 5,
            meses9: 10,
            meses12: 15,
          },
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("Error cargando configuración de precios");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setMessage("Configuración guardada exitosamente");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error guardando configuración");
      }
    } catch (err) {
      console.error(err);
      setMessage(err instanceof Error ? err.message : "Error guardando configuración");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field: string, value: number) => {
    if (!config) return;

    if (field.startsWith("duraciones.")) {
      const durField = field.split(".")[1];
      setConfig({
        ...config,
        duraciones: {
          ...config.duraciones,
          [durField]: value,
        },
      });
    } else {
      setConfig({
        ...config,
        [field]: value,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error cargando configuración</h1>
          <Link href="/admin/dashboard" className="text-indigo-600 hover:text-indigo-700">
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin/dashboard" className="text-2xl font-bold text-gray-900">
              🏍️ MotoRent Admin
            </Link>
            <nav className="flex space-x-4">
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
              <Link href="/admin/pricing" className="text-indigo-600 font-medium">Pricing</Link>
              <Link href="/admin/motos" className="text-gray-700 hover:text-gray-900">Motos</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración de Precios</h1>
          <p className="text-gray-600 mt-2">Configura los precios base y descuentos para alquileres</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          {/* Precio Base */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Precio Base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Base Mensual (USD)
                </label>
                <input
                  type="text"
                  value={formatNumber(config.precioBaseMensual)}
                  onChange={(e) => updateConfig("precioBaseMensual", parseNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="150.000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Precio base por mes de alquiler
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento Pago Semanal (%)
                </label>
                <input
                  type="text"
                  value={formatNumber(config.descuentoSemanal)}
                  onChange={(e) => updateConfig("descuentoSemanal", parseNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="10"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Descuento adicional por pagar semanalmente
                </p>
              </div>
            </div>
          </div>

          {/* Descuentos por Duración */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Descuentos por Duración</h2>
            <p className="text-gray-600 mb-6">
              Descuentos adicionales según la duración del contrato (aplicado sobre el precio base)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3 Meses (%)
                </label>
                <input
                  type="text"
                  value={formatNumber(config.duraciones.meses3)}
                  onChange={(e) => updateConfig("duraciones.meses3", parseNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">Mínimo requerido</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6 Meses (%)
                </label>
                <input
                  type="text"
                  value={formatNumber(config.duraciones.meses6)}
                  onChange={(e) => updateConfig("duraciones.meses6", parseNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  9 Meses (%)
                </label>
                <input
                  type="text"
                  value={formatNumber(config.duraciones.meses9)}
                  onChange={(e) => updateConfig("duraciones.meses9", parseNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  12 Meses (%)
                </label>
                <input
                  type="text"
                  value={formatNumber(config.duraciones.meses12)}
                  onChange={(e) => updateConfig("duraciones.meses12", parseNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="15"
                />
              </div>
            </div>
          </div>

          {/* Vista Previa de Precios */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vista Previa de Precios</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[3, 6, 9, 12].map((meses) => {
                  const descuentoDuracion = config.duraciones[`meses${meses}` as keyof typeof config.duraciones];
                  const precioMensual = config.precioBaseMensual * (1 - descuentoDuracion / 100);
                  const precioSemanal = precioMensual * (1 - config.descuentoSemanal / 100) / 4.33;

                  return (
                    <div key={meses} className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold text-lg mb-2">{meses} Meses</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Pago mensual:</span>
                          <span className="font-medium">${formatNumber(precioMensual)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pago semanal:</span>
                          <span className="font-medium text-green-600">${formatNumber(precioSemanal)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-1 mt-2">
                          <span>Total:</span>
                          <span>${formatNumber(precioMensual * meses)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                saving
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {saving ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}