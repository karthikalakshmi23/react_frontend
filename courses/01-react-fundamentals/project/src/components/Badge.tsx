import React from 'react'

export interface BadgeProps {
  children?: React.ReactNode
  variant?: 'tag' | 'category' | 'priority'
  type?: string
}

export default function Badge({
  children,
  variant = 'tag',
  type,
}: BadgeProps) {
  return (
    <span
      data-variant={variant}
      data-type={type}
    >
      {children}
    </span>
  )
}
