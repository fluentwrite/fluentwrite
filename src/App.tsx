import React, { useState, useCallback, useMemo } from 'react'
import {Slate, Editable, withReact, useSlateStatic, ReactEditor, useSelected, useFocused} from 'slate-react'
import {
    Editor,
    Transforms,
    Range,
    Point,
    createEditor,
    Element as SlateElement,
    Descendant,
    Text
} from 'slate'
import { withHistory } from 'slate-history'
import { BulletedListElement } from './custom-types'
import withImages from "./plugins/Images";
import { Button } from './components'
import { css } from '@emotion/css'

const SHORTCUTS = {
    '*': 'list-item',
    '-': 'list-item',
    '+': 'list-item',
    '>': 'block-quote',
    '#': 'heading-one',
    '##': 'heading-two',
    '###': 'heading-three',
    '####': 'heading-four',
    '#####': 'heading-five',
    '######': 'heading-six',
    '```': 'code',
}


const Leaf = props => {
    return (
        <span
            {...props.attributes}
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
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
            { bold: isActive ? null : true },
            { match: n => Text.isText(n), split: true }
        )
    },

    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            // @ts-ignore
            { type: isActive ? null : 'code' },
            { match: n => Editor.isBlock(editor, n) }
        )
    },
}


// Define a leaf rendering function that is memoized with `useCallback`.
const renderLeaf = props => {
    return <Leaf {...props} />
}

const App = () => {
    const [value, setValue] = useState<Descendant[]>(initialValue)
    const renderElement = useCallback(props => <Element {...props} />, [])

    let slate = createEditor();
    slate = withHistory(slate);
    slate = withReact(slate);
    slate = withShortcuts(slate);
    slate = withImages(slate);

    const editor = useMemo(
        () => slate, []
    )
    return (
        <Slate editor={editor} value={value} onChange={
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
                onKeyDown={event => {
                    if (event.key === 'Tab') {
                        event.preventDefault()
                        editor.insertText('  ')
                    }
                    if (event.key === 'b') {
                        event.preventDefault()
                        CustomEditor.toggleBoldMark(editor)
                    }
                }}
            />
        </Slate>
    )
}

const withShortcuts = editor => {
    const { deleteBackward, insertText } = editor

    editor.insertText = text => {
        const { selection } = editor

        if (text === ' ' && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection
            const block = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            })
            const path = block ? block[1] : []
            const start = Editor.start(editor, path)
            const range = { anchor, focus: start }
            const beforeText = Editor.string(editor, range)
            const type = SHORTCUTS[beforeText]

            if (type) {
                Transforms.select(editor, range)
                Transforms.delete(editor)
                const newProperties: Partial<SlateElement> = {
                    type,
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => Editor.isBlock(editor, n),
                })

                if (type === 'list-item') {
                    const list: BulletedListElement = {
                        type: 'bulleted-list',
                        children: [],
                    }
                    Transforms.wrapNodes(editor, list, {
                        match: n =>
                            !Editor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                            n.type === 'list-item',
                    })
                }

                return
            }
        }

        insertText(text)
    }

    editor.deleteBackward = (...args) => {
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            })

            if (match) {
                const [block, path] = match
                const start = Editor.start(editor, path)

                if (
                    !Editor.isEditor(block) &&
                    SlateElement.isElement(block) &&
                    block.type !== 'paragraph' &&
                    Point.equals(selection.anchor, start)
                ) {
                    const newProperties: Partial<SlateElement> = {
                        type: 'paragraph',
                    }
                    Transforms.setNodes(editor, newProperties)

                    if (block.type === 'list-item') {
                        Transforms.unwrapNodes(editor, {
                            match: n =>
                                !Editor.isEditor(n) &&
                                SlateElement.isElement(n) &&
                                n.type === 'bulleted-list',
                            split: true,
                        })
                    }

                    return
                }
            }

            deleteBackward(...args)
        }
    }

    return editor
}

const CodeElement = React.forwardRef((props, ref) => {
    return (
        <pre style={{background: 'lightgray'}}>
          <code>{props.children}</code>
        </pre>
    )
})

const Image = ({ attributes, children, element }) => {
    const editor = useSlateStatic()
    const path = ReactEditor.findPath(editor, element)

    const selected = useSelected()
    const focused = useFocused()
    return (
        <div {...attributes}>
            {children}
            <div
                contentEditable={false}
                className={css`
                    position: relative;
                  `}
            >
                <img style={{boxShadow: `${selected ? '5px 5px' : "0px 0px"} whitesmoke`}}
                    src={element.url}
                />
                <Button
                    active
                    onClick={() => Transforms.removeNodes(editor, { at: path })}
                    className={css`
                    display: ${selected && focused ? 'inline' : 'none'};
                    position: absolute;
                    top: 0.5em;
                    left: 0.5em;
                    background-color: white;
                  `}
                >
                    x
                </Button>

            </div>
        </div>
    )
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'code':
            return <CodeElement {...attributes}>{children}</CodeElement>
        case 'bold':
            return <b {...attributes}>{children}</b>
        case 'image':
            return <Image {...{ attributes, children, element }} />
        default:
            return <p {...attributes}>{children}</p>
    }
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
        children: [{ text: 'A wise quote.' }],
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
        children: [{ text: 'Try it out!' }],
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
    {
        type: 'image',
        url: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
        children: [
            {
                text: ''
            },
        ],
    },
]

export default App
