import React from "react";

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500/60";

  const variantStyles = {
    primary:
      "bg-accent-500 text-white hover:bg-accent-600 dark:bg-accent-400 dark:hover:bg-accent-500",
    secondary:
      "bg-bg-alt text-fg border border-edge hover:bg-edge hover:border-edge-strong",
    ghost: "text-fg-secondary hover:text-fg hover:bg-bg-alt",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2",
  };

  const disabledStyles = disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
