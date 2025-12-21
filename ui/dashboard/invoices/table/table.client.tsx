// 合理处理table的显示 
"use client"

import { deleteInvoicesById } from "@/app/lib/action"
import { Invoice } from "@/app/lib/definition"
import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"
import styles from "./table.module.css"
import { SquarePen, Trash } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import CenterAlert from "@/ui/small_ui/alert"
function Table({data}:{data:Invoice[]}){
    const [state,stateAction,isPending] = useActionState(deleteInvoicesById,{
        success:false,
        message:""
    })
    const [Data,setData] = useState(data)
    const [deleteId,setDeleteId] = useState("")
    const [message, setMessage] = useState<{ type: 'default' | 'destructive'; head: string;text:string } | null>(null);
    const isUser = useRef(false)
    const timeOutRef = useRef<any>(null);
    // 使用乐观更新
    // 这里处理删除失败的情况
    useEffect(()=>{
        if(data.length)
            setData(data)
    },[data])
    
    useEffect(()=>{
        // 表示用户操作结束
        if(!isPending&&(isUser.current)){
            isUser.current = false
            if(state.success){
                setMessage({type:"default",head:"success",text:"invoice删除成功"})
                setDeleteId("")
                timeOutRef.current = setTimeout(()=>{
                    setMessage(null)
                },3000) 
            }
            else {
                setMessage({type:"destructive",head:"error",text:"invoice删除失败"})
                setDeleteId("")
                timeOutRef.current = setTimeout(()=>{
                    setMessage(null)
                },3000)
            }
        }
        return ()=>{
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }
        }
    },[state.message,isPending])
    useEffect(()=>{
        if(deleteId!==""){
            setData(prev=> prev.filter((item:Invoice)=>item.id!=deleteId))
        }
    },[deleteId])
    return (
        <div className="w-full h-full border border-gray-300 shadow-sm p-2">
            {
                message && <CenterAlert message={message}/>
            }
            <table className={`w-full ${styles.table} border border-gray-300 shadow-sm`}>
                <thead className="text-left">
                    <tr>
                        <th className="flex-4 px-6">Customer</th>
                        <th className="flex-1 px-6">Amount</th>
                        <th className="flex-1 px-6">Date</th>
                        <th className="flex-1 px-6">Status</th>
                        <th className="flex-1 "></th>
                    </tr>
                </thead>
                <tbody className="font-inter text-center relative text-sm">
                    {
                        Data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-4 text-gray-500">
                                    暂时没有数据
                                </td>
                            </tr>
                        ) : Data.map((item) => {
                            return (
                                <tr key={item.id} className="hover:scale-105 duration-200 ease-in-out hover:translate-x-[-10px]">
                                    <td >{item.customer_id}</td>
                                    <td >{item.amount}</td>
                                    <td >{item.date.toString()}</td>
                                    <td >{item.status}</td>
                                    <td className="flex items-center justify-between px-6">
                                        <Link href={`/dashboard/invoices/${item.id}/edit`} className="hover:scale-110 duration-200 transition-transform">
                                             <SquarePen strokeWidth={1.5}/>
                                        </Link>
                                        {/* 这里的话我希望出现一个弹窗吧 */}
                                        <button onClick={()=>{
                                            setDeleteId(item.id)
                                        }} className="hover:scale-110 duration-200 transition-transform">
                                            <Trash strokeWidth={1.5}/>
                                        </button>
                                    </td> 
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {
                deleteId &&(
                    <div className="fixed w-[calc(100%-260px)] h-screen flex items-center justify-center center top-0 right-0 bg-black/60 z-10 font-karrik" >
                        <div onClick={()=>{
                                setDeleteId("")
                                setData(data)
                            }} className="absolute w-full h-full"/>
                        <form action={stateAction} 
                            onSubmit={()=>{isUser.current=true}}
                            className="z-20 w-[200px] bg-white/100 flex flex-col justify-between items-center aspect-[4/3] p-6 rounded"
                        >
                            <p className="font-normal text-xl leading-8">确定删除?</p>
                            <input type="hidden" value={deleteId} name="id"/>
                            <div className="flex gap-4 justify-center items-center">
                                <button type="submit" disabled={isPending} className="flex items-center gap-2 justify-center w-[64px] rounded  duration-medium bg-bg  hover:bg-button-bg-h hover:text-blue-500 p-2" >
                                    sure
                                    {isPending && <Spinner />}
                                </button>
                                <button onClick={()=>{
                                    setDeleteId("")
                                    setData(data)
                                }} 
                                className="flex items-center justify-center w-[64px] rounded  duration-medium bg-bg  hover:bg-button-bg-h hover:text-blue-500 p-2">no</button>
                            </div>
                        </form>
                    </div>
                )
            }
        </div>
    )
}
export default Table