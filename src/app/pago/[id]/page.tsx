"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

type Contrato = {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  precioSemana: number;
  estado: string;
  moto: {
    marca: string;
    modelo: string;
    patente: string;
  };
  cliente: {
    nombre: string;
    email: string;
  };
};

type Pago = {
  id: string;
  monto: number;
  estado: string;
  metodo: string;
};

type MetodoPago = {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  disponible: boolean;
};

export default function PagoPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [pago, setPago] = useState<Pago | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string>("");
  const [facturaGenerada, setFacturaGenerada] = useState<any>(null);

  const metodosPago: MetodoPago[] = [
    {
      id: "transferencia",
      nombre: "Transferencia Bancaria",
      descripcion: "Pago por transferencia bancaria (modo prueba)",
      icono: "/payment-icons/bank-transfer.svg",
      disponible: true,
    },
    {
      id: "tarjeta",
      nombre: "Tarjeta de Crédito",
      descripcion: "Pago con tarjeta de crédito (modo prueba)",
      icono: "/payment-icons/credit-card.svg",
      disponible: true,
    },
    {
      id: "mercadopago",
      nombre: "Mercado Pago",
      descripcion: "Pago a través de Mercado Pago",
      icono: "/payment-icons/mercadopago.svg",
      disponible: true,
    },
  ];

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (params.id) {
      fetchContrato();
    }
  }, [session, params.id, router]);

  const fetchContrato = async () => {
    try {
      const res = await fetch(`/api/contratos/${params.id}`);
      if (!res.ok) throw new Error("Contrato no encontrado");
      const data = await res.json();
      setContrato(data);

      // Buscar o crear el pago
      await fetchOrCreatePago(data.id, data.precioSemana);
    } catch (err) {
      console.error(err);
      router.push("/perfil");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrCreatePago = async (contratoId: string, monto: number) => {
    try {
      // Buscar pago existente
      const pagosRes = await fetch(`/api/pagos?contratoId=${contratoId}`);
      const pagos = await pagosRes.json();

      if (pagos.length > 0) {
        setPago(pagos[0]);
        setMetodoSeleccionado(pagos[0].metodo);
        return;
      }

      // No crear pago automáticamente, esperar selección del método
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmarPago = async () => {
    if (!metodoSeleccionado || !contrato) return;

    setProcesandoPago(true);
    try {
      // Crear el pago
      const pagoRes = await fetch("/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contratoId: contrato.id,
          monto: contrato.precioSemana,
          metodo: metodoSeleccionado,
          estado: "pendiente",
        }),
      });

      if (!pagoRes.ok) throw new Error("Error creando pago");

      const nuevoPago = await pagoRes.json();
      setPago(nuevoPago);

      // Simular confirmación de pago (modo prueba)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay

      // Marcar pago como completado
      const confirmarRes = await fetch("/api/pagos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagoId: nuevoPago.id,
          metodo: metodoSeleccionado,
        }),
      });

      if (!confirmarRes.ok) throw new Error("Error confirmando pago");

      const pagoConfirmado = await confirmarRes.json();
      setPago(pagoConfirmado);

      // Generar factura
      const facturaRes = await fetch("/api/facturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagoId: pagoConfirmado.id,
        }),
      });

      if (facturaRes.ok) {
        const factura = await facturaRes.json();
        setFacturaGenerada(factura);
      }

    } catch (err) {
      console.error(err);
      alert("Error procesando el pago. Inténtalo de nuevo.");
    } finally {
      setProcesandoPago(false);
    }
  };

  const handlePagarMercadoPago = async () => {
    if (!pago) return;

    setProcesandoPago(true);
    try {
      const res = await fetch("/api/mp/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagoId: pago.id,
          monto: pago.monto,
        }),
      });

      if (!res.ok) throw new Error("Error creando preferencia de pago");

      const { url } = await res.json();
      window.location.href = url; // Redirigir a MercadoPago
    } catch (err) {
      console.error(err);
      alert("Error procesando el pago. Inténtalo de nuevo.");
      setProcesandoPago(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!contrato || !pago) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Información no encontrada</h1>
          <Link href="/perfil" className="text-indigo-600 hover:text-indigo-700">
            Volver al perfil
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
              <Link href="/perfil" className="text-indigo-600 font-medium">Perfil</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Procesar Pago</h1>
            <p className="text-gray-600 mt-2">Completa tu pago de forma segura</p>
          </div>

          {/* Detalles del contrato */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Alquiler</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Motocicleta:</span>
                <span className="font-medium">{contrato.moto.marca} {contrato.moto.modelo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Patente:</span>
                <span className="font-medium">{contrato.moto.patente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha inicio:</span>
                <span className="font-medium">{new Date(contrato.fechaInicio).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha fin:</span>
                <span className="font-medium">{new Date(contrato.fechaFin).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium">{contrato.cliente.nombre}</span>
              </div>
            </div>
          </div>

          {/* Detalles del pago */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Pago</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-900">Total a pagar:</span>
                <span className="text-2xl font-bold text-indigo-600">${contrato.precioSemana}</span>
              </div>
              {pago && (
                <p className="text-sm text-gray-600 mt-2">
                  Estado del pago: <span className={`font-medium ${
                    pago.estado === "pendiente" ? "text-yellow-600" :
                    pago.estado === "pagado" ? "text-green-600" : "text-red-600"
                  }`}>{pago.estado}</span>
                </p>
              )}
            </div>
          </div>

          {/* Selección de método de pago */}
          {!pago && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Selecciona Método de Pago</h2>
              <div className="space-y-3">
                {metodosPago.map((metodo) => (
                  <div
                    key={metodo.id}
                    onClick={() => metodo.disponible && setMetodoSeleccionado(metodo.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      metodoSeleccionado === metodo.id
                        ? "border-indigo-500 bg-indigo-50"
                        : metodo.disponible
                        ? "border-gray-300 hover:border-gray-400"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 flex-shrink-0">
                        <Image
                          src={metodo.icono}
                          alt={metodo.nombre}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{metodo.nombre}</h3>
                        <p className="text-sm text-gray-600">{metodo.descripcion}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        metodoSeleccionado === metodo.id
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-gray-300"
                      }`}>
                        {metodoSeleccionado === metodo.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón de pago */}
          {!pago && metodoSeleccionado && (
            <div className="text-center">
              <button
                onClick={metodoSeleccionado === "mercadopago" ? handlePagarMercadoPago : handleConfirmarPago}
                disabled={procesandoPago}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  procesandoPago
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {procesandoPago ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </span>
                ) : metodoSeleccionado === "mercadopago" ? (
                  "Pagar con MercadoPago"
                ) : (
                  `Confirmar Pago (${metodosPago.find(m => m.id === metodoSeleccionado)?.nombre})`
                )}
              </button>
              {metodoSeleccionado === "mercadopago" && (
                <p className="text-sm text-gray-600 mt-4">
                  Serás redirigido a MercadoPago para completar el pago de forma segura
                </p>
              )}
              {metodoSeleccionado !== "mercadopago" && (
                <p className="text-sm text-gray-600 mt-4">
                  Este es un pago de prueba. El pago se confirmará automáticamente.
                </p>
              )}
            </div>
          )}

          {!pago && !metodoSeleccionado && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Selecciona un método de pago para continuar</p>
            </div>
          )}

          {pago && pago.estado === "pagado" && (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-medium">¡Pago completado exitosamente!</p>
                <p className="text-sm text-green-700 mt-1">
                  Método: {metodosPago.find(m => m.id === pago.metodo)?.nombre}
                </p>
              </div>

              {facturaGenerada && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 font-medium">Factura generada</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Número: {facturaGenerada.numero}
                  </p>
                  <p className="text-sm text-blue-700">
                    Se ha enviado por email a {contrato.cliente.email}
                  </p>
                </div>
              )}

              <Link
                href="/perfil"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold"
              >
                Ver mis reservas
              </Link>
            </div>
          )}

          {pago && pago.estado === "fallido" && (
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-medium">El pago falló. Inténtalo de nuevo.</p>
              </div>
              <button
                onClick={metodoSeleccionado === "mercadopago" ? handlePagarMercadoPago : handleConfirmarPago}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold"
              >
                Reintentar Pago
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}