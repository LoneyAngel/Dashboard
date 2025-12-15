import AddFrom from "@/ui/dashboard/invoices/addFrom";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '添加账单'
};
export default async function Page() {
    return (
        <div className="h-full relative pt-4 pl-4 font-inter">
            <AddFrom/>
        </div>
    )
}