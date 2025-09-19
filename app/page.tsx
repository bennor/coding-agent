import { HomePage } from "@/components/HomePage";
import { modelFlag } from "@/lib/flags";

export default async function Home() {
  const currentModel = await modelFlag();

  return <HomePage currentModel={currentModel} />;
}
