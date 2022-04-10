import React, { useState } from "react";
import { usePopper } from "react-popper";
import {Placement} from "@popperjs/core";

type Options = {
  placement?: Placement
}

function Popper({...props}: Options) {
  const [visible, setVisibility] = useState(false);

  const [referenceRef, setReferenceRef] = useState<HTMLButtonElement>(null);
  const [popperRef, setPopperRef] = useState<HTMLDivElement>(null);
  const [arrowElement, setArrowElement] = useState(null);

  const { styles, attributes } = usePopper(referenceRef, popperRef, {
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

  function handleDropdownClick(event) {
    setVisibility(!visible);
  }

  return (
    <React.Fragment>
      <button ref={setReferenceRef} onClick={handleDropdownClick}>
        Click Me
      </button>
      {visible && <div ref={setPopperRef} style={styles.popper} className={"bg-amber-300"} {...attributes.popper}>
        <div style={styles.offset}>
          content
          <div ref={setArrowElement} style={styles.arrow} className={"bg-blue-700"}>《 </div>
        </div>
      </div>}
    </React.Fragment>
  );
}

export {Popper};
