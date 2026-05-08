import type { Question } from './types';

/**
 * Resolves an image path to its final URL.
 * Defaults to the assets folder if the path is relative.
 */
export function resolveImageUrl(path: string | undefined): string {
    if (!path) return "";
    if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
    return `/src/assets/${path}`;
}

/**
 * Formats a question response for display in the summary.
 */
export function formatResponseValue(q: Question, val: any): string {
    if (val === undefined || val === null || val === "") return "Not answered";
    
    if (q.type === 'matrix') {
        return Object.entries(val as Record<string, string>)
            .map(([row, col]) => `${row}: ${col}`)
            .join(", ");
    }
    
    if (q.type === 'ranking' && Array.isArray(val)) {
        return val.join(" → ");
    }
    
    if (q.type === 'star') {
        return "★".repeat(Number(val));
    }
    
    return val.toString();
}
