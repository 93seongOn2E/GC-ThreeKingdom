export const nationConfigs = [
  {
    key: "위나라",
    short: "위",
    color: "#2f73c8",
    description: "북방 중심의 강력한 군사 세력"
  },
  {
    key: "촉나라",
    short: "촉",
    color: "#2f9b5f",
    description: "서남부 산악 지형을 기반으로 한 세력"
  },
  {
    key: "오나라",
    short: "오",
    color: "#d63d35",
    description: "강동과 수로를 장악한 해양 세력"
  }
] as const;

export const crewBadgeClassMap: Record<string, string> = {
  "버인협회": "bg-[#9fd2ff]/28 text-[#eef7ff] ring-[#9fd2ff]/50",
  "로스타시티": "bg-[#5a8dff]/24 text-[#e6eeff] ring-[#5a8dff]/48",
  "털즈란": "bg-[#244fba]/24 text-[#dbe6ff] ring-[#244fba]/48",

  "버컴퍼니": "bg-[#a8efc8]/28 text-[#effff5] ring-[#a8efc8]/50",
  "꾸한성": "bg-[#2fae63]/24 text-[#e1ffec] ring-[#2fae63]/48",

  "지력사무소": "bg-[#ffc1c1]/28 text-[#fff1f1] ring-[#ffc1c1]/50",
  "가무소": "bg-[#ff8f8f]/24 text-[#fff0f0] ring-[#ff8f8f]/48",
  "홍피스": "bg-[#e04444]/24 text-[#ffe4e4] ring-[#e04444]/48"
};

export const hiddenJobConfig = {
  군주: {
    jobs: ["조조", "유비", "손권"],
    badgeClass: "bg-[#f4d35e]/20 text-[#ffe79a] ring-[#f4d35e]/40"
  },
  전사: {
    jobs: [] as string[],
    badgeClass: "bg-[#ffb86c]/20 text-[#ffe6c7] ring-[#ffb86c]/40"
  },
  도적: {
    jobs: [] as string[],
    badgeClass: "bg-[#b58cff]/20 text-[#eadcff] ring-[#b58cff]/40"
  },
  힐러: {
    jobs: [] as string[],
    badgeClass: "bg-[#73e0cf]/20 text-[#dcfffa] ring-[#73e0cf]/40"
  },
  법사: {
    jobs: [] as string[],
    badgeClass: "bg-[#7d8cff]/20 text-[#e6e9ff] ring-[#7d8cff]/40"
  },
  궁수: {
    jobs: [] as string[],
    badgeClass: "bg-[#8fa86b]/20 text-[#eef7dd] ring-[#8fa86b]/40"
  }
} as const;

export function getHiddenJobBadge(job: string | null) {
  if (!job) {
    return null;
  }

  for (const [label, config] of Object.entries(hiddenJobConfig)) {
    if ((config.jobs as readonly string[]).includes(job)) {
      return {
        label,
        className: config.badgeClass
      };
    }
  }

  return null;
}
