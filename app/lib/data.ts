// 读取操作不使用server
// 在服务器组件中直接调用的函数放在data.ts中
// 在客户端组件中调用的函数放在action.ts中，因为实在客户端调用的服务器操作
"use server"
import postgres from 'postgres';
import { formatCurrency, formatDate } from './utils';
// import type { Invoice, LatestInvoice, revenue } from './definition';
import z from 'zod';
import { Customer, revenue } from './definition';
import { unstable_cache } from 'next/cache';
//如果数据获取失败怎么处理

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const latestInvoiceSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    image_url: z.string(),
    amount: z.string()
});
const invoiceSchema = z.object({
    id: z.string(),
    customer_id: z.string(),
    amount: z.string(),
    date: z.string(),
    status: z.enum(['pending', 'paid'])
});
type Invoice = z.infer<typeof invoiceSchema>;
type latestInvoice = z.infer<typeof latestInvoiceSchema>;
// 获取dashboard页的最上方四个卡片的数据
export const getCardData = unstable_cache(
    async () =>{
        try {
            const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
            const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
            const invoiceStatusPromise = sql`SELECT
            SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
            SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
            FROM invoices`;

            const data = await Promise.all([
                invoiceCountPromise,
                customerCountPromise,
                invoiceStatusPromise,
            ]);
            const numberOfInvoices = data[0][0].count ?? '0';
            const numberOfCustomers = data[1][0].count ?? '0';
            const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
            const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');
            return {
                numberOfCustomers,
                numberOfInvoices,
                totalPaidInvoices,
                totalPendingInvoices,
            };
        } catch (error) {
            console.error('Database Error:', error);
            throw new Error('Failed to fetch card data.');
        }
    }, 
    ['invoices'] ,
    { revalidate: 3000 }
)

export const initChartData =unstable_cache(
    async () : Promise<revenue[]>=>{
        try {
            const result = await sql`
            SELECT * FROM revenue
            `
            // console.log("initChartData获取数据如下：")
            // console.log(result)
            return result.map(row => ({
                month: row.month as string,
                revenue: row.revenue as string
            }))
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch picture data.');
        }
    },
    ['revenue'] ,
    { revalidate: 3000 }
) 

// 获取最近四条发票数据
export async function getLastInvoices(): Promise<latestInvoice[]> {
    try {
        const invoices = await sql`
        SELECT * FROM invoices ORDER BY date DESC LIMIT 4
        `
        // console.log("getlastInvoice 获取invoices如下")
        // console.log(invoices)
        const result = await Promise.all(
            invoices.map(async (item) => {
                const j = await sql`
                    SELECT * FROM customers where id = ${item.customer_id}
                    `
                // console.log("getlastInvoice 获取customer如下")
                // console.log(j[0])
                return {
                    id: item.id,
                    name: j[0].name,
                    email: j[0].email,
                    image_url: j[0].image_url,
                    amount: formatCurrency(item.amount)
                }
            })
        )
        // console.log("getlastInvoice 获取result如下")
        // console.log(result)
        return result
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch last invoices.');
    }
}

