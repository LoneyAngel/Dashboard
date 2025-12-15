export default function Loading() {
    return (
        <div className="h-full rounded-2xl shadow-xl border border-black-300 animate-pulse px-[15%]">
            <div className="h-8 w-8 bg-gray-300 rounded mb-4" />
            <div className="mt-6 flex flex-col gap-4 p-2 items-center w-[70%] mx-auto">
                <div className="w-full">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-1/4"></div>
                    <div className="flex justify-center gap-4 flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                        <div className="h-10 bg-gray-300 rounded w-full"></div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-1/4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                </div>
                <div className="w-full">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-1/4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded w-1/3 mt-6"></div>
            </div>
        </div>
    );
}