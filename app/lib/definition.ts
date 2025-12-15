// 除特殊的数据类型外，使用string作为数据类型
import { type ZodFormattedError } from 'zod';

// 定义表单字段结构
export type Customer = {
    id: string;
    name: string;
    email: string;
    image_url: string;
};

export type Invoice = {
    id: string;
    customer_id: string;
    amount: string;
    date: string;
    status: 'pending' | 'paid';
};
export type LatestInvoice = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    amount: string;
}
export type revenue = {
    month: string;
    revenue: string;
}

// 用户数据
export type CustomerData = {
    name: string;
    email: string;
    image_url: string;
}

// 表单状态模板
export type FormState<T> = {
  success: boolean;
  message: ZodFormattedError<T> | { _errors?: string[] };
};



import * as z from 'zod'
 
export const SignupFormSchema = z.object({
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
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
})
 
export type User =
|{
    errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    }
    message?: string
}
| undefined