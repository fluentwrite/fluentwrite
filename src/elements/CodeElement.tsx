import React from "react";

export const CodeElement = React.forwardRef(((props: React.ComponentProps<any>, ref) => {
  return (
    <pre style={{background: 'lightgray'}}>
      <code>{props.children}</code>
    </pre>
  )
}))
