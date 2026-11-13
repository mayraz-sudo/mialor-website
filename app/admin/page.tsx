import type { Metadata } from "next";
import AdminClient from "@/components/admin/AdminClient";

export const metadata: Metadata = { title: "ניהול הזמנות | MIALOR", robots: { index: false, follow: false } };

export default function AdminPage() {
  return <AdminClient />;
}
