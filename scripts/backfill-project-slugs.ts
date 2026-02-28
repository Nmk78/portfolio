/**
 * Backfill script: add or fix `slug` on all projects.
 * Uses native MongoDB driver to handle documents with null slug (Prisma rejects these).
 *
 * Run: pnpm run backfill-slugs
 * Or:  bun run scripts/backfill-project-slugs.ts
 */

import { MongoClient } from "mongodb";
import { generateUniqueSlug } from "../lib/validation";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new MongoClient(url);
  await client.connect();

  try {
    const db = client.db();
    const collection = db.collection("Project");

    const projects = await collection
      .find({})
      .sort({ _id: 1 })
      .toArray();

    const existingSlugs = new Set(
      projects
        .filter((p) => p.slug && String(p.slug).trim())
        .map((p) => String(p.slug))
    );

    let updated = 0;
    for (const project of projects) {
      const slug = project.slug;
      const needsSlug =
        !slug || (typeof slug === "string" && !slug.trim());

      if (!needsSlug) continue;

      const title = project.title;
      if (!title) {
        console.warn(`Skipping project ${project._id}: no title`);
        continue;
      }

      const newSlug = generateUniqueSlug(title, Array.from(existingSlugs));
      existingSlugs.add(newSlug);

      await collection.updateOne(
        { _id: project._id },
        { $set: { slug: newSlug } }
      );

      console.log(`Updated project "${title}" -> slug: ${newSlug}`);
      updated++;
    }

    console.log(`\nDone. Updated ${updated} project(s) with slugs.`);
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
