"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MotosRedirect() {
  const router = useRouter();
  useEffect(() => router.replace("/admin/motos"), [router]);
  return null;
}
