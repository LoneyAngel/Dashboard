import LastInvoices from "@/ui/dashboard/lastInvoices";
import { Suspense } from "react";
import { BarChart_Skeleton, Cards_Skeleton, LastInvoices_Skeleton } from "@/ui/skeleton";
import Cards from "@/ui/dashboard/cards";
import BarChart from "@/ui/dashboard/chart";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pron Dashboard',
};
export default async function Page() {
    return (
        <div className="flex h-full flex-col px-10 gap-2">
            <div className="text-3xl py-4 font-zen">Dashboard</div>
            <Suspense fallback={<Cards_Skeleton />}>
                <Cards />
            </Suspense>
            <div className="flex flex-1 mt-4 gap-4">
                <div className="flex flex-col flex-1">
                    <header className="text-3xl mb-8 font-zen">Recent Revenue</header>
                    <div className="flex flex-1 items-center justify-center">
                        <Suspense fallback={<BarChart_Skeleton />}>
                            <BarChart />
                        </Suspense>
                    </div>
                </div>
                <div className="flex-1">
                    <header className="text-3xl mb-8 font-zen">Latest Invoices</header>
                    <Suspense fallback={<LastInvoices_Skeleton />}>
                        <LastInvoices />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}