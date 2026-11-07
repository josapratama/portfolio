#!/usr/bin/env node
/**
 * 🌐 [Portfolio Web] Build-Time Translation Synchronizer
 * Downloads latest translations from Polyglot Hub (https://polyglot-hub.josapratama.com)
 * with automatic fallback to local Polyglot Hub store.
 * Zero runtime latency.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_SLUG = process.argv[2] || "portfolio";
const TARGET_DIR = path.resolve(process.cwd(), process.argv[3] || "src/locales");
const POLYGLOT_URL = (process.argv[4] || process.env.POLYGLOT_HUB_URL || "https://polyglot-hub.josapratama.com").replace(/\/+$/, "");

async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) return res;
    } catch (e) {
      if (i === retries - 1) return null;
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  return null;
}

function getLocalPolyglotFallback(projectSlug, langCode) {
  const localStorePaths = [
    path.resolve(process.cwd(), "../polyglot-hub/backend/data/polyglot-store.json"),
    path.resolve(process.cwd(), "../polyglot-hub/data/polyglot-store.json"),
    "D:/coding/raspberry pi/project/polyglot-hub/backend/data/polyglot-store.json",
    "D:/coding/raspberry pi/project/polyglot-hub/data/polyglot-store.json",
  ];

  for (const p of localStorePaths) {
    if (fs.existsSync(p)) {
      try {
        const store = JSON.parse(fs.readFileSync(p, "utf-8"));
        const targetProj = store.projects?.find((pr) => pr.slug === projectSlug);
        const commonProj = store.projects?.find((pr) => pr.slug === "common");
        if (!targetProj) continue;

        const dict = {};
        function setNested(target, pathKey, val) {
          const parts = pathKey.split(".");
          let curr = target;
          for (let i = 0; i < parts.length - 1; i++) {
            if (typeof curr[parts[i]] !== "object" || curr[parts[i]] === null) {
              curr[parts[i]] = {};
            }
            curr = curr[parts[i]];
          }
          curr[parts[parts.length - 1]] = val;
        }

        if (commonProj) {
          const commonTrans = (store.translations || []).filter((t) => t.projectId === commonProj.id);
          for (const item of commonTrans) {
            const val = item.translations?.[langCode] || item.translations?.id || item.translations?.en;
            if (val) setNested(dict, item.key, val);
          }
        }

        const projTrans = (store.translations || []).filter((t) => t.projectId === targetProj.id);
        for (const item of projTrans) {
          const val = item.translations?.[langCode] || item.translations?.id || item.translations?.en;
          if (val) setNested(dict, item.key, val);
        }

        if (Object.keys(dict).length > 0) return dict;
      } catch (err) {
        // continue to next candidate
      }
    }
  }
  return null;
}

async function syncTranslations() {
  console.log("\n======================================================");
  console.log("🌐 [Polyglot Hub] Build-Time Translation Sync");
  console.log("======================================================");
  console.log(`📦 Project     : "${PROJECT_SLUG}"`);
  console.log(`📡 Server URL  : ${POLYGLOT_URL}`);
  console.log(`📁 Target Dir  : ${TARGET_DIR}`);

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const languages = [
    { code: "id", name: "Bahasa Indonesia" },
    { code: "en", name: "English" },
    { code: "ja", name: "Japanese" },
  ];

  let successCount = 0;

  for (const lang of languages) {
    const nestedUrl = `${POLYGLOT_URL}/api/v1/export/${PROJECT_SLUG}/${lang.code}?common=true&format=nested`;
    let dict = null;

    try {
      const res = await fetchWithRetry(nestedUrl);
      if (res && res.ok) {
        const json = await res.json();
        if (json && Object.keys(json).length > 0) {
          dict = json;
        }
      }
    } catch (err) {
      // will fallback below
    }

    if (!dict || Object.keys(dict).length === 0) {
      dict = getLocalPolyglotFallback(PROJECT_SLUG, lang.code);
      if (dict) {
        console.log(`  ⚡ [Fallback] Using local Polyglot Hub store for ${lang.code}`);
      }
    }

    if (dict && Object.keys(dict).length > 0) {
      const filePath = path.join(TARGET_DIR, `${lang.code}.json`);
      fs.writeFileSync(filePath, JSON.stringify(dict, null, 2), "utf-8");
      const keyCount = Object.keys(dict).length;
      console.log(`  ✓ Synced ${lang.code}.json (${keyCount} namespaces)`);
      successCount++;
    } else {
      console.error(`  ❌ Failed to get translations for ${lang.code}`);
    }
  }

  console.log(`\n✨ Successfully synced ${successCount} languages! Zero runtime lag.`);
  console.log("======================================================\n");
}

syncTranslations().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
