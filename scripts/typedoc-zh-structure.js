/**
 * Rename Typedoc output folders and fix links for tthree docs.
 * - classes / 类 -> ThreeBase基类
 * - interfaces / 接口 -> ThreeBase基类参数
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

    // 仅规范 tthree 路径段为无空格版本（幂等）
    content = content.replace(
        /\/tthree\/(?:classes|类)\//g,
        "/tthree/ThreeBase基类/",
    );
    content = content.replace(
        /\/tthree\/(?:interfaces|接口)\//g,
        "/tthree/ThreeBase基类参数/",
    );

    // 规范括号内的相对链接（只处理 tthree 的成员链接）
    content = content.replace(
        /\((?:\.\/)?(?:classes|类)\/([^)]+)\)/g,
        "(ThreeBase基类/$1)",
    );
    content = content.replace(
        /\((?:\.\/)?(?:interfaces|接口)\/([^)]+)\)/g,
        "(ThreeBase基类参数/$1)",
    );

    writeFileSync(mdPath, content, "utf8");
    console.log("Updated links:", mdPath);
}

function fixVitepressConfig() {
    if (!existsSync(vitepressConfig)) return;
    let cfg = readFileSync(vitepressConfig, "utf8");

    // 仅修正 tthree 侧边栏路径为无空格目录（幂等）
    cfg = cfg.replace(/\/tthree\/(?:classes|类)\//g, "/tthree/ThreeBase基类/");
    cfg = cfg.replace(
        /\/tthree\/(?:interfaces|接口)\//g,
        "/tthree/ThreeBase基类参数/",
    );

    writeFileSync(vitepressConfig, cfg, "utf8");
    console.log("Updated VitePress config links");
}

// 仅在存在时重命名到最终目录名
renameDir("classes", "ThreeBase基类");
renameDir("interfaces", "ThreeBase基类参数");
renameDir("类", "ThreeBase基类");
renameDir("接口", "ThreeBase基类参数");
renameDir("ThreeBase 基类", "ThreeBase基类");
renameDir("ThreeBase 基类参数", "ThreeBase基类参数");

walk(docsDir, fixLinksInMarkdown);
fixVitepressConfig();
console.log("Structure localization complete.");
