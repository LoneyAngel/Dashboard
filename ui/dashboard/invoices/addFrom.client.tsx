// invoice编辑页面
"use client";
import { addInvoice } from "@/app/lib/action";
import { FormState, Invoice } from "@/app/lib/definition";
import { formatDate, hasAnyError } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeftToLine} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import CenterAlert from "@/ui/small_ui/alert";
export default function AddFromInterative({idArray}:{idArray:string[]}) {
    // action初始状态
    const intialState:FormState<Invoice> = {
        success:false,
        message:{}
    }
    const router = useRouter();
    //判断是否经过用户操作
    const isUser = useRef(false)
    //定时器
    const timeOutRef = useRef<any>(null);
    // 表单action
    const [state,stateAction,isPending] = useActionState(addInvoice,intialState)
    // invoice的customerId的数组加载状态处理
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // 数据存储
    const [array, setArray] = useState<string[]>(idArray);
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [customer_id, setCustom_Id] = useState("");
    const [status, setStatus] = useState("");
    // 提示信息
    const [message, setMessage] = useState<{ type: 'default' | 'destructive'; head: string;text:string } | null>(null);
    // 监听actionState
    useEffect(()=>{
        if(!isPending&&(isUser.current)){
            isUser.current = false
            if(hasAnyError(state.message)) {
                setMessage({type:"destructive",head:"error",text:"invoice添加失败"})
                timeOutRef.current = setTimeout(()=>{
                    setMessage(null)
                },3000)
            }
            else{
                setMessage({type:"default",head:"success",text:"invoice添加成功"})
                timeOutRef.current = setTimeout(()=>{
                    setMessage(null)
                    router.replace("/dashboard/invoices")
                },3000) 
            }
        }
        return () => {
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }
        };
    },[state.message,isPending])
    // idArray数据加载
    useEffect(()=>{
        if(idArray.length > 0){
            setArray(idArray);
        }
    },[idArray])
    // idArray数组加载状态处理
    useEffect(()=>{
        if(array.length > 0){
            setIsLoading(false);
        }
    },[array])
    return (
        <div className="h-full">
            {
                message && <CenterAlert message={message}/>
            }
            <button className="h-8 w-8 hover:scale-105" onClick={()=>history.back()}>
                <ArrowLeftToLine/>
            </button>
            <form action={stateAction} onSubmit={()=>{isUser.current=true}} className="mt-6 flex flex-col gap-4 p-2 items-center w-[70%] mx-auto relative">
                <div className="w-full relative">
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="customer_id" className="pl-4 font-zen text-[17px]">customer_id</label>
                        <select value={customer_id} name="customer_id" id="customer_id" disabled={isLoading} 
                            onChange={(e)=>{
                                setCustom_Id(e.target.value);
                            }}
                            className="border border-gray-200 h-[40px] w-full px-2 text-[14px]">
                            {
                                isLoading ? <option>is loading....</option> :(
                                    array.map((item)=>(
                                        <option key={item} value={item}>{item}</option>
                                    ))
                                )
                            }
                        </select>
                    </div>
                    {
                        // @ts-expect-error
                        state.message.customer_id && <span className="absolute bottom-0 translate-y-4 text-red-500 text-[12px] font-momo">{state.message.customer_id._errors}</span>
                    }
                </div>
                <div className="relative w-full">
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="amount" className="pl-4 font-zen text-[17px]">amount（这里使用美分）</label>
                        <input value={amount} onChange={(e)=>{setAmount(Number(e.target.value))}} type="number" name="amount" id="amount" className="border border-gray-200 h-[40px] w-full px-2 text-[14px]"/>
                    </div>
                    {
                        // @ts-expect-error
                        state.message.amount && <span className="absolute bottom-0 translate-y-4 text-red-500 text-[12px] font-momo">{state.message.amount._errors}</span>
                    }
                </div>
                <div className="w-full relative">
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="date" className="pl-4 font-zen text-[17px]">date</label>
                        <input value={date} onChange={(e)=>{
                            setDate(formatDate(e.target.value,"-"));
                        }}  type="date" name="date" id="date" className="border border-gray-200 h-[40px] w-full px-2 text-[14px]"/>
                    </div>
                    {
                        // @ts-expect-error
                        state.message.date && <span className="absolute bottom-0 translate-y-4 text-red-500 text-[12px] font-momo">{state.message.date._errors}</span>
                    }
                </div>
                <div className="w-full relative">
                    <div className="flex flex-col gap-1 w-full ">
                        <label className="pl-4 font-zen text-[17px]">status</label>
                        <div className="flex gap-4 text-[14px]">
                            <div className="flex gap-1">
                                <label htmlFor="bt1">paid</label>
                                <input type="radio" name="status" value="paid" id="bt1" checked={status === 'paid'} // 受控
                                    onChange={
                                        (e) => setStatus(e.target.value)
                                    }/>
                            </div>
                            <div className="flex gap-1">
                                <label htmlFor="bt2">pending</label>
                                <input type="radio" name="status" value="pending" id="bt2" checked={status === 'pending'} 
                                    onChange={
                                        (e) => setStatus(e.target.value)
                                    }/>
                            </div>
                        </div>
                    </div>
                    {
                        // @ts-expect-error
                        state.message.status && <span className="absolute bottom-0 translate-y-4 text-red-500 text-[12px] font-momo">{state.message.status._errors}</span>
                    }
                </div>
                <button disabled={isPending} type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 duration-200 transition-colors mt-6 flex gap-2 items-center">
                    {isPending ? '上传中' : '提交'}
                    {isPending && <Spinner />}
                </button>
            </form>
        </div>
    )
}