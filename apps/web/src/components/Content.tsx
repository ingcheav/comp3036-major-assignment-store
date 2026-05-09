import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return(
    <div className="max-w-4xl mx-auto w-full">
      {children}
    </div>
  ); 
}
