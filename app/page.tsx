import Landing from "@/components/Landing";
import { getSite } from "@/lib/content-db";

// Content lives in PostgreSQL and must be read at request time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { content, contact } = await getSite();
  return <Landing content={content} contact={contact} />;
}