// 返回检索分页后的数据
// query:匹配字符串，page：目标页面
export async function getPaginatedInvoices({ query, page, filterParams }: { query: string, page: string, filterParams: Record<string, string|undefined> }): Promise<Invoice[]> {
    try {
        const offset = (Number(page) - 1) * 6
        let result;
        if (!query || query.trim() === "") {
            result = await sql`
                SELECT * FROM invoices
                ORDER BY id DESC
                LIMIT 6 OFFSET ${offset};`
        } else {

            // 构建WHERE子句
            const conditions = [];
            const values = [];
            
            // 处理搜索查询 - 根据filterParams中存在且不为空的字段进行模糊搜索
            if (query && query.trim() !== "") {
                const pattern = `%${query.trim()}%`;
                // 构建基于filterParams中存在字段的模糊搜索条件
                const filterConditions = [];
                // filterArray中的字段包括：customer_id, amount, status, date
                if (filterParams["customer_id"]) {
                    filterConditions.push(`customer_id::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                if (filterParams["amount"]) {
                    filterConditions.push(`amount::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                if (filterParams["status"]) {
                    filterConditions.push(`status ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                if (filterParams["date"]) {
                    filterConditions.push(`date::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                
                if (filterConditions.length > 0) {
                    conditions.push(`(${filterConditions.join(' OR ')})`);
                }
            }
            
            // 构建WHERE子句
            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            
            // 构建最终查询
            if (whereClause) {
                // 使用模板字符串构建查询，因为postgres.js不支持动态列名
                const queryStr = `
                    SELECT * FROM invoices
                    ${whereClause}
                    ORDER BY id DESC
                    LIMIT 6 OFFSET ${offset};
                `;
                console.log("getPaginatedInvoices 获取queryStr如下")
                console.log(queryStr)
                // 构建参数数组
                const queryParams = [...values];
                
                // 执行查询
                result = await sql.unsafe(queryStr, queryParams);
            } else {
                result = await sql`
                    SELECT * FROM invoices
                    ORDER BY id DESC
                    LIMIT 6 OFFSET ${offset};
                `;
            }
        }
        // console.log("getPaginatedInvoices 获取invoices如下")
        // console.log(result)
        const newResult = result.map(
            (item) => {
                return {
                    id: item.id as string,
                    customer_id: item.customer_id as string,
                    amount: formatCurrency(item.amount),
                    date: formatDate(item.date) as string,
                    status: item.status as 'pending' | 'paid'
                }

            }
        )
        // console.log(newResult)
        // revalidatePath('/dashboard/invoices')
        return newResult
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch invoices.');
    }

}

// 获取分页后的页数总数
export async function getPaginatedInvoiceCount({ query, filterParams }: { query: string, filterParams?: Record<string, string> }): Promise<number> {
    try {
        if ((!query || query.trim() === "") && (!filterParams || Object.keys(filterParams).length === 0)) {
            const result = await sql`SELECT * FROM invoices;`
            return result.length
        } else {
            // 构建WHERE子句
            const conditions = [];
            const values = [];
            
            // 处理搜索查询 - 根据filterParams中存在且不为空的字段进行模糊搜索
            if (query && query.trim() !== "") {
                const pattern = `%${query.trim()}%`;
                // 构建基于filterParams中存在字段的模糊搜索条件
                const filterConditions = [];
                // filterArray中的字段包括：customer_id, amount, status, date
                if (!filterParams || filterParams.customer_id !== undefined) {
                    filterConditions.push(`customer_id::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                if (!filterParams || filterParams.amount !== undefined) {
                    filterConditions.push(`amount::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                if (!filterParams || filterParams.status !== undefined) {
                    filterConditions.push(`status ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                if (!filterParams || filterParams.date !== undefined) {
                    filterConditions.push(`date::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                
                if (filterConditions.length > 0) {
                    conditions.push(`(${filterConditions.join(' OR ')})`);
                }
            }
            
            // 构建WHERE子句
            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            
            // 构建最终查询
            if (whereClause) {
                // 使用模板字符串构建查询，因为postgres.js不支持动态列名
                const queryStr = `
                    SELECT * FROM invoices
                    ${whereClause};
                `;
                
                // 构建参数数组
                const queryParams = [...values];
                
                // 执行查询
                const result = await sql.unsafe(queryStr, queryParams);
                return result.length;
            } else {
                const result = await sql`
                    SELECT * FROM invoices;
                `;
                return result.length;
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch invoices.');
    }

}
export async function getInvoiceCustom_id(): Promise<string[]> {
    try {
        const result = await sql`
        select DISTINCT customer_id from invoices
        `
        // console.log("getInvoiceCustom_id 获取数据如下：")
        // console.log(result)
        return result.map(row => row.customer_id as string);
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch invoice by id.');
    }
}


export async function getInvoiceById(id: string): Promise<Invoice> {
    // unstable_noStore();
    try {
        const result = await sql`
        SELECT * FROM invoices WHERE id = ${id} 
        `
        // console.log("getInvoiceById 获取数据如下：")
        // console.log(result)
        return result[0] as Invoice;
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch invoice by id.');
    }
}


// ***************************************************************************************************************
export async function getPaginatedCustomer({ query, page, filterParams }: { query: string, page: string, filterParams?: Record<string, string> }): Promise<Customer[]> {
    try {
        const offset = (Number(page) - 1) * 6
        let result;
        if (!query || query.trim() === "") {
            result = await sql`
                SELECT * FROM customers
                ORDER BY id DESC
                LIMIT 6 OFFSET ${offset};`
        } else {
            // 构建WHERE子句
            const conditions = [];
            const values = [];
            
            // 处理搜索查询 - 根据filterParams中存在且不为空的字段进行模糊搜索
            if (query && query.trim() !== "") {
                const pattern = `%${query.trim()}%`;
                // 构建基于filterParams中存在字段的模糊搜索条件
                const filterConditions = [];
                
                if (!filterParams || filterParams.name !== undefined) {
                    filterConditions.push(`name::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                if (!filterParams || filterParams.email !== undefined) {
                    filterConditions.push(`email::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                
                if (filterConditions.length > 0) {
                    conditions.push(`(${filterConditions.join(' OR ')})`);
                }
            }
            
            // 构建WHERE子句
            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            
            // 构建最终查询
            if (whereClause) {
                // 使用模板字符串构建查询，因为postgres.js不支持动态列名
                const queryStr = `
                    SELECT * FROM customers
                    ${whereClause}
                    ORDER BY id DESC
                    LIMIT 6 OFFSET ${offset};
                `;
                
                // 构建参数数组
                const queryParams = [...values];
                
                // 执行查询
                result = await sql.unsafe(queryStr, queryParams);
            } else {
                result = await sql`
                    SELECT * FROM customers
                    ORDER BY id DESC
                    LIMIT 6 OFFSET ${offset};
                `;
            }
        }
        // console.log("getPaginatedCustomer 获取customers如下")
        // console.log(result)
        const newResult = result.map(
            (item) => {
                return {
                    id: item.id as string,
                    name: item.name as string,
                    email: item.email as string,
                    image_url: item.image_url as string
                }
            }
        )
        // console.log(newResult)
        return newResult
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch customers.');
    }

}

// 获取分页后的页数总数
export async function getPaginatedCustomerCount({ query, filterParams }: { query: string, filterParams?: Record<string, string> }): Promise<number> {
    try {
        if ((!query || query.trim() === "") && (!filterParams || Object.keys(filterParams).length === 0)) {
            const result = await sql`SELECT * FROM customers;`
            return result.length
        } else {
            // 构建WHERE子句
            const conditions = [];
            const values = [];
            
            // 处理搜索查询 - 根据filterParams中存在且不为空的字段进行模糊搜索
            if (query && query.trim() !== "") {
                const pattern = `%${query.trim()}%`;
                // 构建基于filterParams中存在字段的模糊搜索条件
                const filterConditions = [];
                
                if (!filterParams || filterParams.name !== undefined) {
                    filterConditions.push(`name::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                if (!filterParams || filterParams.email !== undefined) {
                    filterConditions.push(`email::text ILIKE $${values.length + 1}`);
                    values.push(pattern);
                }
                
                if (filterConditions.length > 0) {
                    conditions.push(`(${filterConditions.join(' OR ')})`);
                }
            }
            
            // 构建WHERE子句
            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            
            // 构建最终查询
            if (whereClause) {
                // 使用模板字符串构建查询，因为postgres.js不支持动态列名
                const queryStr = `
                    SELECT * FROM customers
                    ${whereClause};
                `;
                
                // 构建参数数组
                const queryParams = [...values];
                
                // 执行查询
                const result = await sql.unsafe(queryStr, queryParams);
                return result.length;
            } else {
                const result = await sql`
                    SELECT * FROM customers;
                `;
                return result.length;
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch customers count.');
    }

}

export async function getCustomerById(id: string): Promise<Customer> {
    // unstable_noStore();
    try {
        const result = await sql`
        SELECT * FROM customers WHERE id = ${id} 
        `
        // console.log("getCustomerById 获取数据如下：")
        // console.log(result)
        return result[0] as Customer;
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch customer by id.');
    }
}


export async function getOldImageUrl(id: string): Promise<string | undefined> {
    const result = await sql`SELECT image_url FROM customers WHERE id = ${id}`;
    return result[0]?.image_url;
}

export async function getUserEmail(email: string): Promise<string | undefined> {
    try {
        const result = await sql`SELECT email FROM users WHERE email = ${email}`;
        return result[0].email;
    } catch (error) {
        console.error(error)
        return undefined;
    }
}

// export async function createUser(email: string,password:string,name:string): Promise<void> {
//     const result = await sql`
//         INSERT INTO users (email,password,name)
//         VALUES (${email}, ${password},${name})
//     `;
// }
