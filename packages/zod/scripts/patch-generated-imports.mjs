import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const generatedSchemasPath = resolve(scriptDir, "..", "generated", "schemas.ts");

const original = readFileSync(generatedSchemasPath, "utf8");

const patched = original.replace(
    /from ['"]\.\.\/\.\.\/db\/generated\/prisma\/client['"];/g,
    "from '../../db/generated/prisma/client.js';",
);

if (patched !== original) {
    writeFileSync(generatedSchemasPath, patched);
}