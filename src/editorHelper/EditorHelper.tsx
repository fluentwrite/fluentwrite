// Define our own custom set of helpers.
import {Editor, Text, Transforms} from "slate";

export const EditorHelper = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n['bold'] === true,
      universal: true,
    })

    return !!match
  },

  isItalicMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n['italic'] === true,
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
    const isActive = EditorHelper.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      {bold: isActive ? null : true},
      {match: n => Text.isText(n), split: true}
    )
  },

  toggleItalicMark(editor) {
    const isActive = EditorHelper.isItalicMarkActive(editor)
    Transforms.setNodes(
      editor,
      {italic: isActive ? null : true},
      {match: n => Text.isText(n), split: true}
    )
  },

  toggleCodeBlock(editor) {
    const isActive = EditorHelper.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      // @ts-ignore
      {type: isActive ? null : 'code'},
      {match: n => Editor.isBlock(editor, n)}
    )
  },
}
