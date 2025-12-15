import Links from "@/ui/dashboard/links";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen p-1 gap-2 overflow-hidden">
            <div className="w-[250px] h-full">
                <Links />
            </div>
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    )
}