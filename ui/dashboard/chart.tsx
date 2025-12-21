import { initChartData } from "@/app/lib/data"
import BarChartInteractive from "./chart.client"

export default async function BarChart() {
    const _ = await initChartData()
    const labels:string[]=[]
    const data:string[]=[]
    function initdata() {        
        _?.forEach((item) => {
            labels.push(item.month)
            data.push(item.revenue)
        })    
    }
    initdata()
    return (
        <div className="flex items-center max-w-full w-full h-full p-4">
            <BarChartInteractive labels={labels} data={data} />
        </div>
    );
};