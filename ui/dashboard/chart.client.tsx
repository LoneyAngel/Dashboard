"use client"
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,     // <-- 导入 CategoryScale
    LinearScale,      // <-- 导入 LinearScale
    BarElement,       // <-- 导入 BarElement (绘制柱子)
    Title,            // <-- 导入 Title (图表标题)
    Tooltip,          // <-- 导入 Tooltip (提示框)
    Legend,           // <-- 导入 Legend (图例)
} from 'chart.js';
// 👇 关键：注册导入的模块到 ChartJS 全局实例
ChartJS.register(
    CategoryScale,    // <-- 注册 CategoryScale
    LinearScale,     // <-- 注册 LinearScale
    BarElement,      // <-- 注册 BarElement
    Title,           // <-- 注册 Title
    Tooltip,         // <-- 注册 Tooltip
    Legend           // <-- 注册 Legend
);
const options = {
    responsive: true, // 保持响应式
    plugins: {
        legend: {
            display: false, // 👈 关键：设置为 false 以隐藏图例
        },
    }
};

export default function BarChartInteractive({labels,data}: {labels: string[],data: string[]}) {
    const chartdata = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 0)',
                borderWidth: 0,
            },
        ],
    };
    return (
        <Bar data={chartdata} options={options} />
    );
};