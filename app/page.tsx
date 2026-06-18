import Link from "next/link";
import { BookOpen, Map, ScrollText, Shield, Swords } from "lucide-react";
import { MapViewer } from "@/components/MapViewer";

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
      <MapViewer />

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="pixel-frame p-5 transition hover:border-[var(--accent)]">
              <Icon className="mb-4 text-[var(--accent)]" size={24} />
              <h2 className="mb-2 text-lg font-bold text-[#f3e7d0]">{card.title}</h2>
              <p className="text-sm leading-6 text-[#aa9a82]">{card.desc}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
