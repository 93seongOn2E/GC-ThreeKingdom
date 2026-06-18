import Link from "next/link";
import { BookOpen, Map, ScrollText, Shield, Swords } from "lucide-react";

const cards = [
  { href: "/heroes", title: "장수 도감", desc: "서버에 등장하는 장수와 역할을 정리합니다.", icon: Swords },
  { href: "/factions", title: "세력 정보", desc: "위, 촉, 오 세력의 특징과 운영 정보를 관리합니다.", icon: Shield },
  { href: "/items", title: "아이템", desc: "전투, 경제, 퀘스트 아이템 정보를 정리합니다.", icon: BookOpen },
  { href: "/map", title: "월드 지도", desc: "플레이어용 영토와 주요 거점을 확인합니다.", icon: Map },
  { href: "/admin/map", title: "영토 관리자", desc: "성 이름, 레벨, 위치, 영역 배율을 직접 편집합니다.", icon: ScrollText }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="pixel-frame pixel-grid relative overflow-hidden p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-3 text-xs font-bold tracking-[0.28em] text-[var(--accent)]">MINECRAFT THREE KINGDOMS</div>
          <h1 className="mb-4 text-3xl font-black text-[#f5e6c8] md:text-5xl">삼국지 Wiki & 영토 관리</h1>
          <p className="max-w-2xl text-sm leading-7 text-[#cdbb98] md:text-base">
            Wiki 레이아웃은 Minecraft 삼국지 사이트 톤으로 유지하고, 관리자 메뉴에서 성 레벨과 영토 픽셀 영역을 편집할 수 있게 통합했습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/map" className="bg-[var(--primary)] px-4 py-2 text-sm font-bold text-[#f5e6c8]">관리자 지도 열기</Link>
            <Link href="/map" className="border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--accent)]">지도 보기</Link>
          </div>
        </div>
        <div className="absolute right-8 top-8 hidden text-[160px] leading-none text-[#c0392b]/10 md:block">三</div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="pixel-frame p-5 transition hover:border-[var(--accent)]">
              <Icon className="mb-4 text-[var(--accent)]" size={24} />
              <h2 className="mb-2 text-lg font-bold text-[#f5e6c8]">{card.title}</h2>
              <p className="text-sm leading-6 text-[#9b8a70]">{card.desc}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
