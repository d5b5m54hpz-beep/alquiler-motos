"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContratosRedirect() {
  const router = useRouter();
  useEffect(() => router.replace("/admin/contratos"), [router]);
  return null;
}
