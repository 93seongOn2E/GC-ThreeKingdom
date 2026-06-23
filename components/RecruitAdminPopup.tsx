"use client";

import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";

const contactUrl = "https://note.sooplive.com/app/index.php?page=write&id_list=lsw5332";
const storageKey = "gc-recruit-admin-popup-hidden-until";
const weekMs = 7 * 24 * 60 * 60 * 1000;

export function RecruitAdminPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hiddenUntil = Number(window.localStorage.getItem(storageKey) ?? 0);
    if (!Number.isFinite(hiddenUntil) || hiddenUntil <= Date.now()) {
      setOpen(true);
    }
  }, []);

  function closeForWeek() {
    window.localStorage.setItem(storageKey, String(Date.now() + weekMs));
    setOpen(false);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="recruit-popup-layer">
      <section className="recruit-popup" role="dialog" aria-modal="true" aria-labelledby="recruit-popup-title">
        <button
          type="button"
          className="recruit-popup-close"
          onClick={() => setOpen(false)}
          aria-label="팝업 닫기"
        >
          <X size={18} />
        </button>

        <div className="recruit-popup-copy">
          <p className="recruit-popup-eyebrow">관리자 모집</p>
          <h2 id="recruit-popup-title">크루 현황·연대기 관리자를 모집합니다</h2>
          <p className="recruit-popup-desc">
            장비·직업 현황과 전투 연대기 업데이트를 도와주실 분을 찾고 있습니다.
            아래 양식으로 문의해주세요.
          </p>
        </div>

        <div className="recruit-popup-fields" aria-label="문의 양식">
          <div>
            <span>담당 희망 크루</span>
            <strong>업데이트를 담당할 크루명</strong>
          </div>
          <div>
            <span>리캡 캡쳐</span>
            <strong>확인 가능한 리캡 캡쳐</strong>
          </div>
        </div>

        <div className="recruit-popup-actions">
          <a href={contactUrl} target="_blank" rel="noreferrer" className="recruit-popup-primary">
            문의하기
            <ExternalLink size={16} />
          </a>
          <button type="button" className="recruit-popup-secondary" onClick={closeForWeek}>
            일주일간 보지 않기
          </button>
        </div>
      </section>
    </div>
  );
}
