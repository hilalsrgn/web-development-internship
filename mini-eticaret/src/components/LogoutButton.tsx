"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-ink-muted transition-colors hover:text-ink disabled:opacity-50"
    >
      {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
    </button>
  );
}
