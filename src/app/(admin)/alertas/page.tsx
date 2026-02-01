"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AlertasRedirect() {
  const router = useRouter();
  useEffect(() => router.replace("/admin/alertas"), [router]);
  return null;
}
