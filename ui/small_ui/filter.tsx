"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { usePathname, useRouter, useSearchParams, ReadonlyURLSearchParams } from "next/navigation"
import { updateQueryParams } from "@/app/lib/utils"
import { useRef, useState, useCallback, useEffect } from "react"

// 辅助函数：从 URL 初始化筛选状态 (假设：URL中不存在的参数默认为 true)
function getInitialFilterState(filterArray: string[], searchParams: ReadonlyURLSearchParams): Record<string, boolean> {
    const initialState: Record<string, boolean> = {};
    
    filterArray.forEach(item => {
        // 如果 URL 中该参数的值明确为 'false'，则设置为 false，否则默认为 true
        // 这取决于你的 updateQueryParams 如何处理 false 的值 (是移除还是设置为 'false')
        initialState[item] = searchParams.get(item) === 'false' ? false : true; 
    });
    return initialState;
}

export default function Filter({ className, filterArray }: { className?: string, filterArray: string[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 1. 修正：handleSearch 的定义
    const handleSearch = useCallback((dict: Record<string, boolean>) => {
        updateQueryParams(dict, searchParams, pathname, router,1);
    }, [searchParams, pathname, router]);

    // 2. 修正：从 URL 初始化状态，而不是默认全选
    const [likeDict, setLikeDict] = useState<Record<string, boolean>>(() => 
        getInitialFilterState(filterArray, searchParams)
    );
    
    // 3. 修正：添加清理函数，确保依赖项完整
    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        
        // 设置防抖延迟
        searchTimeoutRef.current = setTimeout(() => {
            handleSearch(likeDict);
        }, 1000); // 1000毫秒防抖

        // 清理函数：在下一次 useEffect 运行或组件卸载时清除前一个定时器
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [likeDict]);

    return (
        <div className={className}>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <button className="mx-auto p-2 rounded-md hover:scale-105" aria-label="筛选选项">
                        <SlidersHorizontal strokeWidth={1.5} size={24} />
                    </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-40">
                    <div className="flex flex-col gap-6">
                        {
                            filterArray.map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={item} 
                                        checked={likeDict[item]}
                                        onCheckedChange={(status) => {
                                            // 4. 修正：更新状态
                                            setLikeDict(prev => ({ ...prev, [item]: Boolean(status) }));
                                        }}
                                    />
                                    <Label htmlFor={item}>{item}</Label>
                                </div>
                            ))
                        }
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}