"use client";
/**
 * 合适的时机和url中的参数同步
 * 添加防抖
 * 确保组件完全独立
 */
import { useEffect, useRef, useState } from 'react';
import { updateQueryParams } from '@/app/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from "@/components/ui/input"
export default function Search({className,q}:{className?:string,q:string}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [query, setQuery] = useState(q);
    const handleSearch = useCallback((query: string) => {
        updateQueryParams({ query: query, page: 1 }, searchParams, pathname, router);
    }, [searchParams, pathname, router]);
    const isUser = useRef(false)
    // 判断是不是本地操作
    // 默认不是本地操作
    // 是本地操作则不允许直接让url参数同步到search
    useEffect(() => {
        if (isUser.current) {
            // 如果是本地更新触发的 URL 变化，跳过同步，并重置标志
            isUser.current = false;
            return;
        }
        if (!isUser && q && q !== query) {
            setQuery(q);
        }
    }, [q]);

    useEffect(() => {
        // 组件销毁时，清除定时器
        // 清理定时器以防止内存泄漏
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, []);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        //告诉handleSearch函数，当前操作是本地操作
        isUser.current = true
        // 当停下时间满足200ms时，才进行搜索
        const query = event.target.value;
        setQuery(query);
        // 清除上一次的定时器（如果存在）
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        // 设置新的定时器
        searchTimeoutRef.current = setTimeout(() => {
            handleSearch(query);// 执行搜索操作，改变url
            //本地操作结束，进入非本地操作状态（即允许url同步到search）
        }, 200);
    }
    return (
        <Input value={query} onChange={handleChange} type="text" placeholder="请输入进行检索...." className={`hover:shadow-xl duration-400 ease-in-out ${className}`} />
    )
}