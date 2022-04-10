import React, {PropsWithChildren, Ref} from 'react'
import ReactDOM from 'react-dom'

interface BaseProps {
  className: string

  [key: string]: unknown
}

type OrNull<T> = T | null

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<{
      value: any
    } & BaseProps>,
    ref: Ref<OrNull<null>>
  ) => {
    const textLines = value.document.nodes
      .map(node => node.text)
      .toArray()
      .join('\n')
    return (
      <div
        ref={ref}
        {...props}
      >
        <div>
          Slate's value as text
        </div>
        <div>
          {textLines}
        </div>
      </div>
    )
  }
)

export const Icon = React.forwardRef(
  (
    {className, ...props}: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      className={`${className}`}
    />
  )
)

export const Instruction = React.forwardRef(
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

export const Portal = ({children}) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}
