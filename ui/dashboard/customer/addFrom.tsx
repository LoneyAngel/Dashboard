// 编辑页面分出来的edit_from组件
"use client";
import { addCustomer} from "@/app/lib/action";
import { Customer, FormState } from "@/app/lib/definition";
import { hasAnyError } from "@/app/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeftToLine } from "lucide-react";
import { Spinner } from "@/components/ui/spinner"
import CenterAlert from "@/ui/small_ui/alert";
export default function AddFrom() {
    const router = useRouter();
    // Action初始状态
    const intialState:FormState<Customer> = {
        success:false,
        message:{}
    }
    // FromAction
    const [state,stateAction,isPending] = useActionState(addCustomer,intialState)
    // Input
    const fileInputRef = useRef<HTMLInputElement>(null);
    // 判断是不是用户选择
    const isUser = useRef(false);
    // 定时器
    const timeOutRef = useRef<any>(null);
    // 数据
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<{ type: 'default' | 'destructive'; head: string;text:string } | null>(null);
    // 管理预览 URL（仅客户端）
    const [preview, setPreview] = useState<string | null>(null);
    // 处理文件选择 → 立即预览
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size > 5 * 1024 * 1024) {
            alert('文件不能超过 5MB');
            e.target.value = ''; // 清空
            setPreview(null);
        }
        else if (file) {
            // 创建本地预览 URL
            const url = URL.createObjectURL(file);
            setPreview(url);
        } else {
            setPreview(null);
        }
    };
    // 🔹 清理预览 URL（避免内存泄漏）
    useEffect(() => {
        return () => {
        if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);
    // 监听状态
    useEffect(()=>{
        if(!isPending&&(isUser.current)){
            isUser.current = false;
            if(hasAnyError(state.message)) {
                setMessage({type:"destructive",head:"error",text:"customer添加失败"})
                timeOutRef.current = setTimeout(()=>{
                    setMessage(null);
                },3000)
            }
            else{
                setMessage({type:"default",head:"success",text:"customer添加成功"})
                timeOutRef.current = setTimeout(()=>{
                    setMessage(null);
                    router.replace("/dashboard/customer")
                },3000) 
            }
        }
        return () => {
            if (timeOutRef.current) {
                timeOutRef.current=null;
            }
        };
    },[state.success,isPending])
    return (
        <div className="h-full">
            {
                message && <CenterAlert message={message}/>
            }
            <button className="h-8 w-8 hover:scale-105 ml-2" onClick={()=>history.back()}>
                <ArrowLeftToLine/>
            </button>
            <form action={stateAction} onSubmit={()=>{isUser.current=true}} className="mt-6 flex flex-col gap-4 p-2 items-center w-[70%] mx-auto relative">
                {/* 👤 头像预览区 */}
                <div>
                    <label className="block mb-2">头像</label>
                    <div className="flex justify-center gap-4 flex-col">
                        {preview ? (
                            <Image
                                src={preview}
                                alt="头像预览"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                ?
                            </div>
                        )}

                        {/* 文件选择 */}
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="text-sm text-gray-500"
                            required
                        />
                    </div>
                    {
                        // @ts-expect-error
                        state.message?.avator && <p className="text-red-500 text-sm mt-1">{state.message.avator._errors}</p>
                    }
                </div>
                <div className="relative w-full">
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="name" className="pl-4 font-zen text-[17px]">姓名</label>
                        <input 
                            value={name} 
                            onChange={(e)=>{setName(e.target.value)}} 
                            type="text" 
                            name="name" 
                            id="name" 
                            className="border border-gray-200 h-[40px] w-full px-2 text-[14px]"
                            required
                        />
                    </div>
                </div>
                <div className="relative w-full">
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="email" className="pl-4 font-zen text-[17px]">邮箱</label>
                        <input 
                            value={email} 
                            onChange={(e)=>{setEmail(e.target.value)}} 
                            type="email" 
                            name="email" 
                            id="email" 
                            className="border border-gray-200 h-[40px] w-full px-2 text-[14px]"
                            required
                        />
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 duration-200 transition-colors mt-6 flex gap-2 items-center"
                    disabled={isPending || !name || !email}
                >
                    {isPending ? '上传中' : '提交'}
                    {isPending && <Spinner />}
                </button>
            </form>
        </div>
    )
}