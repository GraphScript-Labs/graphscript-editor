import type { ComponentProps, ReactNode } from "react";

import "./style.css";

export function Glass({
  children,
  className = "",
  ...props
}: {
  children?: ReactNode;
  className?: string;
} & ComponentProps<"div">) {
  return (<>
    <div
      className={`glass-card ${className}`}
      {...props}
    >
      <div className="glass-card-background" />
      {children}
    </div>
  </>);
}

