import Pagination from "@/ui/small_ui/pagination";
import Search from "@/ui/small_ui/search";
import { CustomerListSkeleton, PaginationSkeleton } from "@/ui/skeleton";
import { Suspense } from "react";
import type { Metadata } from 'next';
import AddButton from "@/ui/small_ui/addButton";
import CustomerTable from "@/ui/dashboard/customer/table/table";
import { getPaginatedCustomerCount } from "@/app/lib/data";
import Filter from "@/ui/small_ui/filter";

export const metadata: Metadata = {
    title: 'Pron 账单',
};
export default async function Page(props:{
        searchParams?:Promise<{
            query?:string,
            page:string,
            name?: string,
            email?: string
        }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams?.query ||""
    const page = searchParams?.page || '1'
    // 从searchParams中提取筛选参数
    const filterParams: Record<string, string> = Object.fromEntries(
        Object.entries({
            name: searchParams?.name||'',
            email: searchParams?.email||''
        })
        // .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    ) as Record<string, string>;
    
    return (
        <div className="flex px-10 py-4 flex-col gap-10 relative">
            <div className="text-3xl py-4 font-zen">Customer</div>
            <div className="flex gap-2 items-center">
                <Search q={query} className="flex-1"/>
                <Filter className="" filterArray={["name","email"]}/>
                <AddButton href="/dashboard/customer/add"/>
            </div>
            <Suspense fallback={<CustomerListSkeleton />}>
                <CustomerTable page={page} query={query} filterParams={filterParams} />
            </Suspense>
            <div className="bottom-12">
                <Suspense fallback={<PaginationSkeleton/>}>
                    <Pagination page={page} query={query} filterParams={filterParams} getPaginatedCount={getPaginatedCustomerCount}/>
                </Suspense>
            </div>
        </div>
    )
}