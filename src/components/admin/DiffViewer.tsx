'use client';

import React, { useMemo } from 'react';
import * as diff from 'diff';
import { cn } from '@/lib/utils'; // Assuming Shadcn or standard utility is present

export interface DiffViewerProps {
    oldString: string | undefined | null;
    newString: string | undefined | null;
    type?: 'words' | 'sentences' | 'lines' | 'json';
    className?: string;
}

export function DiffViewer({
    oldString = "",
    newString = "",
    type = 'words',
    className
}: DiffViewerProps) {

    // Memoize the diff calculation to avoid re-running on simple re-renders
    const diffResult = useMemo(() => {
        const safeOld = oldString || "";
        const safeNew = newString || "";

        // If identical, just return one un-highlighted chunk
        if (safeOld === safeNew) {
            return [{ value: safeNew }];
        }

        switch (type) {
            case 'lines':
                return diff.diffLines(safeOld, safeNew);
            case 'sentences':
                return diff.diffSentences(safeOld, safeNew);
            case 'json':
                // Stringify with formatting if it's somehow raw objects, but we expect pre-stringified JSON
                let oldJsonStr = safeOld;
                let newJsonStr = safeNew;
                try {
                    oldJsonStr = typeof oldString === 'string' ? JSON.stringify(JSON.parse(oldString), null, 2) : "Invalid JSON string";
                } catch (e) { }
                try {
                    newJsonStr = typeof newString === 'string' ? JSON.stringify(JSON.parse(newString), null, 2) : "Invalid JSON string";
                } catch (e) { }

                return diff.diffJson(oldJsonStr, newJsonStr);
            case 'words':
            default:
                return diff.diffWordsWithSpace(safeOld, safeNew);
        }
    }, [oldString, newString, type]);

    // Fast return if strings match perfectly to avoid unnecessary DOM nodes
    if (diffResult.length === 1 && !diffResult[0].added && !diffResult[0].removed) {
        return (
            <div className={cn("text-slate-600 whitespace-pre-wrap font-mono text-xs p-3 bg-slate-50/50 rounded-md border", className)}>
                {diffResult[0].value}
            </div>
        );
    }

    return (
        <div className={cn("font-mono text-xs border rounded-md overflow-hidden bg-slate-50", className)}>
            <div className="p-3 whitespace-pre-wrap leading-relaxed">
                {diffResult.map((part, index) => {
                    if (part.added) {
                        return (
                            <span key={index} className="bg-green-100 text-green-800 px-0.5 rounded-sm mx-[1px]">
                                {part.value}
                            </span>
                        );
                    }
                    if (part.removed) {
                        return (
                            <span key={index} className="bg-red-100 text-red-800 line-through px-0.5 rounded-sm mx-[1px] opacity-70">
                                {part.value}
                            </span>
                        );
                    }
                    // Unchanged text
                    return (
                        <span key={index} className="text-slate-600">
                            {part.value}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
