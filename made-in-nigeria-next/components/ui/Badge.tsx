import { ReactNode } from 'react';

type BadgeVariant = 'verified' | 'trending' | 'new';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

export default function Badge({ variant, children }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
