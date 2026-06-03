import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Optional variant to change the card's appearance
   */
  variant?: "default" | "outlined" | "elevated";
  /**
   * Optional className for the card header area
   */
  headerClassName?: string;
  /**
   * Optional className for the card content area
   */
  contentClassName?: string;
  /**
   * Optional className for the card footer area
   */
  footerClassName?: string;
  /**
   * Optional header content rendered at top of card
   */
  header?: React.ReactNode;
  /**
   * Optional footer content rendered at bottom of card
   */
  footer?: React.ReactNode;
}

export function Card({
  className,
  variant = "default",
  headerClassName,
  contentClassName,
  footerClassName,
  header,
  footer,
  ...props
}: CardProps) {
  // Base classes for all card variants
  const baseClasses = "rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800";
  
  // Variant-specific classes
  const variantClasses = {
    default: "",
    outlined: "border-dashed",
    elevated: "shadow-sm dark:shadow-soft-dark hover:shadow-md transition-shadow",
  }[variant];

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses,
        className
      )}
      {...props}
    >
      {header && (
        <div className={cn("px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50", headerClassName)}>
          {header}
        </div>
      )}
      
      <div className={cn("px-6 py-6", contentClassName)}>
        {props.children}
      </div>
      
      {footer && (
        <div className={cn("px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50", footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
}

// CardHeader component for consistent header styling
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn("px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50", className)} {...props} />
  );
}

// CardContent component for consistent content styling
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn("px-6 py-6", className)} {...props} />
  );
}

// CardFooter component for consistent footer styling
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn("px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50", className)} {...props} />
  );
}