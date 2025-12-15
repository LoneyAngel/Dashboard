/**
 * 根据url参数，query，page，获取数据，渲染表格
 * 现在有一个问题，对于searchParams为空的情况
 */
import { getPaginatedCustomer } from "@/app/lib/data"
import Table from "./table.client";

export default async function CustomerTable({query,page,filterParams}:{
    query:string,
    page:string,
    filterParams?: Record<string, string>
}) {
    const tableData = await getPaginatedCustomer({ query, page, filterParams });
    return (
        <div >
            <Table data={tableData}/>
        </div>
    )
}