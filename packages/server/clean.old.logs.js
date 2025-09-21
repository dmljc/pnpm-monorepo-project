const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "daily.log");
const now = Date.now();
const ONE_DAY = 24 * 60 * 60 * 1000;

// 检查日志目录是否存在
if (!fs.existsSync(logDir)) {
    console.log("日志目录不存在，跳过清理");
    process.exit(0);
}

try {
    const files = fs.readdirSync(logDir).filter((f) => f.endsWith(".log"));

    files.forEach((f) => {
        const filePath = path.join(logDir, f);
        const stat = fs.statSync(filePath);
        if (now - stat.mtimeMs > ONE_DAY) {
            fs.unlinkSync(filePath);
            console.log(`已删除过期日志文件: ${f}`);
        }
    });

    console.log("日志清理完成");
} catch (error) {
    console.error("清理日志时出错:", error.message);
    process.exit(1);
}
