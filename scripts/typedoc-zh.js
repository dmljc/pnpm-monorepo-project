/**
 * Post-process Typedoc Markdown headings to Chinese.
 */
import {
    readFileSync,
    writeFileSync,
    readdirSync,
    statSync,
    existsSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const candidates = [
    join(root, "../../docs/tthree"),
    join(root, "../..", "docs", "tthree"),
    join(root, "docs/tthree"),
];
const targetDir = candidates.find((d) => existsSync(d));
if (!targetDir) {
    console.error("Cannot find docs/tthree directory from", root);
    process.exit(1);
}

// replacements 不再包含 “Defined in”
const replacements = new Map([
    ["## Constructors", "## 构造函数"],
    ["## Properties", "## 属性"],
    ["## Methods", "## 方法"],
    ["## Accessors", "## 访问器"],
    ["### Parameters", "### 参数"],
    ["#### Parameters", "#### 参数"],
    ["### Returns", "### 返回值"],
    ["## Returns", "## 返回值"],
    ["## Example", "## 示例"],
]);

// Extra common variants and list-item forms to catch right-side TOC entries
const extraReplacements = new Map([
    ["- Example", "- 示例"],
    ["- Properties", "- 属性"],
    ["- Methods", "- 方法"],
    ["- Constructors", "- 构造函数"],
    ["- Parameters", "- 参数"],
    ["- Returns", "- 返回值"],
    ["## Classes", "## 类"],
    ["## Functions", "## 函数"],
    ["## Interfaces", "## 接口"],
    ["Classes", "类"],
    ["Functions", "函数"],
    ["Interfaces", "接口"],
]);

function walk(dir) {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        const s = statSync(p);
        if (s.isDirectory()) walk(p);
        else if (s.isFile() && p.endsWith(".md")) localizeFile(p);
    }
}

function localizeFile(filePath) {
    let content = readFileSync(filePath, "utf8");

    // 英->中替换
    for (const [from, to] of replacements) {
        const re = new RegExp(
            `(^|\n)${from.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}(\n)`,
            "g",
        );
        content = content.replace(re, `$1${to}$2`);
    }
    for (const [from, to] of extraReplacements) {
        const re2 = new RegExp(
            `(^|\n)${from.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}(\n)`,
            "g",
        );
        content = content.replace(re2, `$1${to}$2`);
    }
    // Generic replacement for heading levels and list items (catch any number of #)
    const kwMap = new Map([
        ["Parameters", "参数"],
        ["Returns", "返回值"],
        ["Example", "示例"],
        ["Properties", "属性"],
        ["Methods", "方法"],
        ["Constructors", "构造函数"],
        ["Accessors", "访问器"],
        ["Classes", "类"],
        ["Functions", "函数"],
        ["Interfaces", "接口"],
    ]);

    for (const [eng, chi] of kwMap) {
        // headings like: ## Parameters  (any number of #)
        const hRe = new RegExp(`^(#{1,6})\\s+${eng}\\s*$`, "gm");
        content = content.replace(hRe, `$1 ${chi}`);
        // list items like: - Parameters
        const liRe = new RegExp(`(^|\\n)\\s*[-*]\\s*${eng}(\\n)`, "g");
        content = content.replace(liRe, `$1- ${chi}$2`);
    }
    // Replace inline occurrences that may not be alone on a line (e.g. "Defined in: [file](...)")
    // 移除“Defined in/定义于”的替换与兜底清理（改为完全依赖配置）
    // 原先的：
    // content = content.replaceAll("Defined in:", "定义于：");
    // content = content.replaceAll("Defined in", "定义于");
    // content = content.replace(/^\s*(定义于|Defined in)[：:]\s*.*$/gm, "");

    content = content.replace(/<a id="autoresize"><\/a>[\s\S]*?\n---\n/g, "");
    content = content.replace(/(^|\n)###\s*autoResize\?[\s\S]*?\n---\n/g, "$1");
    content = content.replace(/\n{3,}/g, "\n\n");

    writeFileSync(filePath, content, "utf8");
    console.log("Localized:", filePath);
}

walk(targetDir);
console.log("Localization complete.");
