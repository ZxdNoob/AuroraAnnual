import { type ClassValue, clsx } from 'clsx'

/**
 * 合并 CSS 类名
 * 
 * @description 使用 clsx 合并类名
 * @param inputs - 类名数组
 * @returns 合并后的类名字符串
 * 
 * @example
 * ```typescript
 * cn('class1', 'class2') // 'class1 class2'
 * cn('class1', condition && 'class2') // 根据条件返回不同类名
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

