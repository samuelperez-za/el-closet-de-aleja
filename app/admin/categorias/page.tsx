import { requireAdminSession } from "@/lib/admin-session";
import { AdminCategoriesPanel } from "@/components/AdminCategoriesPanel";
import { getCategoryArtwork } from "@/lib/categories";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function AdminCategoriesPage() {
  await requireAdminSession();
  const artwork = await getCategoryArtwork();

  return (
    <main className="section-shell flex-1 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al dashboard
          </Button>
        </Link>
      </div>

      <AdminCategoriesPanel initialArtwork={artwork} />
    </main>
  );
}
