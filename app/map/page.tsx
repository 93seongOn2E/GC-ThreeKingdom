import Link from "next/link";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="pixel-frame p-8">
        <div className="mb-3 text-xs font-bold tracking-[0.24em] text-[var(--accent)]">MAP</div>
        <h1 className="mb-3 text-2xl font-black text-[#f5e6c8]">월드 지도</h1>
        <p className="mb-5 text-sm leading-7 text-[#cdbb98]">플레이어용 지도 페이지입니다. 관리자 편집은 별도 메뉴에서 진행합니다.</p>
        <Link href="/admin/map" className="inline-block bg-[var(--primary)] px-4 py-2 text-sm font-bold text-[#f5e6c8]">관리자 지도 열기</Link>
      </div>
    </div>
  );
}
