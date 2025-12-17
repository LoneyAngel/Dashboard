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

export type User ={
    name: string
    email: string
    password: string
}