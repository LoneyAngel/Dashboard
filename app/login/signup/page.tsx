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
import { getUserEmail } from "@/app/lib/data"
import { useRouter } from "next/navigation"
import { AlertCircleIcon, ArrowLeftToLine, CheckCircle2Icon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { hasAnyError } from "@/app/lib/utils"
import { FormState, User } from "@/app/lib/definition"
import { createUser } from "@/app/lib/action"
// 注册成功之后，返回登陆页面

export default function Register({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) { 
  const router = useRouter()
  const [isNextStep, setIsNextStep] = useState(false)
  const [user, setUser] = useState({ email: '', password: '', name: ''})
  const [message, setMessage] = useState<{ type: 'default' | 'destructive'; head: string;text:string } | null>(null);
  const timeOutRef = useRef<any>(null);
  const isUser = useRef(false);
  const initialState: FormState<User> = {
    success:false,
    message:{}
  }
  const [loading, setLoading] = useState(false)
  const [state,stateAction,isPending] = useActionState(createUser,initialState)
  async function handleNextStep() {
    // 判断当前邮箱是否注册过
    if(user.email.trim().length >= 5) {
      setLoading(true)
      try {
        const _ = await getUserEmail(user.email.trim())
        if (!_) {
          setIsNextStep(true)
        }
        else {
          setMessage({
            type: 'destructive',
            head: 'error',
            text: '邮箱已被使用,请使用其他邮箱'
          })
          timeOutRef.current = setTimeout(() => {
            setMessage(null)
            setUser({...user, email: ''})
          },3000)
        }
      } finally {
        setLoading(false)
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

  // async function handleRegister() {
  //   if (!passwordRegex.test(user.password)) {
      // setMessage({
      //   type: 'destructive',
      //   head: 'error',
      //   text: '密码必须包含字母和数字'
      // })
  //     timeOutRef.current = setTimeout(() => {
  //       setMessage(null)
  //     },3000)
  //     return
  //   }
  //   try {
  //     await createUser(user)
  //     setMessage({
  //       type: 'default',
  //       head: 'success',
  //       text: '注册成功'
  //     })
  //     setTimeout(()=>{
  //       setMessage(null)
  //       router.replace("/login")
  //     },3000)
  //   } 
  // }
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
          message && (
              <Alert variant={message.type} className="p-4 absolute top-2 w-[20%] left-1/2 transform -translate-x-1/2 z-10">
                  {
                      message.type === "default" ? (
                          <CheckCircle2Icon className="h-6 w-6" />
                      ) : (
                          <AlertCircleIcon  className="h-6 w-6" />
                      )
                  }
                  <AlertTitle>{message.head}</AlertTitle>
                  <AlertDescription>
                      {message.text}
                  </AlertDescription>
              </Alert>
          )
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
              <Button 
                className="w-full"
                onClick={handleNextStep}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    处理中...
                  </>
                ) : (
                  "下一步"
                )}
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