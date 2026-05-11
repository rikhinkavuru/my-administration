"use client";
/**
 * Client-only mount for PlatformDeck3D. Dynamic-imported so its GSAP +
 * 3D card markup never ships in the platform page's initial bundle.
 */
import dynamic from "next/dynamic";
import IssueCard from "@/components/IssueCard";
import type { Issue } from "@/lib/data/platform";

const Deck = dynamic(() => import("./PlatformDeck3D"), {
  ssr: false,
  // The dynamic component renders its own fallback for reduced-motion /
  // mobile; no separate skeleton needed.
  loading: () => null,
});

export default function PlatformDeck3DMount({ issues }: { issues: Issue[] }) {
  return <Deck issues={issues} />;
}

export function StaticPlatformList({ issues }: { issues: Issue[] }) {
  return (
    <ol className="grid gap-px bg-[var(--hairline)] border border-[var(--hairline)] list-none">
      {issues.map((issue, i) => (
        <li key={issue.id} id={issue.id}>
          <IssueCard issue={issue} index={i} />
        </li>
      ))}
    </ol>
  );
}
