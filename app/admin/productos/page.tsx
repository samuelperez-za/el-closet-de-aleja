import { AdminProductsPanel } from "@/components/AdminProductsPanel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/admin-session";
import { getAdminProducts } from "@/lib/products";

export default async function AdminProductsPage() {
  await requireAdminSession();
  const products = await getAdminProducts();

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

      <AdminProductsPanel products={products} />
    </main>
  );
}
