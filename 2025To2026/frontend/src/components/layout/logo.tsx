/**
 * Logo 组件
 * 
 * @description 全栈学习激励平台的 Logo 设计
 * 
 * 设计理念：
 * - 使用现代几何图形和渐变色彩
 * - 体现学习、成长、激励的主题
 * - 简洁、易识别、有记忆点
 * 
 * 设计元素：
 * - 渐变圆形：代表完整的学习循环
 * - 向上箭头：代表成长和进步
 * - 星星装饰：代表成就和激励
 * - 紫色到蓝色渐变：与平台主题色一致
 */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-svg"
    >
      {/* 背景圆形 - 渐变 */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      
      {/* 主圆形背景 */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="url(#logoGradient)"
        opacity="0.1"
      />
      
      {/* 内圆 - 渐变填充 */}
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="url(#logoGradient)"
      />
      
      {/* 向上箭头 - 代表成长 */}
      <path
        d="M20 12 L20 24 M14 18 L20 12 L26 18"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* 星星装饰 - 代表成就 */}
      <g transform="translate(28, 10)">
        <path
          d="M2 0 L2.5 1.5 L4 2 L2.5 2.5 L2 4 L1.5 2.5 L0 2 L1.5 1.5 Z"
          fill="url(#starGradient)"
          opacity="0.9"
        />
      </g>
      
      {/* 底部装饰点 - 代表积累 */}
      <circle cx="20" cy="28" r="1.5" fill="white" opacity="0.8" />
    </svg>
  )
}

