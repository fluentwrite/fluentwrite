import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import {Transforms} from 'slate'

import {ImageElement} from '../custom-types'


const isImageUrl = url => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}


const insertImage = (editor, url) => {
  const text = {
    text: ''
  };
  const image: ImageElement = {type: 'image', url, children: [text, text]}
  Transforms.insertNodes(editor, image)
}

export const withImages = editor => {
  const {insertData, isVoid} = editor

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = data => {
    const text = data.getData('text/plain')
    const {files} = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result

            setTimeout(() => {
              insertImage(editor, url);
            }, 100);
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}
