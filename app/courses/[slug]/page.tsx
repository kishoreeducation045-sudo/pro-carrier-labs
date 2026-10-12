import { redirect } from "next/navigation";

export default async function CourseDetailPageRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/workshops/${slug}`);
}
