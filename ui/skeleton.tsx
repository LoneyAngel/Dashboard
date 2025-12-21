import { Separator } from "@/components/ui/separator"

// 完成部分组件的骨架搭建
export function Cards_Skeleton() {
    return (
        <div className="flex gap-[5%] justify-around font-karrik">
            {[1, 2, 3, 4].map((i) => (
                <div 
                    key={i} 
                    className="flex flex-col bg-bg p-2 rounded-2xl flex-1 aspect-[4/3] animate-pulse"
                >
                    <div className="p-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center bg-gray-300 rounded-2xl"></div>
                </div>
            ))}
        </div>
    )
}

// BarChartInteractive的骨架
export function BarChart_Skeleton() {
    return (
        <div className="flex items-center max-w-full w-[450px] h-full">
            <div className="w-full h-[300px] bg-bg rounded-xl animate-pulse" />
        </div>
    );
}

// lastInvoices的骨架
export function LastInvoices_Skeleton() {
    return (
        <div className="flex flex-col overflow-auto h-[350px] border-gray border-[15px] rounded-3xl justify-around p-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1">
                    <div className="flex flex-1 pl-6 pr-10 items-center justify-between relative">
                        <div className="flex gap-8 items-center font-inter">
                            <div className="w-[32px] h-[32px] rounded-full bg-gray-200 animate-pulse" />
                            <div className="flex flex-col justify-between gap-2">
                                <div className="w-24 h-5 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <Separator className="my-2"/>
                </div>
            ))}
        </div>
    )
}

// Pagination的骨架
export function PaginationSkeleton() {
    return (
        <div className="h-full">
            <div className="flex justify-start pl-16 gap-6 font-inter h-full">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                        key={i} 
                        className="rounded-md bg-bg px-2 duration-200 aspect-square w-8 h-8 flex items-center justify-center animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}

// Customer List的骨架
export function CustomerListSkeleton() {
    return (
        <div className="w-[95%] animate-pulse">
            <div className="flex bg-bg mb-4">
                <div className="flex-4 px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex-1 px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex-1 px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex-1 px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
            
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex bg-bg mb-2 py-4">
                    <div className="flex-4 px-6 flex items-center justify-center">
                        <div className="w-[32px] h-[32px] rounded-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 px-6 flex items-center">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="flex-1 px-6 flex items-center">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-8">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Invoice List的骨架
export function InvoiceListSkeleton() {
    return (
        <div className="w-[95%] animate-pulse">
            <div className="flex bg-bg mb-4">
                <div className="flex-4 px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex-1 px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex-1 px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex-1 px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex-1 px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
            
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex bg-bg mb-2 py-4">
                    <div className="flex-4 px-6 flex items-center">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="flex-1 px-6 flex items-center">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="flex-1 px-6 flex items-center">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="flex-1 px-6 flex items-center">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-8">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}


