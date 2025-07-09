import type {
  ComponentProps,
  ForwardRefExoticComponent,
  SVGProps,
} from "react";

import * as Icons from "lucide-react";

type FREC = ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
type IconType = FREC | undefined;

export function DynamicIcon({
  icon = "diamond",
  ...props
}: {
  icon?: string;
} & ComponentProps<'svg'>) {
  const IconComponent: FREC = (Icons[
    icon as keyof typeof Icons
  ] as IconType) ?? Icons.Diamond;
  return IconComponent ? <IconComponent {...props} /> : null;
}

