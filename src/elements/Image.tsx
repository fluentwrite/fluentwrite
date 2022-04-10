import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic
} from "slate-react";
import {Button} from "src/ui/button";
import {Transforms} from "slate";

export const Image = ({attributes, children, element}) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        className={"text-3xl font-bold underlin"}
      >
        <img
          style={{boxShadow: `${selected ? '5px 5px' : "0px 0px"} whitesmoke`}}
          src={element.url}
        />
        <Button
          active
          onClick={() => Transforms.removeNodes(editor, {at: path})}
          className={""}
        >
          x
        </Button>

      </div>
    </div>
  )
}

//
// css`
// display: ${selected && focused ? 'inline' : 'none'};
// position: absolute;
// top: 0.5em;
// left: 0.5em;
// background-color: white;
// `
