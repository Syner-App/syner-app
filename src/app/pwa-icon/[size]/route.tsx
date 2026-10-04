import { brandIcon } from "@/app/pwa-icon/brand-icon";

const SIZES = ["192", "512"];

export function generateStaticParams() {
  return SIZES.map((size) => ({ size }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/pwa-icon/[size]">,
) {
  const { size } = await params;
  if (!SIZES.includes(size)) {
    return new Response("Not found", { status: 404 });
  }
  return brandIcon(Number(size));
}
