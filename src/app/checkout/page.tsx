"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

type AlquilerData = {
  motoId: string;
  fechaInicio: string;
  fechaFin: string;
  duracionMeses: number;
  tipoPago: "mensual" | "semanal";
  precioMensual: number;
  precioSemanal: number;
  precioTotal: number;
  descuentoDuracion: number;
  descuentoSemanal: number;
};

type Moto = {
  id: string;
  marca: string;
  modelo: string;
  patente: string;
  anio: number;
};

// Función para formatear números sin decimales con puntos
const formatNumber = (num: number): string => {
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alquilerData, setAlquilerData] = useState<AlquilerData | null>(null);
  const [moto, setMoto] = useState<Moto | null>(null);
  const [loading, setLoading] = useState(true);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const data = localStorage.getItem("alquilerData");
    if (!data) {
      router.push("/motos");
      return;
    }

    const parsedData = JSON.parse(data);
    setAlquilerData(parsedData);
    fetchMoto(parsedData.motoId);
  }, [session, status, router]);

  const fetchMoto = async (motoId: string) => {
    try {
      const res = await fetch(`/api/motos/${motoId}`);
      if (!res.ok) throw new Error("Moto no encontrada");
      const data = await res.json();
      setMoto(data);
    } catch (err) {
      console.error(err);
      router.push("/motos");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async () => {
    if (!aceptaTerminos || !alquilerData || !moto) return;

    try {
      // Crear el contrato
      const contratoData = {
        clienteId: session?.user?.id, // Asumiendo que el user id es el cliente id
        motoId: alquilerData.motoId,
        fechaInicio: alquilerData.fechaInicio,
        fechaFin: alquilerData.fechaFin,
        precioSemana: alquilerData.tipoPago === "semanal"
          ? alquilerData.precioSemanal
          : alquilerData.precioMensual / 4.33, // Convertir mensual a semanal
        estado: "pendiente",
        duracionMeses: alquilerData.duracionMeses,
        tipoPago: alquilerData.tipoPago,
        precioMensual: alquilerData.precioMensual,
        precioSemanal: alquilerData.precioSemanal,
        descuentoDuracion: alquilerData.descuentoDuracion,
        descuentoSemanal: alquilerData.descuentoSemanal,
      };

      const res = await fetch("/api/contratos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contratoData),
      });

      if (!res.ok) throw new Error("Error creando contrato");

      const contrato = await res.json();

      // Limpiar localStorage
      localStorage.removeItem("alquilerData");

      // Redirigir a pago
      router.push(`/pago/${contrato.id}`);
    } catch (err) {
      console.error(err);
      alert("Error al procesar la reserva. Inténtalo de nuevo.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || !alquilerData || !moto) {
    return null;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Confirmar Reserva</h1>
          <p className="text-gray-600 mt-2">Revisa los detalles de tu alquiler antes de proceder al pago</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detalles del alquiler */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Motocicleta</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏍️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{moto.marca} {moto.modelo}</h3>
                  <p className="text-sm text-gray-600">Año {moto.anio} • Patente {moto.patente}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles del Contrato</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de inicio:</span>
                  <span className="font-medium">{new Date(alquilerData.fechaInicio).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de fin:</span>
                  <span className="font-medium">{new Date(alquilerData.fechaFin).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">{alquilerData.duracionMeses} mes{alquilerData.duracionMeses !== 1 ? 'es' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frecuencia de pago:</span>
                  <span className="font-medium capitalize">{alquilerData.tipoPago}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen y confirmación */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pago</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio mensual:</span>
                  <span>${formatNumber(alquilerData.precioMensual)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio semanal:</span>
                  <span className="text-green-600">${formatNumber(alquilerData.precioSemanal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span>{alquilerData.duracionMeses} meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frecuencia de pago:</span>
                  <span className="capitalize">{alquilerData.tipoPago}</span>
                </div>

                {alquilerData.descuentoDuracion > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento duración:</span>
                    <span>-{alquilerData.descuentoDuracion}%</span>
                  </div>
                )}

                {alquilerData.tipoPago === "semanal" && alquilerData.descuentoSemanal > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento semanal:</span>
                    <span>-{alquilerData.descuentoSemanal}%</span>
                  </div>
                )}

                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total del contrato:</span>
                  <span>${formatNumber(alquilerData.precioTotal)}</span>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  <p>* El primer pago se realiza al confirmar la reserva</p>
                  <p>* Pagos {alquilerData.tipoPago === "mensual" ? "mensuales" : "semanales"} automáticos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Cliente</h2>
              <div className="space-y-2">
                <p className="text-gray-600">Email: {session.user?.email}</p>
                <p className="text-sm text-gray-500">
                  Asegúrate de que tu información esté actualizada en tu perfil
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terminos"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terminos" className="text-sm text-gray-700">
                    Acepto los <Link href="/terminos" className="text-indigo-600 hover:text-indigo-700">términos y condiciones</Link> del servicio
                  </label>
                </div>

                <button
                  onClick={handleConfirmar}
                  disabled={!aceptaTerminos}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    aceptaTerminos
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Confirmar Reserva y Proceder al Pago
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Al confirmar, se creará una reserva pendiente de pago
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}