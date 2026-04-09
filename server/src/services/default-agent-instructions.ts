import fs from "node:fs/promises";

const DEFAULT_AGENT_BUNDLE_FILES = {
  default: ["AGENTS.md"],
  ceo: ["AGENTS.md", "HEARTBEAT.md", "SOUL.md", "TOOLS.md"],
  leader: ["AGENTS.md"],
} as const;

type DefaultAgentBundleRole = keyof typeof DEFAULT_AGENT_BUNDLE_FILES;

function resolveDefaultAgentBundleUrl(role: DefaultAgentBundleRole, fileName: string) {
  return new URL(`../onboarding-assets/${role}/${fileName}`, import.meta.url);
}

export async function loadDefaultAgentInstructionsBundle(role: DefaultAgentBundleRole): Promise<Record<string, string>> {
  const fileNames = DEFAULT_AGENT_BUNDLE_FILES[role];
  const entries = await Promise.all(
    fileNames.map(async (fileName) => {
      const content = await fs.readFile(resolveDefaultAgentBundleUrl(role, fileName), "utf8");
      return [fileName, content] as const;
    }),
  );
  return Object.fromEntries(entries);
}

/**
 * Resolves the instructions bundle tier for an agent based on org chart position.
 * - CEO role → ceo bundle
 * - Reports directly to a CEO → leader bundle
 * - Everyone else → default bundle
 */
export function resolveDefaultAgentInstructionsBundleRole(
  role: string,
  managerRole?: string | null,
): DefaultAgentBundleRole {
  if (role === "ceo") return "ceo";
  if (managerRole === "ceo") return "leader";
  return "default";
}
