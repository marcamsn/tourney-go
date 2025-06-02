import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "TourneyGo" },
    { name: "description", content: "A web application to manage internal club tournaments with individual scoring in team-based, rotating matchups tourneys." },
  ];
};

export default function Index() {
  return (
    <div>
      Home
    </div>
  );
}

