// Invoice编辑页面
"use client";
import { updateInvoiceById } from "@/app/lib/action";
import { FormState, Invoice } from "@/app/lib/definition";
import { formatDate, hasAnyError } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeftToLine} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import CenterAlert from "@/ui/small_ui/alert";
export default function EditfromInteractive({invoice,idArray}:{invoice:Invoice,idArray:string[]}) {
    const router = useRouter();
    // Action初始状态zero state
    const initialState:FormState<Invoice> = {
        success:false,
        message:{}
    }
    // 用户操作判断
    const isUser = useRef(false)
    // 定时器
    const timeOutRef = useRef<any>(null);
    // 表单action
    const [state,stateAction,isPending] = useActionState(updateInvoiceById,initialState)
    // customerId加载状态处理
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // 数据
    const [array, setArray] = useState<string[]>([]);
    const [amount, setAmount] = useState(Number(invoice.amount));
    const [date, setDate] = useState(formatDate(invoice.date,"-"));
    const [customer_id, setCustom_Id] = useState(invoice.customer_id);
    const [status, setStatus] = useState(invoice.status);
    // 提示信息
    const [message, setMessage] = useState<{ type: 'default' | 'destructive'; head: string;text:string } | null>(null);
    // 监听action状态
    useEffect(()=>{
        if(!isPending&&(isUser.current)){
            isUser.current = false
            if(hasAnyError(state.message)) {
                setMessage({type:"destructive",head:"error",text:"invoice修改失败"})
                timeOutRef.current = setTimeout(()=>{
                    setMessage(null)
                },3000)
            }
            else{
                setMessage({type:"default",head:"success",text:"invoice修改成功"})
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
    // idArray数据处理
    useEffect(()=>{
        if(idArray.length > 0) setArray(idArray);
    },[idArray])
    // 数据处理
    useEffect(()=>{
        setAmount(Number(invoice.amount));
        setDate(formatDate(invoice.date,"-"));
        setCustom_Id(invoice.customer_id);
        setStatus(invoice.status);
    },[invoice])
    // idArray加载状态处理
    useEffect(()=>{
        if(array.length > 0){
            setIsLoading(false);
        }
    },[array])
    
    return (
        <div className="h-full rounded-2xl shadow-xl border border-black-300">
            {
                message && <CenterAlert message={message}/>
            }
            <button className="h-8 w-8 hover:scale-105 ml-2" onClick={()=>history.back()}>
                <ArrowLeftToLine/>
            </button>
            <form action={stateAction} onSubmit={()=>{isUser.current=true}} className="mt-6 flex flex-col gap-4 p-2 items-center w-[70%] mx-auto relative">
                <input type="hidden" value={ invoice.id } name="id" />
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="customer_id" className="pl-4 font-zen text-[17px]">customer_id</label>
                    <select value={customer_id} name="customer_id" id="customer_id" disabled={isLoading} 
                        onChange={(e)=>{
                            setCustom_Id(e.target.value);
                        }}
                        className="border border-gray-200 h-[40px] w-full px-2 text-[14px]">
                        {
                            isLoading ? <option value={customer_id||"is loading...."}>{customer_id}</option> :(
                                array.map((item)=>(
                                    <option key={item} value={item}>{item}</option>
                                ))
                            )
                        }
                    </select>
                </div>
                {
                    // @ts-expect-error
                    state.message.customer_id && <span className="text-red-500 text-[12px] font-sans">{state.message.customer_id._errors}</span>
                }
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="amount" className="pl-4 font-zen text-[17px]">amount（这里使用美分）</label>
                    <input value={amount} onChange={(e)=>{setAmount(Number(e.target.value))}} type="number" name="amount" id="amount" className="border border-gray-200 h-[40px] w-full px-2 text-[14px]"/>
                    {
                        // @ts-expect-error
                        state.message.amount && <span className="text-red-500 text-[12px] font-sans">{state.message.amount._errors}</span>
                    }
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="date" className="pl-4 font-zen text-[17px]">date</label>
                    <input value={date} onChange={(e)=>{
                        setDate(formatDate(e.target.value,"-"));
                    }}  type="date" name="date" id="date" className="border border-gray-200 h-[40px] w-full px-2 text-[14px]"/>
                </div>
                {
                    // @ts-expect-error
                    state.message.data && <span className="text-red-500 text-[12px] font-sans">{state.message.date._errors}</span>
                }
                <div className="flex flex-col gap-1 w-full ">
                    <label className="pl-4 font-zen text-[17px]">status</label>
                    <div className="flex gap-4 text-[14px]">
                        <div className="flex gap-1">
                            <label htmlFor="bt1">paid</label>
                            <input type="radio" name="status" value="paid" id="bt1" checked={status === 'paid'} // 受控
                                onChange={
                                    // @ts-expect-error
                                    (e) => setStatus(e.target.value)
                                }/>
                        </div>
                        <div className="flex gap-1">
                            <label htmlFor="bt2">pending</label>
                            <input type="radio" name="status" value="pending" id="bt2" checked={status === 'pending'} onChange={
                                // @ts-expect-error
                                (e) => setStatus(e.target.value)
                            } />
                        </div>
                    </div>
                </div>
                {
                    // @ts-expect-error
                    state.message.status && <span className="text-red-500 text-[12px] font-sans">{state.message.status._errors}</span>
                }
                <button type="submit" disabled={isPending} className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 duration-200 transition-colors mt-6 flex gap-2 items-center">
                    {isPending ? '上传中' : '提交'}
                    {isPending && <Spinner />}
                </button>
            </form>
        </div>
    )
}