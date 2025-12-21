"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState, useEffect, useRef, useState } from "react"
import { getUserEmail, sendMailCode } from "@/app/lib/data"
import { useRouter } from "next/navigation"
import { ArrowLeftToLine} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { hasAnyError } from "@/app/lib/utils"
import { FormState, User } from "@/app/lib/definition"
import { createUser } from "@/app/lib/action"
import { InputOTPPattern } from "@/ui/login/code"
import CenterAlert from "@/ui/small_ui/alert"
// 注册成功之后，返回登陆页面

export default function Register({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) { 
  const router = useRouter()
  // 换页
  const [isNextStep, setIsNextStep] = useState(false)
  // 用户信息
  const [user, setUser] = useState({ email: '', password: '', name: ''})
  // 提示信息
  const [message, setMessage] = useState<{ type: 'default' | 'destructive'; head: string;text:string } | null>(null);
  // 提示信息倒计时
  const timeOutRef = useRef<any>(null);
  // 用于发送验证码的限制定时器
  const isUser = useRef(false);
  // 是否允许下一步
  const [canNext, setCanNext] = useState(false)
  // 验证码倒计时
  const [countdown, setCountdown] = useState(0); // 添加倒计时状态
  const initialState: FormState<User> = {
    success:false,
    message:{}
  }
  const [state,stateAction,isPending] = useActionState(createUser,initialState)
  async function handleSendCode() {
    // 发送验证码
    // 如果正在倒计时，则不执行发送操作
    if (countdown > 0) return;
    
    // 判断当前邮箱是否注册过
    if(user.email.trim().length >= 5) {
        const _ = await getUserEmail(user.email.trim())
        if (!_) {
          const s = await sendMailCode(user.email.trim())
          if(s.success){
            setMessage({
            type: 'default',
            head: 'success',
            text: '验证码已发送至您的邮箱，请注意查收'
          })}
          else{
            setMessage({
            type: 'destructive',
            head: 'error',
            text: '发送验证码失败'
          })
          timeOutRef.current = setTimeout(() => {
            setMessage(null)
            return 
          },3000)
          }
          // 启动60秒倒计时
          setCountdown(60);
          
          timeOutRef.current = setTimeout(() => {
            setMessage(null)
          },3000)
        }
        else {
          setMessage({
            type: 'destructive',
            head: 'error',
            text: '邮箱已被使用,请使用其他邮箱'
          })
          timeOutRef.current = setTimeout(() => {
            setMessage(null)
          },3000)
      } 
    }
    else {
      setMessage({
        type: 'destructive',
        head: 'error',
        text: '请输入有效的邮箱地址'
      })
      timeOutRef.current = setTimeout(() => {
        setMessage(null)
      },3000)
    }
  }
  
  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);
  useEffect(()=>{
      if(!isPending&&(isUser.current)){
          isUser.current = false;
          if(state && hasAnyError(state.message)) {
              setMessage({type:"destructive",head:"error",text:`注册失败`})
              timeOutRef.current = setTimeout(()=>{
                  setMessage(null);
              },3000)
          }
          else{
              setMessage({type:"default",head:"success",text:"注册成功"})
              timeOutRef.current = setTimeout(()=>{
                  setMessage(null);
                  router.replace("/login")
              },3000) 
          }
      }
      return () => {
          if (timeOutRef.current) {
              clearTimeout(timeOutRef.current);
          }
      };
  },[state?.success,isPending])
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {
        message && <CenterAlert message={message}/>
      }
      {!isNextStep ? (
        <Card>
          <button className="h-8 w-8 ml-3 mt-2" onClick={()=> router.back()  }>
              <ArrowLeftToLine/>
          </button>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">verify code</Label>
                <div className="flex justify-between gap-2">
                  <InputOTPPattern email={user.email} canNext={canNext} setCanNext={setCanNext} setMessage={setMessage} timeOutRef={timeOutRef}/>
                  <Button 
                    className="w-full"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}s后重新发送` : 'send code'}
                  </Button>
                </div>
              </div>
              <Button 
                className="w-full"
                disabled={!canNext}
                onClick={()=>{
                  if(canNext){
                    setIsNextStep(true)
                  }
                }}
              >
                下一步
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <button className="h-8 w-8 ml-3 mt-2" onClick={()=> setIsNextStep(false)  }>
              <ArrowLeftToLine/>
          </button>
          <CardContent className="pt-6">
            <form action={stateAction} className="grid gap-6" onSubmit={()=>{
              isUser.current = true
            }}>
              <input type="hidden" name="email" value={user.email}/>
              {
                state.message?.email && (<p className="text-red-500 text-sm mt-1">{state.message.email._errors}</p>)
              }
              <div className="grid gap-2">
                <Label htmlFor="name">name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="请输入用户名"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  required
                />
              </div>
              {
                state.message?.name && (<p className="text-red-500 text-sm mt-1">{state.message.name._errors}</p>)
              }
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-sm text-gray-500">至少8位，含字母和数字</span>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="请输入密码"
                  value={user.password}
                  onChange={(e) => setUser({...user, password: e.target.value})}
                  required
                />
              </div>
              {
                state.message?.password && (<p className="text-red-500 text-sm mt-1">{state.message.password._errors}</p>)
              }
              <Button 
                className="w-full" 
                type="submit"
                disabled={user.password.length > 0 && user.password.length < 6 || isPending}
              >
                {isPending ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    处理中...
                  </>
                ) : (
                  "确定"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}