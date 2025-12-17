"use server"
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { CustomerData, FormState, Invoice, User } from './definition';
import { unlink, writeFile } from "fs/promises";
import { join, extname } from "path";
import { randomBytes } from "crypto";
import { getOldImageUrl } from './data';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { hashPassword } from './utils';

const f = process.env.IMAGE_CUSTOMER_PATH!;
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const CustomerSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "姓名不能为空"),
    email: z.email("请输入有效的邮箱地址"),
    avatar: z
        .instanceof(File)
        .refine((file) => file.size > 0, "文件不能为空")
        .refine((file) => file.size <= 5 * 1024 * 1024, "文件大小不能超过 5MB")
        .optional(),
});

const AddCustomerSchema = z.object({
    name: z.string().min(1, "姓名不能为空"),
    email: z.email("请输入有效的邮箱地址"),
    avatar: z
        .instanceof(File)
        .refine((file) => file.size > 0, "文件不能为空")
        .refine((file) => file.size <= 5 * 1024 * 1024, "文件大小不能超过 5MB")
})

const InvoiceSchema = z.object({
  id: z.string(),
  customer_id: z.string().min(1, "客户 ID 不能为空"),
  amount: z.number().min(1, "金额不能小于1"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式应为 YYYY-MM-DD"),
  status: z.enum(['pending', 'paid'], { message: "状态只能是 pending 或 paid" }),
});

const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .trim(),
})

const AddInvoiceSchema = InvoiceSchema.omit({id:true});

/**
 * 根据ID更新发票信息
 * @param prevState - 表单的前一个状态，包含成功标志和消息
 * @param fromdata - 包含发票信息的FormData对象
 * @returns 更新操作的结果状态
 */
export async function updateInvoiceById(prevState:FormState<Invoice>,fromdata : FormData) {
    try {
        const s = InvoiceSchema.safeParse({
            id: fromdata.get('id'),
            customer_id: fromdata.get('customer_id'),
            amount: Number(fromdata.get('amount')),
            date: fromdata.get('date'),
            status: fromdata.get('status')
        });
        // console.log("updateInvoiceById执行结果如下：")
        // console.log(s.error?.format())
        if (!s.success) {
            return {
                success: false,
                message: s.error.format()
            }
        }
        const {customer_id,amount,date,status,id} = s.data;
        
        const result = await sql`
            UPDATE invoices SET customer_id = ${customer_id}, amount = ${amount}, date = ${date}, status = ${status} WHERE id = ${id}
        `;
        // console.log("updateInvoiceById执行结果如下：")
        // console.log(result)
        revalidatePath('/dashboard/invoices');
        return {
            success:true,
            message:{}
        }
    } catch (error) {
        console.error(error)
        return {
            success:false,
            message: {_errors:[error instanceof Error ? error.message : "未知错误"]}
        }
    }
}

export async function deleteInvoicesById(prevState:{success:boolean,message:string},formdata: FormData) {
    try {
        const id = formdata.get('id') as string;
        const result = await sql`
        delete from invoices where id = ${id}
        `
        revalidatePath('/dashboard/invoices');
        return {
            success:true,
            message:""
        }
    } catch (error) {
        console.error(error)
        return {
            success:false,
            message:error instanceof Error ? error.message : "未知错误"  
        }
    }
}

export async function addInvoice(prevState:FormState<Invoice>,fromdata : FormData) {
    try {
        const s = AddInvoiceSchema.safeParse({
            customer_id: fromdata.get('customer_id'),
            amount: Number(fromdata.get('amount')),
            date: fromdata.get('date'),
            status: fromdata.get('status')
        });
        if (!s.success) {
            return {
                success: false,
                message: s.error.format(),
            }
        }
        const {customer_id,amount,date,status} = s.data;
        const result = await sql`
            INSERT INTO invoices (customer_id, amount, date, status)
            VALUES (${customer_id}, ${amount}, ${date}, ${status})
        `;
        revalidatePath('/dashboard/invoices');
        return {
            success:true,
            message:{}
        }
    } catch (error) {
        console.error(error)
        return {
            success:false,
            message:{_errors:[error instanceof Error ? error.message : "未知错误"]}   
        }
    }
}

