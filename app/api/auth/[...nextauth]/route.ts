// app/api/auth/[...nextauth]/route.ts

// 导入你的 NextAuth 实例导出的处理程序
// 假设你的 NextAuth 文件导出了一个对象或处理器
import { handlers } from "@/auth"; 

// 导出 GET 和 POST 处理器
export const { GET, POST } = handlers; 
