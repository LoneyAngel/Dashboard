export default function Loading() {
    return (
        <div className=" h-full animate-pulse">
            <div className="h-8 w-8 bg-gray-300 rounded mb-4"></div>
            <div className="mt-6 flex flex-col gap-4 p-2 items-center w-[70%] mx-auto">
                <div className="w-full">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
                        <div className="h-10 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/3 mt-1"></div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
                        <div className="h-10 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/3 mt-1"></div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
                        <div className="h-10 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/3 mt-1"></div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
                        <div className="h-10 bg-gray-300 rounded w-full"></div>
                    </div>
                </div>
                <div className="h-10 bg-gray-300 rounded w-1/3 mt-6"></div>
            </div>
        </div>
    );
}