// Customers 相关操作
export async function updateCustomerById(prevState: FormState<CustomerData>, formData: FormData) {
    try {
        if (!f) {
            return { success: false, message: { _errors: ["服务器出错，请联系管理员"] } };
        }
        const rawAvatar = formData.get('avatar');
        const avatar = 
            rawAvatar instanceof File && rawAvatar.size > 0 
            ? rawAvatar 
            : undefined;
        const s = CustomerSchema.safeParse({
            id: formData.get('id'),
            name: formData.get('name'),
            email: formData.get('email'),
            avatar
        });

        if (!s.success) {
            return {
                success: false,
                message: s.error.format()
            };
        }

        const { id, name, email} = s.data;
        let avatarUrl = undefined;
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

        // 只有当avatar存在且有效时才处理上传逻辑
        if (avatar && avatar.size > 0) {
            const oldUrl = await getOldImageUrl(id)
            // 文件后缀
            const ext = extname(avatar.name).toLowerCase();
            const filename = `${randomBytes(16).toString("hex")}${ext}`;
            const filePath = join(process.cwd(), "public", "customers", filename);

            const bytes = await avatar.arrayBuffer();
            await writeFile(filePath, Buffer.from(bytes));
            avatarUrl = `${f}/${filename}`;
            if (!allowedTypes.includes(avatar.type)) {
                throw new Error("仅支持 JPG/PNG/GIF 格式");
            }
            // 更新客户信息，包含头像   
            const result = await sql`
                UPDATE customers SET name = ${name}, email = ${email}, image_url = ${avatarUrl} WHERE id = ${id}
            `;
            // 更新成功后尝试删除旧文件
            if (oldUrl && oldUrl.startsWith(f)) {
                // 提取文件名 (例如：/customers/filename.jpg -> filename.jpg)
                const oldFilename = oldUrl.substring(f.length); 
                const oldFilePath = join(process.cwd(), "public", "customers", oldFilename);
                try {
                    // 使用 unlink 删除旧文件
                    await unlink(oldFilePath); 
                } catch (unlinkError) {
                    // 文件可能不存在，忽略错误
                    console.warn(`Could not delete old file: ${oldFilePath}`, unlinkError);
                }
            }
            
        } else {
            // 更新客户信息，不包含头像
            const result = await sql`
                UPDATE customers SET name = ${name}, email = ${email} WHERE id = ${id}
            `;
        }

        revalidatePath('/dashboard/customer');
        return {
            success: true,
            message: {}
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: { _errors: [error instanceof Error ? error.message : "未知错误"] }
        };
    }
}

export async function deleteCustomerById(prevState: { success: boolean, message: string }, formData: FormData) {
    try {
        const id = formData.get('id') as string;
        const result = await sql`
            DELETE FROM customers WHERE id = ${id} RETURNING 1
        `;
        revalidatePath('/dashboard/customer');
        return {
            success: true,
            message: ""
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "未知错误"
        }
    }
}
// 添加新用户
export async function addCustomer(prevState: FormState<CustomerData>,formData: FormData) {
    try {
        if(!f){
            return {success:false,message:{_errors:["服务器出错，请联系管理员"]}}
        }
        const s = AddCustomerSchema.safeParse({
            name: formData.get('name'),
            email: formData.get('email'),
            avatar: formData.get('avatar')
        });
        if (!s.success) {
            return {
                success: false,
                message: s.error.format()
            }
        }
        const {name,email,avatar} = s.data
        let avatarUrl = "";
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(avatar.type)) {
            throw new Error("仅支持 JPG/PNG/GIF 格式")
        }

        // 文件后缀
        const ext = extname(avatar.name).toLowerCase();
        const filename = `${randomBytes(16).toString("hex")}${ext}`;
        const filePath = join(process.cwd(), "public", "customers", filename);

        const bytes = await avatar.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));
        avatarUrl = `${f}/${filename}`;

        // 执行数据库操作
        const result = await sql`
        INSERT INTO customers (name, email, image_url) VALUES (${name}, ${email}, ${avatarUrl})
        `;
        revalidatePath('/dashboard/customer');
        return {
            success: true,
            message: {}
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: { _errors: [error instanceof Error ? error.message : "未知错误"] }
        };
    }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
export async function handleGoogleLogin(redirectTo: string) {
    signIn('google', { redirectTo}); // NextAuth 会自动重定向到 Google 授权页面
}

export async function createUser(prevState: FormState<User>, formData: FormData) {
    try {
        const s = SignupFormSchema.safeParse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
        });
        if (!s.success) {
            return {
                success: false,
                message: s.error.format()
            }
        }
        const { email, password, name } = s.data;
        const passwordsMatch = await hashPassword(password);
        const result = await sql`
            INSERT INTO users (email,password,name)
            VALUES (${email}, ${passwordsMatch},${name})
        `;
        return {
            success: true,
            message: {}
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: { _errors: [error instanceof Error ? error.message : "未知错误"] }
        };
    }
}

