import { getPaginatedCustomerCount, getPaginatedInvoiceCount } from '@/app/lib/data';
import PaginationInteractive from './pagination.client';
export default async function Pagination({page,query,filterParams,getPaginatedCount}:{page:string,query:string,filterParams?:Record<string, string>,getPaginatedCount:any}) {
    async function generatePaginationArray(current:number): Promise<string[]>{
        // console.log(`当前页码：${current}，总页码：${totalPages}`);
        // 获取页数
        const _ = await getPaginatedCount({ query, filterParams })
        const totalPages = Math.ceil(_ / 6);
        // 返回页数数组
        if(totalPages<=1) return [];
        if(totalPages<=6){
            return Array.from({length:totalPages},(_,i)=>i+1).map(String)//暂时没有看懂
        }
        if(current===1){
            return [1,2,3,"...",totalPages].map(String)
        }else if(current===totalPages){
            return [1,"...",totalPages-2,totalPages-1,totalPages].map(String)
        }else {
            return [1,"...",current-1,current,current+1,"...",totalPages].map(String)
        }
    }
    const pagination = await generatePaginationArray(Number(page))

    return (
        <div className="h-full">
            <PaginationInteractive page={page} pagination={pagination}/>
        </div>
    )
}