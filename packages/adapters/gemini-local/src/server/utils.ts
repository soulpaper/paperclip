import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export function firstNonEmptyLine(text: string): string {
    return (
        text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .find(Boolean) ?? ""
    );
}

export async function ensureGeminiHome(env?: Record<string, string | undefined>): Promise<string> {
    const home = env?.HOME || os.homedir();
    const geminiHome = path.join(home, ".gemini");
    await fs.mkdir(geminiHome, { recursive: true });
    return geminiHome;
}
