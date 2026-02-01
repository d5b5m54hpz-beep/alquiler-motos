"use client";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center">Acceso Administrador</h1>

        <form className="space-y-4">
          <input type="email" placeholder="Email admin" className="w-full rounded border px-3 py-2" />
          <input type="password" placeholder="Contraseña" className="w-full rounded border px-3 py-2" />
          <button type="submit" className="w-full rounded bg-black py-2 text-white">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
