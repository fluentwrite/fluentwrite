// Define a leaf rendering function that is memoized with `useCallback`.
import React from "react";

const Leaf = props => {
  return <span
    {...props.attributes}
    style={{
      fontWeight: props.leaf.bold ? 'bold' : 'normal',
      fontStyle: props.leaf.italic ? 'italic' : 'normal'
    }}
  >
      {props.children}
    </span>
}

export const RenderLeaf = props => {
  return <Leaf {...props} />
}
