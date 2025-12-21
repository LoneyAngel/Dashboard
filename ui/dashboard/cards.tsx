import { getCardData } from "@/app/lib/data";
import Card from "../small_ui/card";

export default async function Cards() {
    const {
        numberOfCustomers,
        numberOfInvoices,
        totalPaidInvoices,
        totalPendingInvoices
    } = await getCardData();
    return (
        <div className="grid grid-cols-4 gap-14 font-karrik">
            <Card title="Collected" number={totalPaidInvoices} />
            <Card title="Pending" number={totalPendingInvoices} />
            <Card title="Total Invoices" number={numberOfInvoices} />
            <Card title="Total Customers" number={numberOfCustomers} />
        </div>
    )
}