import { createFileRoute } from "@tanstack/react-router";
import { Unit99 } from "@/components/unit99/Unit99";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Unit99 />;
}
