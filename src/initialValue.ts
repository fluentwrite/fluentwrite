import {Descendant} from "slate";

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Start Writing',
      },
    ],
  },
  // {
  //   type: 'block-quote',
  //   children: [{text: 'A wise quote.'}],
  // },
  // {
  //   type: 'paragraph',
  //   children: [
  //     {
  //       text:
  //         'Order when you start a line with "## " you get a level-two heading, like this:',
  //     },
  //   ],
  // },
  // {
  //   type: 'heading-two',
  //   children: [{text: 'Try it out!'}],
  // },
  // {
  //   type: 'paragraph',
  //   children: [
  //     {
  //       text:
  //         'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
  //     },
  //   ],
  // },
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


export default initialValue;
