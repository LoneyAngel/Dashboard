'use client';

import { Metadata } from 'next';
import { useEffect } from 'react';
export const metadata: Metadata = {
    title: 'customer界面出现错误'
};
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h2 className="text-center">出现了一个错误</h2>
            <button
                className="mt-4 rounded-md bg-blue-5[00 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                onClick={
                    () => reset()
                }
            >
                Try again
            </button>
        </main>
    );
}