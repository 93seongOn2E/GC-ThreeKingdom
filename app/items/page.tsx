export default function ItemsPage() {
  return <ContentPage title="아이템" desc="무기, 방어구, 재료, 화폐, 특수 아이템 정보를 정리할 Wiki 페이지입니다." />;
}

function ContentPage({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="pixel-frame p-8">
        <div className="mb-3 text-xs font-bold tracking-[0.24em] text-[var(--accent)]">WIKI</div>
        <h1 className="mb-3 text-2xl font-black text-[#f5e6c8]">{title}</h1>
        <p className="text-sm leading-7 text-[#cdbb98]">{desc}</p>
      </div>
    </div>
  );
}
