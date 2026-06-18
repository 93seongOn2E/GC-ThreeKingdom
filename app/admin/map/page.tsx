import { AdminMapEditor } from "@/components/AdminMapEditor";

export default function AdminMapPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6">
      <div className="mb-4">
        <div className="mb-2 text-xs font-bold tracking-[0.24em] text-[var(--accent)]">ADMIN</div>
        <h1 className="text-2xl font-black text-[#f5e6c8]">영토 지도 관리자</h1>
        <p className="mt-1 text-sm text-[#9b8a70]">
          Wiki 사이트 안에서 성 이름, 레벨, 위치, 영역 배율, 소유 세력을 직접 편집합니다.
        </p>
      </div>
      <AdminMapEditor />
    </div>
  );
}
