import { initChartData } from "@/app/lib/data"
import BarChartInteractive from "./chart.client"

export default async function BarChart() {
    const _ = await initChartData()
    let labels:string[]=[]
    let data:string[]=[]
    function initdata() {        
        _?.forEach((item) => {
            labels.push(item.month)
            data.push(item.revenue)
        })    
    }
    initdata()
    return (
        <div className="flex items-center max-w-full w-[450px] h-full ">
            <BarChartInteractive labels={labels} data={data} />
        </div>
    );
};