import React from "react";

export const CodeElement = React.forwardRef((props, ref) => {
  return (
    <pre style={{background: 'lightgray'}}>
          <code>{props.children}</code>
        </pre>
  )
})
