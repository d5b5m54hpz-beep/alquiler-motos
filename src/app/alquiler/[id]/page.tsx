"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Moto = {
  id: string;
  marca: string;
  modelo: string;
  patente: string;
  anio: number;
  estado: string;
  _count?: { contratos: number };
};

type PricingConfig = {
  precioBaseMensual: number;
  descuentoSemanal: number;
  duraciones: {
    meses3: number;
    meses6: number;
    meses9: number;
    meses12: number;
  };
};

type DuracionOption = {
  meses: number;
  label: string;
  descuento: number;
};

type PaymentType = "mensual" | "semanal";

// Función para formatear números sin decimales con puntos
const formatNumber = (num: number): string => {
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function AlquilerPage() {
  const params = useParams();
  const router = useRouter();
  const [moto, setMoto] = useState<Moto | null>(null);
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState("");
  const [duracionSeleccionada, setDuracionSeleccionada] = useState<DuracionOption | null>(null);
  const [tipoPago, setTipoPago] = useState<PaymentType>("mensual");
  const [precioTotal, setPrecioTotal] = useState(0);
  const [precioMensual, setPrecioMensual] = useState(0);
  const [precioSemanal, setPrecioSemanal] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchMoto();
      fetchPricing();
    }
  }, [params.id]);

  useEffect(() => {
    calcularPrecio();
  }, [fechaInicio, duracionSeleccionada, tipoPago, pricing]);

  const fetchMoto = async () => {
    try {
      const res = await fetch(`/api/motos/${params.id}`);
      if (!res.ok) throw new Error("Moto no encontrada");
      const data = await res.json();
      setMoto(data);
    } catch (err) {
      console.error(err);
      router.push("/motos");
    }
  };

  const fetchPricing = async () => {
    try {
      const res = await fetch("/api/public/pricing");
      if (res.ok) {
        const data = await res.json();
        setPricing(data);
      }
    } catch (err) {
      console.error("Error cargando configuración de precios:", err);
    } finally {
      setLoading(false);
    }
  };

  const calcularPrecio = () => {
    if (!pricing || !duracionSeleccionada || !fechaInicio) {
      setPrecioTotal(0);
      setPrecioMensual(0);
      setPrecioSemanal(0);
      return;
    }

    // Calcular precio mensual con descuento por duración
    const precioMensualBase = pricing.precioBaseMensual * (1 - duracionSeleccionada.descuento / 100);
    const precioSemanalBase = precioMensualBase * (1 - pricing.descuentoSemanal / 100) / 4.33;

    setPrecioMensual(precioMensualBase);
    setPrecioSemanal(precioSemanalBase);

    // Calcular precio total según tipo de pago
    const precioUnitario = tipoPago === "mensual" ? precioMensualBase : precioSemanalBase;
    const unidadesPorMes = tipoPago === "mensual" ? 1 : 4.33;
    const total = precioUnitario * unidadesPorMes * duracionSeleccionada.meses;

    setPrecioTotal(total);
  };

  const duracionOptions: DuracionOption[] = pricing ? [
    { meses: 3, label: "3 Meses", descuento: pricing.duraciones.meses3 },
    { meses: 6, label: "6 Meses", descuento: pricing.duraciones.meses6 },
    { meses: 9, label: "9 Meses", descuento: pricing.duraciones.meses9 },
    { meses: 12, label: "12 Meses", descuento: pricing.duraciones.meses12 },
  ] : [];

  const handleContinuar = () => {
    if (!fechaInicio || !duracionSeleccionada || precioTotal === 0) {
      alert("Por favor selecciona la fecha de inicio y duración del alquiler");
      return;
    }

    const fechaFin = new Date(fechaInicio);
    fechaFin.setMonth(fechaFin.getMonth() + duracionSeleccionada.meses);

    // Guardar en localStorage para el checkout
    const alquilerData = {
      motoId: moto?.id,
      fechaInicio,
      fechaFin: fechaFin.toISOString().split('T')[0],
      duracionMeses: duracionSeleccionada.meses,
      tipoPago,
      precioMensual,
      precioSemanal,
      precioTotal,
      descuentoDuracion: duracionSeleccionada.descuento,
      descuentoSemanal: pricing?.descuentoSemanal || 0,
    };

    localStorage.setItem("alquilerData", JSON.stringify(alquilerData));
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!moto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Moto no encontrada</h1>
          <Link href="/motos" className="text-indigo-600 hover:text-indigo-700">
            Volver a las motos
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
            <Link href="/" className="text-2xl font-bold text-gray-900">
              🏍️ MotoRent
            </Link>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">Inicio</Link>
              <Link href="/motos" className="text-gray-700 hover:text-gray-900">Motos</Link>
              <Link href="/perfil" className="text-gray-700 hover:text-gray-900">Perfil</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen y detalles de la moto */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-8xl">🏍️</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {moto.marca} {moto.modelo}
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Año:</span>
                  <span className="font-medium">{moto.anio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Patente:</span>
                  <span className="font-medium">{moto.patente}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    moto.estado === "disponible"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {moto.estado}
                  </span>
                </div>
                {pricing && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Precios base (sin descuentos):</p>
                    <div className="flex justify-between text-sm">
                      <span>Mensual:</span>
                      <span className="font-medium">${formatNumber(pricing.precioBaseMensual)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Semanal:</span>
                      <span className="font-medium text-green-600">
                        ${formatNumber(pricing.precioBaseMensual * (1 - pricing.descuentoSemanal / 100) / 4.33)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formulario de alquiler */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Configura tu Alquiler</h3>

            <div className="space-y-6">
              {/* Fecha de Inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alquiler mínimo: 3 meses
                </p>
              </div>

              {/* Duración */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Duración del Contrato *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {duracionOptions.map((option) => (
                    <button
                      key={option.meses}
                      onClick={() => setDuracionSeleccionada(option)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        duracionSeleccionada?.meses === option.meses
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      {option.descuento > 0 && (
                        <div className="text-sm text-green-600">
                          -{option.descuento}% descuento
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Frecuencia de Pago *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTipoPago("mensual")}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      tipoPago === "mensual"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">Pago Mensual</div>
                    {precioMensual > 0 && (
                      <div className="text-sm text-gray-600">
                        ${formatNumber(precioMensual)}/mes
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => setTipoPago("semanal")}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      tipoPago === "semanal"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">Pago Semanal</div>
                    <div className="text-sm text-green-600">
                      {pricing && `-${pricing.descuentoSemanal}% descuento`}
                    </div>
                    {precioSemanal > 0 && (
                      <div className="text-sm text-gray-600">
                        ${formatNumber(precioSemanal)}/semana
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Resumen de Precio */}
              {precioTotal > 0 && duracionSeleccionada && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Resumen del Alquiler</h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duración:</span>
                      <span className="font-medium">{duracionSeleccionada.label}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Frecuencia de pago:</span>
                      <span className="font-medium">
                        {tipoPago === "mensual" ? "Mensual" : "Semanal"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Precio por {tipoPago === "mensual" ? "mes" : "semana"}:</span>
                      <span className="font-medium">
                        ${formatNumber(tipoPago === "mensual" ? precioMensual : precioSemanal)}
                      </span>
                    </div>

                    {duracionSeleccionada.descuento > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento duración:</span>
                        <span>-{duracionSeleccionada.descuento}%</span>
                      </div>
                    )}

                    {tipoPago === "semanal" && pricing && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento semanal:</span>
                        <span>-{pricing.descuentoSemanal}%</span>
                      </div>
                    )}

                    <hr className="my-2" />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total del contrato:</span>
                      <span>${formatNumber(precioTotal)}</span>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      Fecha de fin estimada: {
                        fechaInicio ? (() => {
                          const fechaFin = new Date(fechaInicio);
                          fechaFin.setMonth(fechaFin.getMonth() + duracionSeleccionada.meses);
                          return fechaFin.toLocaleDateString('es-ES');
                        })() : ''
                      }
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleContinuar}
                disabled={moto.estado !== "disponible" || !fechaInicio || !duracionSeleccionada || precioTotal === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  moto.estado === "disponible" && fechaInicio && duracionSeleccionada && precioTotal > 0
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continuar con el Pago
              </button>

              {moto.estado !== "disponible" && (
                <p className="text-red-600 text-sm text-center">
                  Esta motocicleta no está disponible para alquiler
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}