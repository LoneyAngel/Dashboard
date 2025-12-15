export default function Cards({ title, number }: { title: string, number: number | string }) {
    return (
        <div className="flex flex-col bg-bg p-2 rounded-2xl flex-1 aspect-[4/3] hover:scale-105 duration-100">
            <div className="p-2">{title}</div>
            <div className="flex-1 flex items-center justify-center bg-white rounded-2xl text-2xl font-inter">{number}</div>
        </div>
    )
}