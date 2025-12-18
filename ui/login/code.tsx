"use client"

import { REGEXP_ONLY_DIGITS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react"
import { verifyCode } from "@/app/lib/data"
export function InputOTPPattern({email,canNext, setCanNext, setMessage,timeOutRef}:{email:string,canNext:boolean,setCanNext:(canNext:boolean)=>void,setMessage:any,timeOutRef:React.MutableRefObject<NodeJS.Timeout | null>}) {
    const [value, setValue] = useState("")
    async function handleComplete(value: string) {
        const res = await verifyCode(email,value)
        if(res.success){
            setMessage({type:"default",head:"success",text:"验证成功"})
              timeOutRef.current = setTimeout(()=>{
                  setMessage(null);
              },2000)
            setCanNext(true)
        }else{
            setMessage({type:"destructive",head:"error",text:`验证失败：${res.error}`})
              timeOutRef.current = setTimeout(()=>{
                  setMessage(null);
              },3000)
        }
    }
  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={value} 
    onChange={(v) => {setValue(v)}}
    onComplete={handleComplete}
    inputMode="numeric" 
    // 允许自动填充
    autoFocus
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
