const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "daily.log");
const now = Date.now();
const ONE_DAY = 24 * 60 * 60 * 1000;

const files = fs.readdirSync(logDir).filter((f) => f.endsWith(".log"));

files.forEach((f) => {
    const filePath = path.join(logDir, f);
    const stat = fs.statSync(filePath);
    if (now - stat.mtimeMs > ONE_DAY) {
        fs.unlinkSync(filePath);
    }
});
