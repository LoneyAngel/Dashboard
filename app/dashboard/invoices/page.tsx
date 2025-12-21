import InvoicesTable from "@/ui/dashboard/invoices/table/table";
import Search from "@/ui/small_ui/search";
import { InvoiceListSkeleton, PaginationSkeleton } from "@/ui/skeleton";
import { Suspense } from "react";
import type { Metadata } from 'next';
import AddButton from "@/ui/small_ui/addButton";
import Pagination from "@/ui/small_ui/pagination";
import Filter from "@/ui/small_ui/filter";
import { getPaginatedInvoiceCount } from "@/app/lib/data";

export const metadata: Metadata = {
    title: 'Pron 账单',
};
export default async function Page(props:{
        searchParams?:Promise<{
            query?:string,
            page:string,
            customer_id?: string,
            amount?: string,
            status?: string,
            date?: string
        }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams?.query ||""
    const page = searchParams?.page || '1'
    // 从searchParams中提取筛选参数
    const filterParams: Record<string, string> = Object.fromEntries(
        Object.entries({
            customer_id: searchParams?.customer_id||'',
            amount: searchParams?.amount||'',
            status: searchParams?.status||'',
            date: searchParams?.date||''
        })
    ) as Record<string, string>;
    
    return (
        <div className="flex px-10 py-4 flex-col gap-10 relative">
            <div className="text-3xl py-4 font-zen">Invoices</div>
            <div className="flex gap-2 items-center">
                <Search q={query} className="flex-1"/>
                <Filter className="" filterArray={["customer_id","amount","status","date"]} />
                <AddButton href="/dashboard/invoices/add"/>
            </div>
            <Suspense fallback={<InvoiceListSkeleton />}>
                <InvoicesTable page={page} query={query} filterParams={filterParams} />
            </Suspense>
            <div className="bottom-12">
                <Suspense fallback={<PaginationSkeleton/>}>
                    <Pagination page={page} query={query} filterParams={filterParams} getPaginatedCount={getPaginatedInvoiceCount}/>
                </Suspense>
            </div>
        </div>
    )
}