"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Create user via API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta");
        setLoading(false);
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (result?.ok) {
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Error al crear la cuenta");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
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
        <h1 style={{
          fontSize: 28,
          fontWeight: 600,
          textAlign: "center",
          marginBottom: 8,
          color: "#1a1a1a",
        }}>
          Crear cuenta
        </h1>
        <p style={{
          textAlign: "center",
          color: "#666",
          marginBottom: 32,
          fontSize: 14,
        }}>
          Únete a nosotros hoy
        </p>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignup}
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
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#f9f9f9")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path d="M17.6 9.2l-.1-1.8H9v3.4h4.8C13.6 12 13 13 12 13.6v2.2h3a8.8 8.8 0 0 0 2.6-6.6z" fill="#4285F4"/>
              <path d="M9 18c2.4 0 4.5-.8 6-2.2l-3-2.2a5.4 5.4 0 0 1-8-2.9H1V13a9 9 0 0 0 8 5z" fill="#34A853"/>
              <path d="M4 10.7a5.4 5.4 0 0 1 0-3.4V5H1a9 9 0 0 0 0 8l3-2.3z" fill="#FBBC05"/>
              <path d="M9 3.6c1.3 0 2.5.4 3.4 1.3L15 2.3A9 9 0 0 0 1 5l3 2.4a5.4 5.4 0 0 1 5-3.7z" fill="#EA4335"/>
            </g>
          </svg>
          Registrarse con Google
        </button>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 16, 
          marginBottom: 24 
        }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }} />
          <span style={{ color: "#999", fontSize: 13, fontWeight: 500 }}>O</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }} />
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "#333",
            }}>
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "10px 12px",
                boxSizing: "border-box",
                border: "1px solid #ddd",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "#333",
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "10px 12px",
                boxSizing: "border-box",
                border: "1px solid #ddd",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "#333",
            }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "10px 12px",
                boxSizing: "border-box",
                border: "1px solid #ddd",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "#333",
            }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "10px 12px",
                boxSizing: "border-box",
                border: "1px solid #ddd",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
            />
          </div>

          {error && (
            <div style={{
              padding: "10px 12px",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: 6,
              color: "#c33",
              fontSize: 13,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: "100%",
              padding: "12px 16px",
              backgroundColor: "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 15,
              fontWeight: 600,
              transition: "background-color 0.2s",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#5568d3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#667eea")}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 14,
          color: "#666",
        }}>
          ¿Ya tienes cuenta?{" "}
          <Link 
            href="/login" 
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
