// 和search一起决定invoices显示的内容
// 完善页码逻辑
// 记住这个组件负责url中的page参数的设置
"use client"
import clsx from 'clsx';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { updateQueryParams} from '../../app/lib/utils';
export default function PaginationInteractive({pagination,page}:{pagination:string[],page:string}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    return (
        <div className="flex justify-start pl-16 gap-6 font-inter h-full">
            {
                pagination.map((i,index) => {
                    return (
                        <button onClick={()=>{
                            updateQueryParams({page:i},searchParams,pathname,router)
                        }
                        } disabled={i==="..."} key={i === "..." ? index : i} 
                            className={
                                clsx("rounded-md select-none bg-bg px-2 duration-200 aspect-square",
                                    Number(i)===Number(page)?"bg-gray-200 translate-y-[-8px] scale-105 hover:bg-gray-300":"hover:bg-gray-200 hover:translate-y-[-4px]")} >
                            {i}
                        </button>
                    )
                })
            }
        </div>
    )
}