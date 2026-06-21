"use client";

import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export function BroadcastRefreshButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(212,167,86,0.28)] bg-white/5 text-[#dbc292] transition hover:bg-white/10 hover:text-[#f3e7d0]"
      aria-label="방송 목록 새로고침"
      title="새로고침"
    >
      <RefreshCcw size={15} />
    </button>
  );
}
