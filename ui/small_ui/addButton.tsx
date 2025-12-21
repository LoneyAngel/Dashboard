import { PlusIcon } from "lucide-react"
import Link from "next/link"
// 所以这个组件完全是可以进行复用的
export default function AddButton({href}:{href:string}) {
    return (
        <Link href={href} className="p-2">
            <PlusIcon size={26} className="shadow-lg rounded-full hover:scale-105"/>
        </Link>
    )
}