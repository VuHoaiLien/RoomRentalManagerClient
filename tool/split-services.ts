import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//
// Cấu hình đầu vào/đầu ra
//
const inputFile = path.join(__dirname, "../src/app/shared/service-proxies.ts");
const outputDir = path.join(__dirname, "../src/app/shared/services");

//
// Tạo thư mục output nếu chưa có
//
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

//
// Đọc nội dung file service-proxies.ts
//
const content = fs.readFileSync(inputFile, "utf8");

//
// Regex: match mọi export class Xxx
//
const classRegex = /export class (\w+)[\s\S]*?(?=(?:export class|\Z))/g;

let match: RegExpExecArray | null;
const exports: string[] = [];

while ((match = classRegex.exec(content)) !== null) {
    const className = match[1];
    const classBody = match[0];
    let fileName = '';
    if(!className || className.trim() === 'ServiceProxy'){
        fileName = "service.proxies.ts";
    }
    else
    {
        fileName = className
        .replace(/Proxy$/, "")   // bỏ hậu tố Proxy cho ngắn gọn
        .replace(/Service$/, "") // nếu class đã kết thúc bằng Service
        .toLowerCase() + ".service.ts";
    }
    
    
    const filePath = path.join(outputDir, fileName);

    // Nội dung mỗi file service
    const finalContent = `/* Auto-generated from service-proxies.ts */\n\n${classBody}\n`;

    fs.writeFileSync(filePath, finalContent, "utf8");
    console.log(`✅ Created: ${filePath}`);

    exports.push(`export * from './${fileName.replace(".ts", "")}';`);
}

//
// Tạo index.ts để export tất cả
//
const indexFile = path.join(outputDir, "index.ts");
fs.writeFileSync(indexFile, exports.join("\n"), "utf8");
console.log(`✅ Created: ${indexFile}`);