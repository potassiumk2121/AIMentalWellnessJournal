import { ReactNode } from "react";

interface WellnessCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "accent";
}

const WellnessCard = ({ title, children, className = "", variant = "default" }: WellnessCardProps) => {
  const variantClass = {
    default: "bg-card border-border hover:shadow-md",
    gradient: "bg-gradient-to-br from-card to-secondary/20 border-primary/20 hover:shadow-lg hover:border-primary/30",
    accent: "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 hover:shadow-md",
  }[variant];

  return (
    <div className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 ${variantClass} ${className}`}>
      {title && <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground opacity-70">{title}</h3>}
      {children}
    </div>
  );
};

export default WellnessCard;
