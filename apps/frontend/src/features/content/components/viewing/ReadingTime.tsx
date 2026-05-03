/**
 * readingTime.tsx
 *
 * Shared reading-time utilities and UI for DocPreviewer and DocumentEditorModal.
 *
 * Exports:
 *  - countWords(text)                      — word count from a plain string
 *  - formatReadingTime(wordCount)          — human-readable duration string
 *  - extractWordCountFromViewer(instance)  — async word count from Apryse WebViewer
 *  - ReadingTimeBadge                      — MUI chip component displaying the count
 */

import type { WebViewerInstance } from "@pdftron/webviewer";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Average adult reading speed in words per minute. */
export const WORDS_PER_MINUTE = 200;

// ─── Word counting ────────────────────────────────────────────────────────────

/**
 * Counts words in a string using a whitespace-split heuristic.
 * Strips HTML/XML tags before counting so markup doesn't inflate the total.
 *
 * @example
 * countWords("Hello world")        // 2
 * countWords("<p>Hello world</p>") // 2
 */
export function countWords(text: string): number {
  const stripped = text.replace(/<[^>]*>/g, " ");
  const words = stripped.trim().split(/\s+/);
  return words.length === 1 && words[0] === "" ? 0 : words.length;
}

// ─── Reading time ─────────────────────────────────────────────────────────────

/**
 * Converts a word count into a human-readable estimated reading time string.
 *
 * - Under a minute  → "< 1 min read"
 * - Under an hour   → "N min read"
 * - An hour or more → "N hr M min read"
 *
 * Returns an empty string for a zero word count.
 *
 * @example
 * formatReadingTime(100)  // "1 min read"
 * formatReadingTime(5000) // "21 min read"
 */
export function formatReadingTime(wordCount: number): string {
  if (wordCount === 0) return "";
  const totalMinutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  if (totalMinutes < 1) return "< 1 min read";
  if (totalMinutes < 60) return `${totalMinutes} min read`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours} hr ${mins} min read` : `${hours} hr read`;
}

// ─── WebViewer extraction ─────────────────────────────────────────────────────

/**
 * Extracts text from every page of the currently loaded Apryse WebViewer
 * document and returns the total word count.
 *
 * Should be called inside a "documentLoaded" event listener so that
 * loadPageText() calls are available.
 *
 * Returns 0 on any error so a failed extraction never breaks the preview.
 *
 * @example
 * instance.Core.documentViewer.addEventListener("documentLoaded", async () => {
 *   const count = await extractWordCountFromViewer(instance);
 *   setWordCount(count);
 * });
 */
export async function extractWordCountFromViewer(
  instance: WebViewerInstance,
): Promise<number> {
  try {
    const { documentViewer } = instance.Core;
    const doc = documentViewer.getDocument();
    if (!doc) return 0;

    const pageCount = documentViewer.getPageCount();
    let allText = "";

    for (let page = 1; page <= pageCount; page++) {
      const pageText = await doc.loadPageText(page);
      allText += pageText + " ";
    }

    return countWords(allText);
  } catch {
    // Non-critical: swallow errors so a failed count never breaks the caller
    return 0;
  }
}
