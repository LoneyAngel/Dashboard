import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon} from "lucide-react";

export default function CenterAlert({message}:{message:{type:"default" | "destructive",head:string,text:string}}) {
  return (
    <Alert variant={message.type} className="p-4 fixed top-4 w-[20%] left-[calc((100vw-250px)/2+250px)] transform -translate-x-1/2 z-[11]">
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