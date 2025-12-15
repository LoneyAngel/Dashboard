import EditFrom from "@/ui/dashboard/customer/editFrom";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '正在修改账单',
};
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    return (
        <div className="h-full relative pt-4 font-inter px-[15%]">
            <EditFrom params={params}/>
        </div>
    )
}