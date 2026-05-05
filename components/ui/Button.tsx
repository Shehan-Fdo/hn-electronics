import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const variants = {
  primary: "border border-ink bg-ink text-white hover:bg-white hover:text-ink",
  secondary: "border border-line bg-white text-ink hover:border-ink",
  ghost: "border border-transparent bg-transparent text-ink hover:border-line",
  whatsapp: "border border-whatsapp bg-whatsapp text-white hover:bg-white hover:text-ink"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base"
};

type ClassProps = Omit<CommonProps, "children">;

function classes({ variant = "primary", size = "md", fullWidth, className }: ClassProps) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );
}

export function Button({ children, variant, size, fullWidth, className, ...props }: ButtonProps) {
  return (
    <button className={classes({ variant, size, fullWidth, className })} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  variant,
  size,
  fullWidth,
  className,
  href,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={classes({ variant, size, fullWidth, className })} href={href} {...props}>
      {children}
    </Link>
  );
}
