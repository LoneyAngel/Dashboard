// 编辑页面分出来的edit_from组件
import { getCustomerById } from "@/app/lib/data";
import EditFromInteractive from "./editFrom.client";

export default async function EditFrom({params}:{params:Promise<{id:string}>}) {
    const {id} = await params;
    const customer = await getCustomerById(id);
    return (
        <div className="h-full">
            <EditFromInteractive customer = {customer}/>
        </div>
    )
}