import { Loader2 } from "lucide-react";

const Spinner = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <Loader2 className={`animate-spin ${className}`} style={{ width: size, height: size }} />
);

export default Spinner;
