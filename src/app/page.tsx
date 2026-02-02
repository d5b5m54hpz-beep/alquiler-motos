import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🏍️ MotoRent</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Alquila la Moto Perfecta para tu Aventura
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre la libertad de las carreteras con nuestra amplia flota de motocicletas.
              Desde scooters urbanos hasta motos de alta cilindrada, tenemos lo que necesitas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/registro"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Comenzar Ahora
              </Link>
              <Link
                href="/motos"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Ver Motos Disponibles
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏍️</div>
              <h3 className="text-xl font-semibold mb-2">Amplia Flota</h3>
              <p className="text-gray-600">
                Más de 50 modelos diferentes, desde principiantes hasta expertos.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Seguro Incluido</h3>
              <p className="text-gray-600">
                Protección completa durante todo tu alquiler.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2">Entrega a Domicilio</h3>
              <p className="text-gray-600">
                Te llevamos la moto directamente a tu puerta.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-indigo-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">¿Listo para tu próxima aventura?</h2>
            <p className="text-xl mb-6">
              Regístrate ahora y obtén tu primera hora gratis.
            </p>
            <Link
              href="/registro"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Crear Cuenta Gratis
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2026 MotoRent. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}