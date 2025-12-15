import { Spinner } from "@/components/ui/spinner";

export default function Loading() { 
    return (
        <div className="h-full p-8 flex items-center justify-center">
            <Spinner className="w-[50px] h-[50px]"/>
        </div>
    )
}
