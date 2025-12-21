// 合理处理table的显示 
"use client"

import Image from 'next/image';
import { deleteCustomerById } from "@/app/lib/action"
import { Customer } from "@/app/lib/definition"
import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"
import styles from "./table.module.css"
import { SquarePen, Trash } from "lucide-react";
import { Spinner } from '@/components/ui/spinner';
import CenterAlert from '@/ui/small_ui/alert';

export default function Table({data}:{data:Customer[]}){
    const [state,stateAction,isPending] = useActionState(deleteCustomerById,{
        success:false,
        message:""
    })
    // 因为会进行乐观更新所以这里保留
    const [Data,setData] = useState<Customer[]>(data)
    const [deleteId,setDeleteId] = useState("")
    const [message, setMessage] = useState<{ type: 'default' | 'destructive'; head: string;text:string } | null>(null);
    const isUser = useRef(false)
    const timeOutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(()=>{
        // 表示用户操作结束
        if(!isPending&&(isUser.current)){
            isUser.current = false
            if(state.success){
                setMessage({type:"default",head:"success",text:"customer删除成功"})
                setDeleteId("")
                timeOutRef.current = setTimeout(()=>{
                    setMessage(null)
                },3000) 
            }
            else {
                setMessage({type:"destructive",head:"error",text:"customer删除失败"})
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
    
    // 当表单数据发生变化，清除当前的所有状态
    useEffect(()=>{
        if(data.length)
            setData(data)
    },[data])
    
    // 进行乐观更新
    useEffect(()=>{
        if(deleteId!==""){
            setData(prev=> prev.filter((item:Customer)=>item.id!=deleteId))
        }
    },[deleteId])
    
    return (
        <div className="w-full h-full p-2 bg-gray-50 rounded-lg shadow-lg">
            {
                message?.head && (
                    <CenterAlert message={message}/>
                )
            }
            <table className={`w-full ${styles.table} text-center`}>
                <thead className="">
                    <tr>
                        <th className="flex-4 px-6">头像</th>
                        <th className="flex-1 px-6">name</th>
                        <th className="flex-1 px-6">email</th>
                        <th className="flex-1 "></th>
                    </tr>
                </thead>
                <tbody className="font-inter text-center relative text-sm">
                    {
                        Data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-4 text-gray-500">
                                    暂时没有用户
                                </td>
                            </tr>
                        ) : Data.map((item) => {
                            return (
                                <tr key={item.id} className="hover:scale-105 duration-200 ease-in-out">
                                    <td>
                                        <Image src={item.image_url} alt="user_imaege" width={32} height={32} className="w-[32px] h-[32px] rounded-full mx-auto" />
                                    </td>
                                    <td >{item.name}</td>
                                    <td >{item.email}</td>
                                    <td className="flex items-center justify-center gap-8">
                                         <Link href={`/dashboard/customer/${item.id}/edit`} className="hover:scale-110 duration-200 transition-transform">
                                            <SquarePen strokeWidth={1.5}/>
                                         </Link>
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
                                <button disabled={isPending} type="submit" className="flex items-center gap-2 justify-center w-[64px] rounded  duration-medium bg-bg  hover:bg-button-bg-h hover:text-blue-500 p-2" >
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
