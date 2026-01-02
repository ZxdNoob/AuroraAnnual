'use client'

import styles from './hamburger-icon.module.scss'

/**
 * 汉堡菜单图标组件（业界顶级设计）
 * 
 * @description 实现三条横杠到关闭图标（X）的平滑动画过渡
 * 
 * 设计特点：
 * - 使用三条横杠的经典汉堡菜单设计（业界标准）
 * - 采用 Material Design 缓动函数，动画流畅自然
 * - 使用 GPU 加速的 transform 属性，性能优异
 * - 精细的视觉设计：合适的间距、圆角、颜色
 * - 分别控制不同属性的过渡时间，让动画更自然
 * 
 * @param isOpen - 菜单是否打开，控制动画状态
 * 
 * @example
 * ```tsx
 * <HamburgerIcon isOpen={mobileMenuOpen} />
 * ```
 * 
 * @remarks
 * - 动画原理：
 *   1. 初始状态：三条横杠等距排列（顶部、中间、底部）
 *   2. 打开状态：
 *      - 第一条横杠：移动到中间并旋转 45 度
 *      - 第二条横杠：淡出消失（opacity: 0）
 *      - 第三条横杠：移动到中间并旋转 -45 度
 *   3. 最终形成完美的 X 形状
 * - 性能优化：
 *   - 使用 transform 和 opacity 属性（GPU 加速）
 *   - 使用 will-change 提示浏览器优化
 *   - 避免使用 left/top 等触发重排的属性
 * 
 * @see {@link https://material.io/design/motion/speed.html#easing Material Design 缓动函数}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/will-change will-change 属性}
 */
interface HamburgerIconProps {
  isOpen: boolean
}

export function HamburgerIcon({ isOpen }: HamburgerIconProps) {
  return (
    <div 
      className={`${styles.hamburgerIcon} ${isOpen ? styles.isOpen : ''}`}
      aria-label={isOpen ? '关闭菜单' : '打开菜单'}
      role="button"
      tabIndex={0}
    >
      {/* 第一条横杠：打开时移动到中间并旋转 45 度 */}
      <span className={styles.line} />
      {/* 第二条横杠：打开时淡出消失 */}
      <span className={styles.line} />
      {/* 第三条横杠：打开时移动到中间并旋转 -45 度 */}
      <span className={styles.line} />
    </div>
  )
}

