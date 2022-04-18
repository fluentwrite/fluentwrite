import React from "react";

export const CodeElement = ((props, ref) => {
  return (
    <pre style={{background: 'lightgray'}}>
          <code>{props.children}</code>
        </pre>
  )
})
