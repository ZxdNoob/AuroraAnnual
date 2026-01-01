import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名
 * 
 * @description 使用 clsx 和 tailwind-merge 合并类名，确保 Tailwind 类名正确合并
 * @param inputs - 类名数组
 * @returns 合并后的类名字符串
 * 
 * @example
 * ```typescript
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 * cn('bg-red-500', condition && 'bg-blue-500') // 根据条件返回不同类名
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

