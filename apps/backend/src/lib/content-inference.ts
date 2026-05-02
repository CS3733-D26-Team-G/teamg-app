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
          content:
            "Extract normalized searchable text and keywords from uploaded business content. Return only plain text, no markdown. Do not provide an explanation for your response. Return ONLY plain text of normalized searchable texts and keywords.",
        },
        {
          role: "user",
          content: [
            `File name: ${file.originalname}`,
            `MIME type: ${file.mimetype}`,
            "Content preview:",
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
