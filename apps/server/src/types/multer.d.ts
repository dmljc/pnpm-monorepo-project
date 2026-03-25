// 强制引入 multer 的类型声明，确保 @types/multer 的全局扩展
// `Express.Multer.File` 在 server 编译上下文中可见。
import "multer";

export {};
