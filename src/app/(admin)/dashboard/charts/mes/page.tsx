"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MesRedirect() {
  const router = useRouter();
  useEffect(() => router.replace("/admin/dashboard/charts/mes"), [router]);
  return null;
}
