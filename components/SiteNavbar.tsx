"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Map, Menu, Package, ScrollText, Shield, Swords, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/heroes", label: "장수", icon: Swords },
  { href: "/factions", label: "세력", icon: Shield },
  { href: "/items", label: "아이템", icon: Package },
  { href: "/guide", label: "가이드", icon: BookOpen },
  { href: "/map", label: "지도", icon: Map },
  { href: "/admin/map", label: "관리자", icon: ScrollText }
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[#2f2017]/95 backdrop-blur-sm">
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-sm border border-[#6b4c28] bg-[#1f140f]" style={{ imageRendering: "pixelated" }}>
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect width="16" height="16" fill="#1a0a0a" />
              <rect x="6" y="1" width="4" height="2" fill="#c0392b" />
              <rect x="5" y="3" width="6" height="2" fill="#d4a017" />
              <rect x="4" y="5" width="8" height="1" fill="#c0392b" />
              <rect x="7" y="6" width="2" height="8" fill="#8a6030" />
              <rect x="3" y="9" width="10" height="1" fill="#8a6030" />
              <rect x="3" y="13" width="10" height="1" fill="#c0392b" />
              <rect x="2" y="14" width="12" height="2" fill="#d4a017" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-[11px] font-bold tracking-[0.18em] text-[var(--accent)]">MINECRAFT</div>
            <div className="text-sm font-bold text-[#f4e0bc]">삼국지 Wiki</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-sm transition ${active ? "text-[#f0c98b]" : "text-[#f1dfc2]/78 hover:text-[#fff2df]"}`}
              >
                <Icon size={14} />
                {item.label}
                {active && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--accent)]" />}
              </Link>
            );
          })}
        </div>

        <button className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="메뉴">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[#3a281c] px-4 py-2 md:hidden">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-sm ${active ? "text-[#f0c98b]" : "text-[#f1dfc2]/78"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
