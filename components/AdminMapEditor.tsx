"use client";

import { useEffect, useMemo, useState } from "react";

type ForceId = "wei" | "shu" | "wu";
type CastleLevel = 1 | 2 | 3;

type CastleSource = {
  name: string;
  level: CastleLevel;
  x?: number;
  y?: number;
  areaScale?: number;
};

type CastleData = {
  forces: Record<ForceId, CastleSource[]>;
};

type Tile = {
  x: number;
  y: number;
  cx: number;
  cy: number;
  size: number;
};

type Castle = {
  id: string;
  name: string;
  level: CastleLevel;
  areaScale: number;
  origin: ForceId;
  owner: ForceId;
  cx: number;
  cy: number;
  territoryCx: number;
  territoryCy: number;
  cells: Tile[];
};

const forceLayouts: Record<ForceId, { label: string; polygon: number[][]; seeds: number[][]; markerSeeds: number[][] }> = {
  wei: {
    label: "위나라",
    polygon: [[318, 132], [422, 86], [584, 88], [736, 116], [842, 168], [818, 270], [704, 352], [520, 362], [374, 306], [286, 234]],
    seeds: [[370, 162], [494, 154], [618, 156], [742, 182], [432, 226], [565, 220], [704, 244], [540, 292], [720, 270]],
    markerSeeds: [[370, 162], [494, 154], [618, 156], [742, 182], [432, 226], [565, 220], [690, 244], [540, 292], [761, 270]]
  },
  shu: {
    label: "촉나라",
    polygon: [[176, 330], [334, 302], [494, 322], [606, 374], [604, 476], [520, 588], [352, 616], [196, 562], [144, 436]],
    seeds: [[240, 354], [362, 326], [490, 346], [560, 408], [250, 456], [386, 444], [510, 488], [314, 548], [452, 560]],
    markerSeeds: [[240, 354], [362, 326], [490, 346], [560, 408], [250, 456], [386, 444], [510, 488], [314, 548], [452, 560]]
  },
  wu: {
    label: "오나라",
    polygon: [[606, 304], [760, 278], [900, 304], [1030, 372], [1042, 512], [946, 604], [786, 624], [638, 556], [570, 420]],
    seeds: [[668, 354], [790, 342], [918, 374], [700, 448], [834, 438], [966, 466], [662, 544], [802, 550], [936, 552]],
    markerSeeds: [[668, 354], [790, 342], [918, 374], [700, 448], [834, 438], [966, 466], [662, 544], [802, 550], [936, 552]]
  }
};

const levelInfo: Record<CastleLevel, { label: string; weight: number; icon: string }> = {
  1: { label: "본성", weight: 1.85, icon: "👑" },
  2: { label: "주요성", weight: 1.25, icon: "🏯" },
  3: { label: "지방성", weight: 0.82, icon: "🚩" }
};

const fallbackCastleData: CastleData = {
  forces: {
    wei: ["업", "허창", "낙양", "장안", "진류", "평원", "북평", "하비", "수춘"].map((name, index) => ({ name, level: (index < 2 ? 1 : index < 5 ? 2 : 3) as CastleLevel })),
    shu: ["성도", "한중", "강주", "자동", "건녕", "영안", "부수", "면죽", "무도"].map((name, index) => ({ name, level: (index < 2 ? 1 : index < 5 ? 2 : 3) as CastleLevel })),
    wu: ["건업", "무창", "장사", "여강", "회계", "오군", "시상", "강하", "파양"].map((name, index) => ({ name, level: (index < 2 ? 1 : index < 5 ? 2 : 3) as CastleLevel }))
  }
};

