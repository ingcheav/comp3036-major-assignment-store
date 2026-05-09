import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <div>
      {/* "4. renders content with title (display the title and the children content)" */}
      <h1>{props.title}</h1>
      {props.children}
    </div>
  );
}
