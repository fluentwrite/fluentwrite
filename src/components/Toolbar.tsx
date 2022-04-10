import React, {PropsWithChildren, Ref} from "react";
import {BaseProps} from "../interfaces";
import {OrNull} from "../types";

export const Menu = React.forwardRef(
  (
    {className, ...props}: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      ref={ref}
      className={`${className}`}
    />
  )
)

export const Toolbar = React.forwardRef(
  (
    {className, ...props}: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <Menu
      {...props}
      ref={ref}
      className={`${className}`}
    />
  )
)
