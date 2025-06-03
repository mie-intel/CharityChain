// components/ClientProviderWrapper.js
"use client";
import { AuthProvider } from "@/components/Contexts/AuthProvider";

export default function ClientProviderWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
