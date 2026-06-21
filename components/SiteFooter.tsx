export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--border)]">
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#c0392b] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-[#9b8a70]">
        <div>
          <div className="mb-2 font-bold tracking-wide text-[var(--accent)]">감컴퍼니 삼국지서버</div>
          <p className="leading-7">감컴퍼니 삼국지 세계관과 세력 구도를 정리한 서버 안내 페이지입니다.</p>
        </div>
      </div>
    </footer>
  );
}
