/**
 * 分类线条手绘风 SVG 图标
 * 风格：细线条、圆润、日式简约
 */

interface IconProps {
  size?: number;
  color?: string;
}

const defaultProps: IconProps = {
  size: 40,
  color: '#7BA05B',
};

export function AquaticIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 24c4-6 10-10 18-10s14 4 18 10" />
      <path d="M40 24c-2 4-6 8-12 8-4 0-7-2-10-4-3-2-6-4-10-2" />
      <path d="M40 24l6-2" />
      <path d="M40 24l5 3" />
      <circle cx="14" cy="22" r="1.5" fill={color} stroke="none" />
      <path d="M8 32c3-1 6 0 9 1s6 2 9 1" opacity="0.4" />
      <path d="M10 36c3-1 6 0 9 1s6 2 9 1" opacity="0.25" />
    </svg>
  );
}

export function BreakfastIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="22" cy="30" rx="16" ry="8" />
      <path d="M6 30v2c0 4.4 7.2 8 16 8s16-3.6 16-8v-2" />
      <path d="M38 26c3 0 6 1 6 4s-3 4-6 4" />
      <path d="M16 14c0-3 2-5 2-8" />
      <path d="M22 14c0-3 2-5 2-8" />
      <path d="M28 14c0-3 2-5 2-8" />
    </svg>
  );
}

export function CondimentIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h12v6H18z" />
      <path d="M16 14h16l2 28H14L16 14z" />
      <path d="M20 4h8v4h-8z" />
      <path d="M20 22v12" />
      <path d="M28 22v12" />
      <path d="M14 28h20" />
    </svg>
  );
}

export function DessertIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 28h32" />
      <path d="M12 28l2 12h20l2-12" />
      <path d="M10 28c0-10 6-16 14-16s14 6 14 16" />
      <circle cx="24" cy="8" r="2" />
      <path d="M18 20c2-2 4-1 6 0" />
      <path d="M26 18c2-2 4-1 6 0" />
    </svg>
  );
}

export function DrinkIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 6h16v2H16z" />
      <path d="M17 8l-1 32h16l-1-32" />
      <path d="M20 8v4c0 2 2 3 4 3s4-1 4-3V8" />
      <circle cx="24" cy="24" r="2" />
      <path d="M20 30c2 1 4 1 4 1s2 0 4-1" />
      <path d="M32 18l6-2" />
      <path d="M32 22l5 1" />
    </svg>
  );
}

export function MeatIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="26" cy="26" rx="16" ry="12" transform="rotate(-15 26 26)" />
      <path d="M14 18c-4-4-6-8-4-12" />
      <path d="M10 6c2 0 4 2 4 4" />
      <path d="M20 22c2 2 4 3 8 2" />
      <path d="M22 28c2 1 4 1 6 0" />
      <circle cx="18" cy="24" r="1" fill={color} stroke="none" />
    </svg>
  );
}

export function SemiFinishedIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="12" width="28" height="28" rx="4" />
      <path d="M10 20h28" />
      <path d="M18 12V8" />
      <path d="M30 12V8" />
      <path d="M18 28h12" />
      <path d="M18 34h8" />
    </svg>
  );
}

export function SoupIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 24h36" />
      <path d="M8 24c0 10 7 16 16 16s16-6 16-16" />
      <path d="M42 24c2 0 4 1 4 3s-2 3-4 3" />
      <path d="M16 16c0-3 1.5-5 1.5-7" />
      <path d="M24 14c0-3 1.5-5 1.5-7" />
      <path d="M32 16c0-3 1.5-5 1.5-7" />
    </svg>
  );
}

export function StapleIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="24" cy="30" rx="16" ry="8" />
      <path d="M8 30v2c0 4.4 7.2 8 16 8s16-3.6 16-8v-2" />
      <path d="M14 28c2-6 6-14 10-14s8 8 10 14" />
      <path d="M20 20c1-1 3-1 4 0" />
      <path d="M26 18c1-1 3-1 4 0" />
    </svg>
  );
}

export function VegetableIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 40V22" />
      <path d="M24 22c-8-2-14-8-12-14 4 2 10 4 12 14" />
      <path d="M24 22c8-2 14-8 12-14-4 2-10 4-12 14" />
      <path d="M24 30c-6-1-10-5-9-10 3 1 7 3 9 10" />
      <path d="M24 30c6-1 10-5 9-10-3 1-7 3-9 10" />
    </svg>
  );
}

export function DefaultCategoryIcon({ size = defaultProps.size!, color = defaultProps.color! }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="16" />
      <path d="M16 20h16" />
      <path d="M16 28h16" />
      <path d="M24 12v24" />
    </svg>
  );
}

/**
 * 品牌 Logo 图标
 */
export function BrandLogo({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* 碗 */}
      <path d="M12 42h56" stroke="#7BA05B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 42c0 16 10 24 24 24s24-8 24-24" stroke="#7BA05B" strokeWidth="2.5" strokeLinecap="round" />
      {/* 筷子 */}
      <line x1="30" y1="10" x2="26" y2="38" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="10" x2="34" y2="38" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
      {/* 热气 */}
      <path d="M44 30c0-4 3-6 3-10" stroke="#7BA05B" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M50 32c0-4 3-6 3-10" stroke="#7BA05B" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

/**
 * 根据分类 id 获取对应的图标组件
 */
export function getCategoryIcon(categoryId: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    'aquatic': <AquaticIcon />,
    'breakfast': <BreakfastIcon />,
    'condiment': <CondimentIcon />,
    'dessert': <DessertIcon />,
    'drink': <DrinkIcon />,
    'meat_dish': <MeatIcon />,
    'semi-finished': <SemiFinishedIcon />,
    'soup': <SoupIcon />,
    'staple': <StapleIcon />,
    'vegetable_dish': <VegetableIcon />,
  };

  return iconMap[categoryId] || <DefaultCategoryIcon />;
}