const forceIds: ForceId[] = ["wei", "shu", "wu"];
const tileSize = 24;
const tileGap = 2;

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (Number.isNaN(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function jitter(seed: number, size: number) {
  const value = Math.sin(seed * 9301.17) * 10000;
  return (value - Math.floor(value) - 0.5) * size;
}

function pointInPolygon(x: number, y: number, polygon: number[][]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersects = (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function makeTilesForPolygon(polygon: number[][]) {
  const xs = polygon.map((point) => point[0]);
  const ys = polygon.map((point) => point[1]);
  const minX = Math.floor(Math.min(...xs) / tileSize) * tileSize;
  const maxX = Math.max(...xs);
  const minY = Math.floor(Math.min(...ys) / tileSize) * tileSize;
  const maxY = Math.max(...ys);
  const tiles: Tile[] = [];

  for (let y = minY; y <= maxY; y += tileSize) {
    for (let x = minX; x <= maxX; x += tileSize) {
      const cx = x + tileSize / 2;
      const cy = y + tileSize / 2;
      if (pointInPolygon(cx, cy, polygon)) {
        tiles.push({ x: x + tileGap / 2, y: y + tileGap / 2, cx, cy, size: tileSize - tileGap });
      }
    }
  }

  return tiles;
}

function createCastleSeeds(force: ForceId, sourceCastles: CastleSource[], tiles: Tile[]) {
  const layout = forceLayouts[force];
  const seeds = sourceCastles
    .map((_, index) => {
      const fallbackPoint = layout.seeds[index];
      if (fallbackPoint) return { cx: fallbackPoint[0], cy: fallbackPoint[1] };
      return null;
    })
    .filter(Boolean) as Array<{ cx: number; cy: number }>;

  const sortedTiles = tiles
    .map((tile, index) => ({ tile, score: Math.sin((index + 1) * 12.9898) * 43758.5453 }))
    .sort((a, b) => a.score - b.score)
    .map((item) => item.tile);

  while (seeds.length < sourceCastles.length && sortedTiles.length) {
    let bestTile = sortedTiles[0];
    let bestDistance = -1;
    sortedTiles.forEach((tile) => {
      const minDistance = Math.min(...seeds.map((seed) => Math.hypot(seed.cx - tile.cx, seed.cy - tile.cy)));
      if (minDistance > bestDistance) {
        bestDistance = minDistance;
        bestTile = tile;
      }
    });
    seeds.push({ cx: bestTile.cx, cy: bestTile.cy });
  }

  return seeds;
}

function generateForceCastles(force: ForceId, sourceCastles: CastleSource[], previousOwners: Map<string, ForceId>) {
  const layout = forceLayouts[force];
  const tiles = makeTilesForPolygon(layout.polygon);
  const seeds = createCastleSeeds(force, sourceCastles, tiles);
  const castles: Castle[] = sourceCastles.map((source, index) => {
    const markerPoint = layout.markerSeeds[index] || [seeds[index].cx, seeds[index].cy];
    return {
      id: `${force}-${index + 1}`,
      name: source.name,
      level: source.level,
      areaScale: source.areaScale || 1,
      origin: force,
      owner: previousOwners.get(`${force}-${index + 1}`) || force,
      cx: Number.isFinite(source.x) ? source.x! : markerPoint[0],
      cy: Number.isFinite(source.y) ? source.y! : markerPoint[1],
      territoryCx: seeds[index].cx,
      territoryCy: seeds[index].cy,
      cells: []
    };
  });

  tiles.forEach((tile) => {
    let nearest = castles[0];
    let nearestScore = Number.POSITIVE_INFINITY;
    castles.forEach((castle, index) => {
      const weight = levelInfo[castle.level].weight * castle.areaScale;
      const distance = Math.hypot(tile.cx - castle.territoryCx, tile.cy - castle.territoryCy) / weight;
      const score = distance + jitter((index + 1) * (tile.cx + tile.cy), 9);
      if (score < nearestScore) {
        nearestScore = score;
        nearest = castle;
      }
    });
    nearest.cells.push(tile);
  });

  return castles;
}

function subjectParticle(word: string) {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return "가";
  return (code - 0xac00) % 28 === 0 ? "가" : "이";
}

function objectParticle(word: string) {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return "를";
  return (code - 0xac00) % 28 === 0 ? "를" : "을";
}

function buildCastles(data: CastleData, counts: Record<ForceId, number>, previousOwners: Map<string, ForceId>) {
  return forceIds.flatMap((force) => generateForceCastles(force, data.forces[force].slice(0, counts[force]), previousOwners));
}

export function AdminMapEditor() {
  const [castleData, setCastleData] = useState<CastleData>(fallbackCastleData);
  const [counts, setCounts] = useState<Record<ForceId, number>>({ wei: 9, shu: 9, wu: 9 });
  const [previousOwners, setPreviousOwners] = useState<Map<string, ForceId>>(new Map());
  const [selectedCityId, setSelectedCityId] = useState("wei-1");
  const [selectedForce, setSelectedForce] = useState<ForceId>("wei");
  const [status, setStatus] = useState("JSON 데이터를 불러오는 중입니다.");

  useEffect(() => {
    fetch("/data/castles.json", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: CastleData) => {
        setCastleData(data);
        setCounts({
          wei: Math.min(9, data.forces.wei.length),
          shu: Math.min(9, data.forces.shu.length),
          wu: Math.min(9, data.forces.wu.length)
        });
        setStatus("데모 성 데이터를 적용했습니다. 현재 총 27개 성이 배치되어 있습니다.");
      })
      .catch(() => setStatus("JSON 데이터를 불러오지 못해 기본 DEMO 데이터를 사용합니다."));
  }, []);

  const castles = useMemo(() => buildCastles(castleData, counts, previousOwners), [castleData, counts, previousOwners]);
  const selectedCastle = castles.find((castle) => castle.id === selectedCityId) || castles[0];

  useEffect(() => {
    if (selectedCastle && selectedCityId !== selectedCastle.id) setSelectedCityId(selectedCastle.id);
  }, [selectedCastle, selectedCityId]);

  const summary = forceIds.reduce<Record<ForceId, number>>((acc, force) => {
    acc[force] = castles.filter((castle) => castle.owner === force).length;
    return acc;
  }, { wei: 0, shu: 0, wu: 0 });

  function updateSelectedCastle(patch: Partial<CastleSource>) {
    if (!selectedCastle) return;
    const index = Number(selectedCastle.id.split("-")[1]) - 1;
    setCastleData((current) => ({
      forces: {
        ...current.forces,
        [selectedCastle.origin]: current.forces[selectedCastle.origin].map((castle, castleIndex) => (castleIndex === index ? { ...castle, ...patch } : castle))
      }
    }));
  }

  function captureSelectedCity() {
    if (!selectedCastle) return;
    const before = selectedCastle.owner;
    setPreviousOwners((current) => {
      const next = new Map(current);
      next.set(selectedCastle.id, selectedForce);
      return next;
    });
    setStatus(
      before === selectedForce
        ? `${selectedCastle.name}${subjectParticle(selectedCastle.name)} 이미 ${forceLayouts[selectedForce].label}의 성입니다.`
        : `${forceLayouts[before].label}의 ${selectedCastle.name}${objectParticle(selectedCastle.name)} ${forceLayouts[selectedForce].label}가 점령했습니다. ${selectedCastle.cells.length}칸이 넘어갔습니다.`
    );
  }

  function applyCounts() {
    setSelectedCityId("wei-1");
    setStatus(`성 수를 적용했습니다. 현재 총 ${counts.wei + counts.shu + counts.wu}개 성이 배치되어 있습니다.`);
  }

  if (!selectedCastle) return null;

  return (
    <div className="admin-map-shell">
      <section className="admin-map-panel" aria-label="삼국지 영토 지도">
        <div className="admin-map-topbar">
          <div>
            <p className="admin-eyebrow">Three Kingdoms Territory</p>
            <h2>삼국지 점령 지도</h2>
          </div>
          <div className="admin-legend" aria-label="세력 색상 범례">
            <span><i className="wei" />위나라</span>
            <span><i className="shu" />촉나라</span>
            <span><i className="wu" />오나라</span>
          </div>
        </div>

        <div className="admin-map-wrap">
          <svg id="map" viewBox="0 0 1180 720" role="img" aria-label="위 촉 오 영역이 구분된 삼국지 지도">
            <rect x="0" y="0" width="1180" height="720" fill="#d8bd8b" />
            <image className="admin-map-art" href="/assets/three-kingdoms-scroll-map.png" x="0" y="0" width="1180" height="720" preserveAspectRatio="xMidYMid slice" />
            <g id="territories">
              {castles.map((castle) => (
                <g key={castle.id} className="castle-territory" data-city-id={castle.id} data-level={castle.level}>
                  {castle.cells.map((cell, index) => (
                    <rect
                      key={`${castle.id}-${index}`}
                      className={`admin-territory ${selectedCityId === castle.id ? "selected" : ""}`}
                      data-owner={castle.owner}
                      data-city-id={castle.id}
                      data-level={castle.level}
                      x={cell.x}
                      y={cell.y}
                      width={cell.size}
                      height={cell.size}
                      onClick={() => {
                        setSelectedCityId(castle.id);
                        setStatus(`${castle.name}${subjectParticle(castle.name)} Lv.${castle.level} ${levelInfo[castle.level].label}이며 현재 소유 세력은 ${forceLayouts[castle.owner].label}입니다. (${castle.cells.length}칸)`);
                      }}
                    />
                  ))}
                </g>
              ))}
            </g>
            <g id="cities">
              {castles.map((castle) => (
                <g key={`city-${castle.id}`}>
                  <text className={`admin-city-icon level-${castle.level}`} x={castle.cx} y={castle.cy + 7}>{levelInfo[castle.level].icon}</text>
                  <text className={`admin-city-label level-${castle.level}`} x={castle.cx + (castle.level === 1 ? 17 : 15)} y={castle.cy + 6}>{castle.name}</text>
                </g>
              ))}
            </g>
            <text className="admin-force-label" x="760" y="150">위나라</text>
            <text className="admin-force-label" x="245" y="330">촉나라</text>
            <text className="admin-force-label" x="910" y="365">오나라</text>
          </svg>
        </div>
      </section>

      <aside className="admin-control-panel" aria-label="성 점령 컨트롤">
        <div className="admin-panel-heading">
          <p className="admin-eyebrow">Control</p>
          <h2>성 소유권</h2>
        </div>

        <div className="admin-count-grid" aria-label="세력별 성 개수 설정">
          {forceIds.map((force) => (
            <label className="admin-field compact" key={force}>
              <span>{forceLayouts[force].label} 성 수</span>
              <input type="number" min={1} max={castleData.forces[force].length} value={counts[force]} onChange={(event) => setCounts((current) => ({ ...current, [force]: clampNumber(Number(event.target.value), 1, castleData.forces[force].length, current[force]) }))} />
            </label>
          ))}
        </div>
        <button className="admin-secondary" type="button" onClick={applyCounts}>성 수 적용</button>

        <label className="admin-field">
          <span>대상 성</span>
          <select value={selectedCityId} onChange={(event) => setSelectedCityId(event.target.value)}>
            {castles.map((castle) => (
              <option key={castle.id} value={castle.id}>{castle.name} · Lv.{castle.level} {levelInfo[castle.level].label} ({forceLayouts[castle.owner].label})</option>
            ))}
          </select>
        </label>

        <section className="admin-edit-panel" aria-label="선택 성 편집">
          <div className="admin-panel-heading compact-heading">
            <p className="admin-eyebrow">Admin</p>
            <h2>선택 성 편집</h2>
          </div>
          <label className="admin-field">
            <span>성 이름</span>
            <input value={selectedCastle.name} maxLength={12} onChange={(event) => updateSelectedCastle({ name: event.target.value })} />
          </label>
          <label className="admin-field">
            <span>성 레벨</span>
            <select value={selectedCastle.level} onChange={(event) => updateSelectedCastle({ level: Number(event.target.value) as CastleLevel })}>
              <option value={1}>Lv.1 본성</option>
              <option value={2}>Lv.2 주요성</option>
              <option value={3}>Lv.3 지방성</option>
            </select>
          </label>
          <div className="admin-coord-grid">
            <label className="admin-field compact">
              <span>표시 X</span>
              <input type="number" min={0} max={1180} value={Math.round(selectedCastle.cx)} onChange={(event) => updateSelectedCastle({ x: Number(event.target.value) })} />
            </label>
            <label className="admin-field compact">
              <span>표시 Y</span>
              <input type="number" min={0} max={720} value={Math.round(selectedCastle.cy)} onChange={(event) => updateSelectedCastle({ y: Number(event.target.value) })} />
            </label>
            <label className="admin-field compact">
              <span>영역 배율</span>
              <input type="number" min={0.4} max={3} step={0.1} value={selectedCastle.areaScale} onChange={(event) => updateSelectedCastle({ areaScale: Number(event.target.value) })} />
            </label>
          </div>
        </section>

        <div className="admin-field">
          <span>점령 세력</span>
          <div className="admin-segmented" role="group" aria-label="점령 세력 선택">
            {forceIds.map((force) => (
              <button key={force} type="button" data-force={force} className={selectedForce === force ? "active" : ""} onClick={() => setSelectedForce(force)}>{forceLayouts[force].label}</button>
            ))}
          </div>
        </div>
        <button className="admin-capture" type="button" onClick={captureSelectedCity}>점령 적용</button>

        <div className="admin-status" aria-live="polite">{status}</div>
        <div className="admin-summary">
          {forceIds.map((force) => (
            <span key={force} className={force}>{forceLayouts[force].label}<b>{summary[force]}</b></span>
          ))}
        </div>
        <div className="admin-city-list">
          {castles.map((castle) => {
            const origin = castle.origin === castle.owner ? "본래 영토" : `${forceLayouts[castle.origin].label} 출신 점령지`;
            return (
              <button key={castle.id} className={`admin-city-row level-${castle.level}`} onClick={() => setSelectedCityId(castle.id)}>
                <strong>{castle.name}<small>Lv.{castle.level} {levelInfo[castle.level].label} · {origin} · {castle.cells.length}칸</small></strong>
                <span className={`admin-badge ${castle.owner}`}>{forceLayouts[castle.owner].label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
