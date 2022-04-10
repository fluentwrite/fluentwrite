import React, {PropsWithChildren, Ref} from "react";
import {BaseProps} from "../../interfaces";
import {OrNull} from "../../types";

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<{
      active: boolean
      reversed: boolean
    } & BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      className={`${className}`}
    />
  )
)
