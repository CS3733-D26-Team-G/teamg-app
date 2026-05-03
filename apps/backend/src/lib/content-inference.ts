import Groq from "groq-sdk";
import AdmZip from "adm-zip";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import * as XLSX from "xlsx";
import { logger } from "../logger.ts";

const DEFAULT_MODEL = "llama-3.1-8b-instant";
const MAX_SOURCE_CHARS = 16_000;
const MAX_SEARCH_TEXT_CHARS = 24_000;

const textMimeTypes = new Set([
  "application/json",
  "application/xml",
  "text/csv",
  "text/html",
  "text/markdown",
  "text/plain",
  "text/xml",
]);

const spreadsheetMimeTypes = new Set([
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const presentationMimeTypes = new Set([
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

type SearchTextSourceFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};

const SYSTEM_PROMPT = `You are a high-precision document keyword extraction engine for a content management system.

Your task is to analyze structured document input and return a concise set of normalized, searchable keywords that best represent the document’s content.

You will receive input in the following format:

File name: <string>
MIME type: <string>
Text:
<document text>

----------------------------------------
OBJECTIVE
----------------------------------------

Extract meaningful keywords that:
- Represent the core topics, entities, and concepts in the document
- Are optimized for search, indexing, and retrieval
- Are normalized (see rules below)

----------------------------------------
OUTPUT FORMAT (STRICT)
----------------------------------------

Return ONLY strings. No explanations.

Example:
data science internship machine learning ai python

----------------------------------------
NORMALIZATION RULES
----------------------------------------

1. Lowercase all keywords
2. Remove punctuation and special characters
3. Use singular forms (e.g., "models" → "model")
4. Prefer short phrases (1–3 words max)
5. Avoid stopwords (e.g., "the", "and", "of", "is")
6. Deduplicate keywords
7. Avoid overly generic terms unless truly central (e.g., avoid "document", "file")
8. Expand abbreviations if obvious (e.g., "AI" → "artificial intelligence")
9. Include both:
   - Specific terms (e.g., "neural network")
   - Broader categories if relevant (e.g., "machine learning")

----------------------------------------
CONTENT UNDERSTANDING
----------------------------------------

- Prioritize semantic meaning over frequency
- Identify:
  - Topics
  - Named entities (people, places, organizations if present)
  - Technical terms
  - Domain-specific jargon
- Use MIME type as context:
  - application/pdf → likely formal document
  - text/plain → raw content
- Use file name as a weak signal only if relevant

----------------------------------------
QUALITY TARGET
----------------------------------------

- Return 5–20 high-quality keywords depending on content richness
- Prefer precision over quantity
- Keywords should meaningfully improve search relevance

----------------------------------------
FAILURE HANDLING
----------------------------------------

If the text is empty or meaningless, return a blank response.

----------------------------------------
BEGIN PROCESSING
----------------------------------------
`;

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    logger.warn("Skipping content inference: GROQ_API_KEY is undefined");
    return null;
  }

  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

async function getTextPreview(file: SearchTextSourceFile) {
  const isTextFile =
    file.mimetype.startsWith("text/") || textMimeTypes.has(file.mimetype);

  if (isTextFile) {
    return file.buffer.toString("utf8").slice(0, MAX_SOURCE_CHARS);
  }

  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    try {
      const parsed = await parser.getText();
      return parsed.text.slice(0, MAX_SOURCE_CHARS);
    } finally {
      await parser.destroy();
    }
  }

  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword"
  ) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return parsed.value.slice(0, MAX_SOURCE_CHARS);
  }

  if (spreadsheetMimeTypes.has(file.mimetype)) {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    return workbook.SheetNames.map((sheetName) =>
      XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]),
    )
      .join("\n")
      .slice(0, MAX_SOURCE_CHARS);
  }

  if (presentationMimeTypes.has(file.mimetype)) {
    const zip = new AdmZip(file.buffer);
    return zip
      .getEntries()
      .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.entryName))
      .map((entry) =>
        entry
          .getData()
          .toString("utf8")
          .replace(/<[^>]+>/g, " "),
      )
      .join("\n")
      .slice(0, MAX_SOURCE_CHARS);
  }

  return null;
}

function normalizeSearchText(value: string | null | undefined) {
  const normalized = value?.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, MAX_SEARCH_TEXT_CHARS) : null;
}

export async function inferSearchTextFromUpload(
  file: SearchTextSourceFile | undefined,
): Promise<string | null> {
  if (!file) {
    return null;
  }

  const client = getGroqClient();
  if (!client) {
    return null;
  }

  let textPreview: string | null;
  try {
    textPreview = await getTextPreview(file);
  } catch (error) {
    logger.warn(`Failed to extract text from ${file.originalname}: ${error}`);
    return null;
  }

  if (!textPreview) {
    logger.warn(
      `Skipping Groq content inference for unsupported file type ${file.mimetype}`,
    );
    return null;
  }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.GROQ_CONTENT_INFERENCE_MODEL ?? DEFAULT_MODEL,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            `File name: ${file.originalname}`,
            `MIME type: ${file.mimetype}`,
            "Text:",
            textPreview,
          ].join("\n"),
        },
      ],
    });

    return normalizeSearchText(completion.choices[0]?.message?.content);
  } catch (error) {
    logger.warn(
      `Groq content inference failed for ${file.originalname}: ${error}`,
    );
    return null;
  }
}
