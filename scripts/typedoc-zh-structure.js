/**
 * Rename Typedoc output folders to Chinese and fix links.
 * - classes -> 类
 * - interfaces -> 接口
 * Also updates links inside markdown and VitePress sidebar config.
 */
import { existsSync, renameSync, readFileSync, writeFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const docsDir = join(root, "../../docs/tthree");
const vitepressConfig = join(root, "../../docs/.vitepress/config.ts");

function renameDir(oldName, newName) {
    const oldPath = join(docsDir, oldName);
    const newPath = join(docsDir, newName);
    if (existsSync(oldPath)) {
        try {
            renameSync(oldPath, newPath);
            console.log(`Renamed: ${oldName} -> ${newName}`);
        } catch (e) {
            console.error(`Failed to rename ${oldName} -> ${newName}:`, e);
        }
    }
}

function walk(dir, fn) {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        const s = statSync(p);
        if (s.isDirectory()) walk(p, fn);
        else if (s.isFile() && p.endsWith(".md")) fn(p);
    }
}

function fixLinksInMarkdown(mdPath) {
    let content = readFileSync(mdPath, "utf8");
    content = content.replaceAll("/tthree/classes/", "/tthree/类/");
    content = content.replaceAll("classes/", "类/");
    content = content.replaceAll("/tthree/interfaces/", "/tthree/接口/");
    content = content.replaceAll("interfaces/", "接口/");
    writeFileSync(mdPath, content, "utf8");
    console.log("Updated links:", mdPath);
}

function fixVitepressConfig() {
    if (!existsSync(vitepressConfig)) return;
    let cfg = readFileSync(vitepressConfig, "utf8");
    cfg = cfg.replaceAll("/tthree/classes/", "/tthree/类/");
    cfg = cfg.replaceAll("/tthree/interfaces/", "/tthree/接口/");
    writeFileSync(vitepressConfig, cfg, "utf8");
    console.log("Updated VitePress config links");
}

renameDir("classes", "类");
renameDir("interfaces", "接口");
walk(docsDir, fixLinksInMarkdown);
fixVitepressConfig();
console.log("Structure localization complete.");
