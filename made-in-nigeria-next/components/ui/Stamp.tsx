import { CSSProperties, ReactNode } from 'react';

interface StampProps {
  children: ReactNode; // an inline SVG icon
  size?: number;
  color?: string;
  style?: CSSProperties;
}

/** The recurring "trust stamp" seal — see globals.css `.stamp` for the ring styling. */
export default function Stamp({ children, size, color, style }: StampProps) {
  const customStyle: CSSProperties = {
    ...(size ? ({ ['--sz' as string]: `${size}px` } as CSSProperties) : {}),
    ...(color ? { color } : {}),
    ...style,
  };
  return (
    <div className="stamp" aria-hidden="true" style={customStyle}>
      {children}
    </div>
  );
}
