import { getLastInvoices } from "@/app/lib/data"
import Image from 'next/image';
import { Separator } from "@/components/ui/separator"
export default async function LastInvoices() {
    const lastInvoices = await getLastInvoices()
    return (
        <div className="flex flex-col overflow-auto h-[400px] border-blue-50 border-[15px] rounded-3xl gap-4 p-4 ">
            {
                lastInvoices.map((invoice) => {
                    return (
                        <div key={invoice.id} className="flex-1">
                            <div key={`${invoice.id}_1`} className="flex flex-1 pl-6 pr-10 items-center justify-between relative">
                                <div className="flex gap-8 items-center font-inter">
                                    <Image src={invoice.image_url} alt="user_imaege" width={32} height={32} className="w-[32px] h-[32px] rounded-full" />
                                    {/* 宽度和高度最好进行显示的设置，属性设置的不太管用 */}
                                    <div className="flex flex-col justify-between">
                                        <div className="text-xl font-inter font-[700]">{invoice.name}</div>
                                        <div className="text-sm">{invoice.email}</div>
                                    </div>
                                </div>
                                <div className="text-base font-serif">{invoice.amount}</div>
                            </div>
                            <Separator className="my-2"/>
                        </div>
                    )
                }
                )
            }
        </div>
    )
}