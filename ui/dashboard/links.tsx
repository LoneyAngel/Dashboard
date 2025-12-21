"use client"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"


// tap的左部分
const links = [
    { name: "dashboard", href: "/dashboard" },
    { name: "invoices", href: "/dashboard/invoices" },
    { name: "customer", href: "/dashboard/customer" }
]
export default function Links() {
    const [n,setN] = useState(0)
    const pathname = usePathname()
    useEffect(() => {
        let s : number | null = null;
        links.forEach((link,index) => {
            if (pathname.startsWith(link.href)) {
                if(s!==null && (link.href.length > links[s].href.length)){
                    s=index
                }
                else if(s===null) s=index
            }
        })  
        if(s!==null) setN(s)
    }, [pathname])  
    return (
        <div className="flex flex-col h-full gap-2 font-zen">
            <div className="flex pb-4 pl-4 h-[25%] min-h-[120px] rounded-2xl bg-blue-500 justify-start items-end">
                {/* 这里使用items-start消除Link在父容器是flex容器的情况下的长度溢出 */}
                <Logo />
            </div>
            <div className="flex-1 flex flex-col gap-2 overflow-auto min-h-[60px] text-sm" >
                {
                    links.map((link,index) => {
                        const isActive = index === n
                        return (
                            <Link key={link.name} href={link.href} className={clsx('flex items-center justify-center h-[50px] rounded  duration-medium shrink-0', {
                                'bg-button-bg-h text-blue-500': isActive,
                                'bg-bg hover:bg-button-bg-h hover:text-blue-500': !isActive
                            })
                            }>{link.name}</Link>
                        )
                    })
                }
            </div>
            <div className="text-sm mb-0 flex items-center justify-center h-[50px] rounded bg-bg duration-medium hover:bg-button-bg-h hover:text-blue-500 shrink-0">
                layout
            </div>
        </div>
    )
}

function Logo() {
    return (
        <Link href="/" className="flex text-white border-none items-center">
            <svg className="" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
                <path d="M519 398.2l213.3 355.6H305.7L519 398.2z" fill="#2c2c2c"></path><path d="M1006.3 910.3H17.7L512 72.4l494.3 837.9z m-839.1-85.4h689.7L512 240.4 167.2 824.9z" fill="#2c2c2c"></path>
            </svg>
            <span className="text-4xl font-medium ">Pron</span>
        </Link>
    )
}