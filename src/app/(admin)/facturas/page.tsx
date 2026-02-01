"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FacturasRedirect() {
  const router = useRouter();
  useEffect(() => router.replace("/admin/facturas"), [router]);
  return null;
}
