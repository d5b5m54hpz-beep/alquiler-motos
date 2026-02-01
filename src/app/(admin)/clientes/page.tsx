"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientesRedirect() {
  const router = useRouter();
  useEffect(() => router.replace("/admin/clientes"), [router]);
  return null;
}
