"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push("/perfil");
    } else {
      setError("Email o contraseña incorrectos");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/perfil" });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
    }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: 420,
        padding: "40px 32px",
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, textAlign: "center", marginBottom: 8, color: "#1a1a1a" }}>
          Bienvenido
        </h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: 32, fontSize: 14 }}>
          Inicia sesión en tu cuenta
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 16px",
            marginBottom: 24,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 15,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            transition: "all 0.2s",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Continuar con Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }} />
          <span style={{ color: "#999", fontSize: 13, fontWeight: 500 }}>O</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }} />
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#333" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ width: "100%", padding: "10px 12px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: 8, fontSize: 14 }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#333" }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ width: "100%", padding: "10px 12px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: 8, fontSize: 14 }}
            />
          </div>

          {error && (
            <div style={{ padding: "10px 12px", backgroundColor: "#fee", border: "1px solid #fcc", borderRadius: 6, color: "#c33", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px 16px", backgroundColor: "#667eea", color: "#fff", border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 600 }}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "#666" }}>
          ¿No tienes una cuenta? <Link href="/registro" style={{ color: "#667eea", textDecoration: "none", fontWeight: 600 }}>Crear cuenta</Link>
        </div>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "#999" }}>
          ¿Eres staff? <Link href="/admin/login" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>Acceder al panel</Link>
        </div>
      </div>
    </div>
  );
}
