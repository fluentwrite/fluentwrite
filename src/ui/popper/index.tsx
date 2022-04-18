import React, { useState } from "react";
import { usePopper } from "react-popper";
import {Placement} from "@popperjs/core";

type Options = {
  placement?: Placement,
  children?: JSX.Element | JSX.Element[],
  referenceRef: HTMLElement,
  open: boolean
}

function Popper({...props}: Options) {
  const [popperRef, setPopperRef] = useState<HTMLDivElement>(null);
  const [arrowElement, setArrowElement] = useState(null);

  const { styles, attributes } = usePopper(props.referenceRef, popperRef, {
    placement: props?.placement || 'right',
    modifiers: [
      {
        name: "offset",
        enabled: true,
        options: {
          offset: [0, 10]
        }
      },
      {
        name: "arrow",
        options: { element: arrowElement },
      }
    ]
  });

  return (
    <React.Fragment>
      {props.open && <div ref={setPopperRef} style={styles.popper} className={"bg-amber-300"} {...attributes.popper}>
        <div style={styles.offset}>
          {props.children}
          <div ref={setArrowElement} style={styles.arrow} className={"bg-blue-700"}>《 </div>
        </div>
      </div>}
    </React.Fragment>
  );
}

export {Popper};
