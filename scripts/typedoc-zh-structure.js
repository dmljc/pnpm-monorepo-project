/**
 * Rename Typedoc output folders and fix links.
 * - classes / 类 / ThreeBase 基类 -> ThreeBase基类
 * - interfaces / 接口 / ThreeBase 基类参数 -> ThreeBase基类参数
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

    // 规范化 /tthree/ 下的目录段为无空格版本
    content = content.replace(
        /\/tthree\/(?:classes|类|ThreeBase(?:%20| )?基类)\//g,
        "/tthree/ThreeBase基类/",
    );
    content = content.replace(
        /\/tthree\/(?:interfaces|接口|ThreeBase(?:%20| )?基类参数)\//g,
        "/tthree/ThreeBase基类参数/",
    );

    // 规范化括号内的相对链接
    content = content.replace(
        /\((?:\.\/)?(?:classes|类|ThreeBase(?:%20| )?基类)\/([^)]+)\)/g,
        "(ThreeBase基类/$1)",
    );
    content = content.replace(
        /\((?:\.\/)?(?:interfaces|接口|ThreeBase(?:%20| )?基类参数)\/([^)]+)\)/g,
        "(ThreeBase基类参数/$1)",
    );

    // 清理重复片段
    content = content.replace(
        /\/tthree\/(ThreeBase基类\/)+/g,
        "/tthree/ThreeBase基类/",
    );
    content = content.replace(
        /\/tthree\/(ThreeBase基类参数\/)+/g,
        "/tthree/ThreeBase基类参数/",
    );
    content = content.replace(/(ThreeBase基类\/)+/g, "ThreeBase基类/");
    content = content.replace(/(ThreeBase基类参数\/)+/g, "ThreeBase基类参数/");

    writeFileSync(mdPath, content, "utf8");
    console.log("Updated links:", mdPath);
}

function fixVitepressConfig() {
    if (!existsSync(vitepressConfig)) return;
    let cfg = readFileSync(vitepressConfig, "utf8");
    cfg = cfg.replace(
        /\/tthree\/(?:classes|类|ThreeBase(?:%20| )?基类)\//g,
        "/tthree/ThreeBase基类/",
    );
    cfg = cfg.replace(
        /\/tthree\/(?:interfaces|接口|ThreeBase(?:%20| )?基类参数)\//g,
        "/tthree/ThreeBase基类参数/",
    );
    writeFileSync(vitepressConfig, cfg, "utf8");
    console.log("Updated VitePress config links");
}

// 将输出目录统一重命名为无空格
renameDir("classes", "ThreeBase基类");
renameDir("interfaces", "ThreeBase基类参数");
renameDir("类", "ThreeBase基类");
renameDir("接口", "ThreeBase基类参数");
renameDir("ThreeBase 基类", "ThreeBase基类");
renameDir("ThreeBase 基类参数", "ThreeBase基类参数");

walk(docsDir, fixLinksInMarkdown);
fixVitepressConfig();
console.log("Structure localization complete.");
