import { redirect } from "next/navigation";

export const revalidate = 0;

export default function AdminSiteSettingsPage() {
  redirect("/admin/website-content?tab=site-settings");
}
