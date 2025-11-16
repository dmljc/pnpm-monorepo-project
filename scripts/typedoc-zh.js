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
    ["Defined in:", "定义于："],
    ["Defined in", "定义于"],
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

function localizeFile(path) {
    let content = readFileSync(path, "utf8");
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
    content = content.replaceAll("Defined in:", "定义于：");
    content = content.replaceAll("Defined in", "定义于");

    // 仅针对 tthree 概览页做定制化（幂等、精准）
    if (
        path.endsWith("/tthree/README.md") ||
        path.endsWith("\\tthree\\README.md")
    ) {
        // 移除页首版本横幅：**项目 vX.Y.Z** + ---
        content = content.replace(
            /^\s*\*\*[^*]*?v\d+(?:\.\d+){1,2}\*\*\s*\n\s*---\s*\n?/i,
            "",
        );

        // 标题统一为无空格版本
        content = content.replace(/^##\s*类\s*$/m, "## ThreeBase基类");
        content = content.replace(/^##\s*接口\s*$/m, "## ThreeBase基类参数");
        content = content.replace(
            /^##\s*ThreeBase\s*基类\s*$/m,
            "## ThreeBase基类",
        );
        content = content.replace(
            /^##\s*ThreeBase\s*基类参数\s*$/m,
            "## ThreeBase基类参数",
        );

        // 链接统一为无空格目录
        content = content.replace(
            /\((?:\.\/)?(?:classes|类)\/ThreeBase\.md\)/g,
            "(ThreeBase基类/ThreeBase.md)",
        );
        content = content.replace(
            /\((?:\.\/)?(?:interfaces|接口)\/Params\.md\)/g,
            "(ThreeBase基类参数/Params.md)",
        );
        content = content.replace(
            /\((?:\.\/)?(?:interfaces|接口)\/CameraFitConfig\.md\)/g,
            "(ThreeBase基类参数/CameraFitConfig.md)",
        );

        // 可选：移除“函数”分组（若 TypeDoc 输出异常保留）
        content = content.replace(/(^|\n)##\s*函数[\s\S]*?(?=\n##\s|$)/g, "$1");
        content = content.replace(
            /(^|\n)##\s*Functions[\s\S]*?(?=\n##\s|$)/g,
            "$1",
        );
    }

    writeFileSync(path, content, "utf8");
    console.log("Localized:", path);
}

walk(targetDir);
console.log("Localization complete.");
