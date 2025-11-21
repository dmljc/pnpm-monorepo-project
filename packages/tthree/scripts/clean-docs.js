import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const apiDir = join(process.cwd(), "docs/api");

// 模块文档文件列表
const moduleFiles = [
    "CameraController.md",
    "RenderEngine.md",
    "SceneManager.md",
    "ThreeApp.md",
];

function cleanModuleDoc(fileName) {
    const filePath = join(apiDir, fileName);
    let content = readFileSync(filePath, "utf-8");

    const moduleName = fileName.replace(".md", "");

    // 移除所有面包屑导航行
    content = content.replace(/^\[.*?\]\(README\.md\).*?\n/gm, "");
    content = content.replace(/^\*\*\*\n/gm, "");

    // 移除重复的标题（如果存在）
    const titleRegex = new RegExp(`^#+\\s*${moduleName}\\s*\\n+`, "gm");
    content = content.replace(titleRegex, "");

    // 确保 "Classes" 和 "Interfaces" 是二级标题
    content = content.replace(/^Classes\s*$/gm, "## Classes");
    content = content.replace(/^Interfaces\s*$/gm, "## Interfaces");

    // 如果文档开头没有 "## Classes" 或 "## Interfaces"，但直接有类定义，添加 "## Classes"
    if (!content.includes("## Classes") && !content.includes("## Interfaces")) {
        // 检查是否有类定义（通过 <a id="..."></a> 模式）
        if (content.match(/<a id="[^"]+"><\/a>/)) {
            // 在第一个类定义前插入 "## Classes"
            content = content.replace(
                /(<a id="[^"]+"><\/a>)/,
                "## Classes\n\n$1",
            );
        }
    }

    // 修复类名标题（确保类名有三级标题）
    // 匹配 <a id="classname"></a> 后面跟着类名的情况
    content = content.replace(
        /<a id="([^"]+)"><\/a>\n\n([A-Z][a-zA-Z]+)/g,
        '<a id="$1"></a>\n\n### $2',
    );

    // 移除开头的多余空行
    content = content.replace(/^\n+/, "");

    // 确保标题在开头，格式为 # ModuleName
    if (!content.startsWith(`# ${moduleName}`)) {
        // 移除任何现有的标题
        content = content.replace(/^#+\s*.*?\n+/, "");
        // 添加正确的标题
        content = `# ${moduleName}\n\n${content}`;
    } else {
        // 确保标题格式正确（只有一个 #）
        content = content.replace(/^#+\s*/, `# ${moduleName}\n\n`);
    }

    // 移除文档中对 README.md 的引用（保留其他链接）
    content = content.replace(/\[([^\]]+)\]\(README\.md\)/g, "$1");

    // 清理多余的空行（连续3个或更多空行替换为2个）
    content = content.replace(/\n{3,}/g, "\n\n");

    // 确保文件末尾有一个空行
    content = content.replace(/\n+$/, "\n");

    writeFileSync(filePath, content, "utf-8");
    console.log(`✓ Cleaned ${fileName}`);
}

// 清理所有模块文档
moduleFiles.forEach((file) => {
    try {
        cleanModuleDoc(file);
    } catch (error) {
        console.error(`Error cleaning ${file}:`, error.message);
    }
});

console.log("Documentation cleaning completed!");
