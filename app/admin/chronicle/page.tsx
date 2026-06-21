import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminChronicleEditor } from "@/components/AdminChronicleEditor";
import { AdminSectionNav } from "@/components/AdminSectionNav";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";

export default async function AdminChroniclePage() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <div className="mb-4">
        <div className="mb-2 text-xs font-bold tracking-[0.24em] text-[var(--accent)]">ADMIN</div>
        <h1 className="text-2xl font-black text-[#f3e7d0]">연대기 관리자</h1>
        <p className="mt-1 text-sm text-[#aa9a82]">발생일, 국가, 내용을 직접 추가하고 수정하거나 삭제할 수 있습니다.</p>
      </div>
      <AdminSectionNav />
      <AdminChronicleEditor />
    </div>
  );
}
