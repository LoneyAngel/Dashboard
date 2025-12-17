import bcrypt from "bcryptjs";
import { ReadonlyURLSearchParams } from "next/dist/client/components/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
const SALT_ROUNDS = 10; // 盐度（或计算成本）。数字越大，安全性越高，但计算时间越长。
// 将美分转换成美元
export const formatCurrency = (amount: number):string => {
    return (amount / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
};

// 标准化时间的显示
export const formatDate = (isoDate: string,Separator:string = '.') :string=> {
    const date = new Date(isoDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需 +1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${Separator}${month}${Separator}${day}`;
}

// 通用的更新查询参数函数
export const updateQueryParams = (newParams: Record<string, string | number | null | undefined | boolean>, searchParams: ReadonlyURLSearchParams, pathname: string, router: AppRouterInstance,p?:any) => {
    try {
        const currentParams = new URLSearchParams(searchParams.toString());
        // 遍历新参数
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === ''|| value === false) {
                currentParams.delete(key); // 清除空值参数
            } else {
                currentParams.set(key, String(value)); // 更新或新增
            }
        });

        // 构建新 URL
        const queryString = currentParams.toString();
        const newPath = queryString ? `${pathname}?${queryString}` : pathname;
        if(p){
            router.push(newPath,{scroll:false});
            return;
        }
        router.replace(newPath);
    } catch (error) {
        console.error('Failed to update query parameters:', error);
        throw Error('Failed to update query parameters.');
    }
}

// 检查表单提交是否有错误
export const hasAnyError = (message:any) => {
  if (message._errors?.length) return true;
  for (const key in message) {
    if (key !== '_errors' && message[key as keyof typeof message]?._errors?.length) {
      return true;
    }
  }
  return false;
};


export async function hashPassword(plainPassword: string): Promise<string> {
      try {
          // 1. 生成一个随机的 Salt（盐）
          // Salt 是一个随机字符串，用于确保相同的密码每次生成不同的哈希值。
          const salt = await bcrypt.genSalt(SALT_ROUNDS); 

          // 2. 将密码和 Salt 结合进行哈希计算
          const hashedPassword = await bcrypt.hash(plainPassword, salt);
          
          // 3. 返回哈希值（通常包含 Salt 和 Cost Factor），准备存入数据库
          return hashedPassword; 
      } catch (error) {
          console.error('密码哈希失败:', error);
          throw new Error('无法处理密码');
      }
  }