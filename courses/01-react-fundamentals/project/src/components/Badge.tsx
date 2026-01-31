import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: string;
  type?: string;
}

export default function Badge({ children, variant, type }: BadgeProps) {
  return (
    <span data-badge data-variant={variant} data-type={type}>
      {children}
    </span>
  );
}
