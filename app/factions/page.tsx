export default function FactionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6">
        <div className="mb-2 text-xs font-bold tracking-[0.24em] text-[var(--accent)]">FACTIONS</div>
        <h1 className="text-2xl font-black text-[#f5e6c8]">세력 정보</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["위", "#d63d35", "북방 중심의 강력한 군사 세력"],
          ["촉", "#2f9b5f", "서남부 산악 지형을 기반으로 한 세력"],
          ["오", "#2f73c8", "강동과 수로를 장악한 해양 세력"]
        ].map(([name, color, desc]) => (
          <section key={name} className="pixel-frame p-5">
            <div className="mb-3 h-2 w-16" style={{ background: color }} />
            <h2 className="mb-2 text-xl font-bold text-[#f5e6c8]">{name}나라</h2>
            <p className="text-sm leading-6 text-[#9b8a70]">{desc}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
