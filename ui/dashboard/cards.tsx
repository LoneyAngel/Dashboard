import { getCardData } from "@/app/lib/data";
import Card from "../sma/card";

export default async function Cards() {
    const {
        numberOfCustomers,
        numberOfInvoices,
        totalPaidInvoices,
        totalPendingInvoices
    } = await getCardData();
    return (
        <div className="flex gap-[5%] justify-around font-karrik">
            <Card title="Collected" number={totalPaidInvoices} />
            <Card title="Pending" number={totalPendingInvoices} />
            <Card title="Total Invoices" number={numberOfInvoices} />
            <Card title="Total Customers" number={numberOfCustomers} />
        </div>
    )
}