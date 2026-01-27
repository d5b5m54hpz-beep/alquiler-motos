"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export function UserProfileButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) return null;

  const userName = session.user?.name || session.user?.email || "Usuario";
  const userEmail = session.user?.email || "";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 6,
          background: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          color: "#111",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fff";
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#667eea",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {initial}
        </div>
        <span>{userName.split(" ")[0]}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 8,
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            minWidth: 240,
          }}
        >
          <div style={{ padding: "12px 0" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{userName}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{userEmail}</div>
            </div>

            <a
              href="/perfil"
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                padding: "12px 16px",
                color: "#374151",
                textDecoration: "none",
                fontSize: 14,
                transition: "background 0.2s",
                borderBottom: "1px solid #f3f4f6",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              👤 Mi Cuenta
            </a>

            <button
              onClick={() => {
                signOut({ redirect: true, redirectTo: "/login" });
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                color: "#ef4444",
                background: "transparent",
                border: "none",
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              🚪 Salir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
