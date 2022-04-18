import React, {
  useCallback,
  useMemo,
  useState
} from 'react'
import {
  Editable,
  ReactEditor,
  Slate,
  withReact
} from 'slate-react'
import {
  createEditor,
  Descendant,
  Node
} from 'slate'
import {withHistory} from 'slate-history'

import {
  withImages,
  withShortcuts,
} from "src/plugins";
import {ElementRender} from "src/elements";
import {Card, Popper, IconButton} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import {
  EditorHelper,
  RenderLeaf
} from "./editorHelper";

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
      <div className={"bg-amber-200 p-2"}>
        <Slate editor={editor} value={value} onChange={value => {
          setValue(value)
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          if (isAstChange) {
            // Save the value to Local Storage.
            // const content = JSON.stringify(value)
            // localStorage.setItem('content', content)
            // value.map(n => Node.string(n)).join('\n')
          }
        }}>
          <Editable
            renderElement={renderElement}
            placeholder="Write some markdown..."
            renderLeaf={RenderLeaf}
            spellCheck
            autoFocus={true}
            onKeyDown={(event) => {
              if (event.key === 'Tab') {
                event.preventDefault()
                editor.insertText('  ')
              }
              if (event.key === '/') {
                if (editor.selection !== null && editor.selection.anchor !== null) {
                  setTimeout(() => {
                    const target = (event.target as HTMLDivElement).children[editor.selection.anchor.path[0]];
                    if(target.textContent === '/' && target.hasChildNodes()) {
                      setAnchorEl(target.childNodes[0] as HTMLElement)
                      setOpen(true)
                    }
                  }, 0);
                }
              }
              if(event.key === 'Backspace') {
                setOpen(false)
              }
              if ((event.metaKey || event.ctrlKey) && event.key === '`') {
                event.preventDefault();
                EditorHelper.toggleCodeBlock(editor);
              }
              if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
                event.preventDefault()
                EditorHelper.toggleBoldMark(editor)
              }
              if ((event.metaKey || event.ctrlKey) && event.key === 'i') {
                event.preventDefault()
                EditorHelper.toggleItalicMark(editor)
              }
            }}
          />

          <Popper
            placement={'right'}
            open={open}
            anchorEl={anchorEl}>
            <Card style={{width: '400px', height: '300px', padding: '6px'}}>
              <IconButton size="small" autoFocus={true} tabIndex={0} onClick={() => {
                onClose()
                editor.deleteBackward('word');
                editor.insertFragment([
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text:
                          'Insert',
                      },
                    ],
                  }
                ])
                // Transforms.move(editor)
                ReactEditor.focus(editor);
              }} aria-label="home">
                <HomeIcon color="primary" fontSize={'small'} />
              </IconButton>
            </Card>
          </Popper>
        </Slate>
      </div>
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
