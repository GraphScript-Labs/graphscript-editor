import type { InputHTMLAttributes, Ref } from "react";

import "./style.css";

export function Input({
  ref,
  ...props
}: {
  ref?: Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (<>
    <input ref={ref} className="glass-input" {...props} />
  </>);
}

