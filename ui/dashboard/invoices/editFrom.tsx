import { getInvoiceById, getInvoiceCustom_id } from "@/app/lib/data";
import EditfromInteractive from "./editFrom.client";

export default async function Editfrom({id}:{id:string}) {
    const Array = await getInvoiceCustom_id();
    const invoice = await getInvoiceById(id);
    return (
        <div className="h-full">
            <EditfromInteractive invoice={invoice} idArray={Array}/>
        </div>
    )
}