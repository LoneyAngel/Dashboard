// invoice编辑页面
import { getInvoiceCustom_id } from "@/app/lib/data";
import AddFromInterative from "./addFrom.client";

export default async function AddFrom() {
    const Array = await getInvoiceCustom_id();
    return (
        <div className="h-full">
            <AddFromInterative idArray={Array}/>
        </div>
    )
}