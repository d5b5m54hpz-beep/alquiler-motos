"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  phoneVerifiedAt: string | null;
  provider: string;
}

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showForm: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/usuarios/perfil");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({ name: data.name, phone: data.phone || "" });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/usuarios/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setMessage("Perfil actualizado exitosamente");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const err = await res.json();
        setError(err.error || "Error al actualizar perfil");
      }
    } catch (err) {
      setError("Error al actualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/usuarios/perfil/cambiar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (res.ok) {
        setMessage("Contraseña actualizada exitosamente");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          showForm: false,
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        const err = await res.json();
        setError(err.error || "Error al cambiar contraseña");
      }
    } catch (err) {
      setError("Error al cambiar contraseña");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: 20 }}>
        <p>No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <h1 style={{ marginBottom: 30, color: "#111" }}>Mi Cuenta</h1>

      {message && (
        <div
          style={{
            padding: 12,
            marginBottom: 20,
            background: "#d1fae5",
            border: "1px solid #6ee7b7",
            borderRadius: 6,
            color: "#059669",
            fontSize: 14,
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: 12,
            marginBottom: 20,
            background: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: 6,
            color: "#dc2626",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* Información Básica */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: "#111" }}>
          Información Personal
        </h2>

        <form onSubmit={handleUpdateProfile}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: "#374151",
              }}
            >
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: "#374151",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 14,
                boxSizing: "border-box",
                background: "#f9fafb",
                color: "#6b7280",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: "#374151",
              }}
            >
              Número de Teléfono
              {profile.phoneVerifiedAt && (
                <span
                  style={{
                    marginLeft: 8,
                    padding: "2px 8px",
                    background: "#d1fae5",
                    color: "#059669",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ✓ Verificado
                </span>
              )}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+54 9 11 23456789"
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: 10,
              background: "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </section>

      {/* Cambiar Contraseña */}
      {profile.provider === "credentials" && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111" }}>Seguridad</h2>
          </div>

          {!passwordForm.showForm ? (
            <button
              onClick={() => setPasswordForm({ ...passwordForm, showForm: true })}
              style={{
                padding: "10px 16px",
                background: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              🔐 Cambiar Contraseña
            </button>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 6,
                    color: "#374151",
                  }}
                >
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 6,
                    color: "#374151",
                  }}
                >
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 6,
                    color: "#374151",
                  }}
                >
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: 10,
                    background: "#667eea",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? "Actualizando..." : "Actualizar Contraseña"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                      showForm: false,
                    })
                  }
                  style={{
                    flex: 1,
                    padding: 10,
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </section>
      )}

    </div>
  );
}
