import React, {createRef, useCallback, useMemo, useState} from 'react'
import {
  Editable,
  ReactEditor,
  Slate,
  useFocused,
  useSelected,
  useSlateStatic,
  withReact
} from 'slate-react'
import {
  createEditor,
  Descendant,
  Editor,
  Element,
  Point,
  Range,
  Text,
  Transforms
} from 'slate'
import {withHistory} from 'slate-history'

import {
  withImages,
  withShortcuts,
} from "src/plugins";
import {ElementRender} from "src/elements";

const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{fontWeight: props.leaf.bold ? 'bold' : 'normal'}}
    >
      {props.children}
    </span>
  )
}

// Define our own custom set of helpers.
const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n['bold'] === true,
      universal: true,
    })

    return !!match
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n['type'] === 'code',
    })

    return !!match
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      {bold: isActive ? null : true},
      {match: n => Text.isText(n), split: true}
    )
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      // @ts-ignore
      {type: isActive ? null : 'code'},
      {match: n => Editor.isBlock(editor, n)}
    )
  },
}


// Define a leaf rendering function that is memoized with `useCallback`.
const renderLeaf = props => {
  return <Leaf {...props} />
}

const App = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback(props => <ElementRender {...props} />, [])

  let slate = createEditor();
  slate = withHistory(slate);
  slate = withReact(slate);
  slate = withShortcuts(slate);
  slate = withImages(slate);

  const editor = useMemo(
    () => slate, []
  )

  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);
  const onClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  return (
    <>
      <Slate editor={editor} value={value} children={[]} onChange={
        value => {
          setValue(value)
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          if (isAstChange) {
            // Save the value to Local Storage.
            // const content = JSON.stringify(value)
            // localStorage.setItem('content', content)
          }
        }}>
        <Editable
          renderElement={renderElement}
          placeholder="Write some markdown..."
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Tab') {
              event.preventDefault()
              editor.insertText('  ')
            }
            if (event.key === '/') {
              if (editor.selection !== null && editor.selection.anchor !== null) {
                setTimeout(() => {
                  const target = (event.target as HTMLDivElement).children[editor.selection.anchor.path[0]];
                  if(target.textContent === '/') {
                    setAnchorEl(target as HTMLElement)
                    setOpen(true)
                  }
                }, 0);
              }
            }
            if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
              event.preventDefault()
              CustomEditor.toggleBoldMark(editor)
            }
          }}
        />

        {/*<Popover*/}
        {/*  open={open}*/}
        {/*  anchorEl={anchorEl}*/}
        {/*  onClose={onClose}*/}
        {/*  anchorOrigin={{*/}
        {/*    vertical: 'bottom',*/}
        {/*    horizontal: 'left',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Card>*/}
        {/*    <CardContent>*/}
        {/*      <Stack*/}
        {/*        direction="row"*/}
        {/*        divider={<Divider orientation="vertical" flexItem />}*/}
        {/*        spacing={2}*/}
        {/*      >*/}
        {/*        <Box>*/}
        {/*          <Btn onClick={() => {*/}
        {/*            editor.undo();*/}
        {/*            editor.insertFragment([])*/}
        {/*            onClose()*/}
        {/*            setTimeout(() => {*/}
        {/*              editor.insertFragment([*/}
        {/*                {*/}
        {/*                  type: 'paragraph',*/}
        {/*                  children: [*/}
        {/*                    {*/}
        {/*                      text:*/}
        {/*                        'Insert',*/}
        {/*                    },*/}
        {/*                  ],*/}
        {/*                }*/}
        {/*              ])*/}
        {/*              Transforms.move(editor)*/}
        {/*            }, 0)*/}
        {/*          }}>Insert</Btn>*/}
        {/*        </Box>*/}
        {/*        <Box>*/}
        {/*          <Btn onClick={() => {*/}
        {/*            editor.undo();*/}
        {/*            editor.insertFragment([])*/}
        {/*            onClose()*/}
        {/*            const element: Descendant[] = [*/}
        {/*              {*/}
        {/*                type: 'heading-two',*/}
        {/*                children: [*/}
        {/*                  {*/}
        {/*                    text:*/}
        {/*                      'heading-two',*/}
        {/*                  },*/}
        {/*                ],*/}
        {/*              }*/}
        {/*            ]*/}
        {/*            setTimeout(() => {*/}
        {/*              editor.insertFragment(element)*/}
        {/*              Transforms.move(editor)*/}
        {/*            }, 0)*/}
        {/*          }}>H2</Btn>*/}
        {/*        </Box>*/}
        {/*      </Stack>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</Popover>*/}
      </Slate>
    </>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{text: 'A wise quote.'}],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Order when you start a line with "## " you get a level-two heading, like this:',
      },
    ],
  },
  {
    type: 'heading-two',
    children: [{text: 'Try it out!'}],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
      },
    ],
  },
  // {
  //     type: 'image',
  //     url: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
  //     children: [
  //         {
  //             text: ''
  //         },
  //     ],
  // },
]

export default App
