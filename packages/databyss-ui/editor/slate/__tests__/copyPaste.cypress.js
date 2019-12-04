/** @jsx h */

/* eslint-disable func-names */

import h from 'slate-hyperscript'
import { toSlateJson, matchExpectedJson } from './_helpers'
// import {  } from './../hotKeys'

context('Editor', () => {
  beforeEach(() => {
    cy.visit('http://0.0.0.0:6006/iframe.html?id=editor-tests--slate-empty')
    cy.get('[contenteditable="true"]')
      .as('editor')
      .focus()
    cy.get('#slateDocument').as('slateDocument')
    cy.get('#pageBlocks').as('pageBlocks')
  })

  it('renders the contenteditable container', () => {
    cy.get('@editor').should('have.attr', 'role')
  })

  // issue #116
  it('should copy text in line and paste it on same line', () => {
    cy.get('@editor')
      .type('this is an example of entry text')
      .setSelection(' entry text')
    document.execCommand('copy')
    cy.get('@editor').endOfLine()
    document.execCommand('paste')

    cy.get('@pageBlocks').then(page => {
      const refIdList = JSON.parse(page.text()).pageBlocks.map(b => b.refId)
      const expected = toSlateJson(
        <value>
          <document>
            <block type="SOURCE" data={{ refId: refIdList[0] }}>
              <text />
              <inline type="SOURCE">source and not location</inline>
              <text />
            </block>
            <block type="ENTRY" data={{ refId: refIdList[1] }} />
          </document>
        </value>
      )

      cy.get('@slateDocument').then(matchExpectedJson(expected.document))
    })
  })
})

// context('Editor', () => {
//   beforeEach(() => {
//     cy.visit('http://0.0.0.0:6006/iframe.html?id=editor-tests--slate')
//     cy.get('[contenteditable="true"]')
//       .as('editor')
//       .focus()
//     cy.get('#pageBlocks').as('pageBlocks')
//     cy.get('#slateDocument').as('slateDocument')
//   })

//   it('renders the contenteditable container', () => {
//     cy.get('@editor').should('have.attr', 'role')
//   })

//   // https://www.notion.so/databyss/Editor-crashes-on-backspace-edge-case-f3fd18b2ba6e4df190703a94815542ed
//   it('should highlight empty block and remove the block', () => {
//     cy.get('@editor')
//       .endOfDoc()
//       .previousBlock()
//       .endOfLine()
//       .newLine()
//       .type('{shift}{rightarrow}')
//       .type('{backspace}')

//     cy.get('@pageBlocks').then(page => {
//       const refIdList = JSON.parse(page.text()).pageBlocks.map(b => b.refId)
//       const expected = toSlateJson(
//         <value>
//           <document>
//             <block type="SOURCE" data={{ refId: refIdList[0] }}>
//               <text />
//               <inline type="SOURCE">
//                 Stamenov, Language Structure, Discourse and the Access to
//                 Consciousness
//               </inline>
//               <text />
//             </block>
//             <block type="ENTRY" data={{ refId: refIdList[1] }}>
//               On the limitation of third-order thought to assertion
//             </block>
//             <block type="TOPIC" data={{ refId: refIdList[2] }}>
//               <text />
//               <inline type="TOPIC">topic</inline>
//               <text />
//             </block>
//           </document>
//         </value>
//       )
//       cy.get('@slateDocument').then(matchExpectedJson(expected.document))
//     })
//   })

//   it('should delete prevoius block if atomic and backspace clicked', () => {
//     cy.get('@editor')
//       .nextBlock()
//       .startOfLine()
//       .type('{backspace}')

//     cy.get('@pageBlocks').then(page => {
//       const refIdList = JSON.parse(page.text()).pageBlocks.map(b => b.refId)
//       const expected = toSlateJson(
//         <value>
//           <document>
//             <block type="ENTRY" data={{ refId: refIdList[0] }}>
//               On the limitation of third-order thought to assertion
//             </block>
//             <block type="TOPIC" data={{ refId: refIdList[1] }}>
//               <text />
//               <inline type="TOPIC">topic</inline>
//               <text />
//             </block>
//           </document>
//         </value>
//       )
//       cy.get('@slateDocument').then(matchExpectedJson(expected.document))
//     })
//   })

//   // Case 1
//   // https://www.notion.so/databyss/Delete-doesn-t-always-work-when-text-is-selected-932220d69dc84bbbb133265d8575a123
//   it('should highlight atomic block and delete it', () => {
//     cy.get('@editor')
//       .startOfDoc()
//       .setSelection(
//         'Stamenov, Language Structure, Discourse and the Access to Consciousness'
//       )
//       .type('{backspace}')

//     cy.get('@pageBlocks').then(page => {
//       const refIdList = JSON.parse(page.text()).pageBlocks.map(b => b.refId)
//       const expected = toSlateJson(
//         <value>
//           <document>
//             <block type="ENTRY" data={{ refId: refIdList[0] }} />
//             <block type="ENTRY" data={{ refId: refIdList[1] }}>
//               On the limitation of third-order thought to assertion
//             </block>
//             <block type="TOPIC" data={{ refId: refIdList[2] }}>
//               <text />
//               <inline type="TOPIC">topic</inline>
//               <text />
//             </block>
//           </document>
//         </value>
//       )
//       cy.get('@slateDocument').then(matchExpectedJson(expected.document))
//     })
//   })
//   // case 2
//   // https://www.notion.so/databyss/Delete-doesn-t-always-work-when-text-is-selected-932220d69dc84bbbb133265d8575a123
//   it('should highlight all content and delete', () => {
//     cy.get('@editor')
//       .endOfDoc()
//       .type('{selectall}')
//       .type('{backspace}')
//     cy.get('@pageBlocks').then(page => {
//       const refIdList = JSON.parse(page.text()).pageBlocks.map(b => b.refId)
//       const expected = toSlateJson(
//         <value>
//           <document>
//             <block type="ENTRY" data={{ refId: refIdList[0] }}>
//               <text />
//             </block>
//           </document>
//         </value>
//       )

//       cy.get('@slateDocument').then(matchExpectedJson(expected.document))
//     })
//   })
//   // https://www.notion.so/databyss/Delete-doesn-t-always-work-when-text-is-selected-932220d69dc84bbbb133265d8575a123
//   it('case 3 highlight text', () => {
//     cy.get('@editor')
//       .endOfDoc()
//       .type('{selectall}')
//       .type('{backspace}')
//       .type('{backspace}')
//       .type('{rightarrow}')
//       .type('this is some text')
//       .setSelection('some ')
//       .type('{backspace}')
//       .wait(500)

//     cy.get('@pageBlocks').then(page => {
//       const refIdList = JSON.parse(page.text()).pageBlocks.map(b => b.refId)
//       const expected = toSlateJson(
//         <value>
//           <document>
//             <block type="ENTRY" data={{ refId: refIdList[0] }}>
//               this is text
//             </block>
//           </document>
//         </value>
//       )

//       cy.get('@slateDocument').then(matchExpectedJson(expected.document))
//     })
//   })

//   // https://www.notion.so/databyss/Delete-doesn-t-always-work-when-text-is-selected-932220d69dc84bbbb133265d8575a123
//   it('case 4', () => {
//     cy.get('@editor')
//       .setSelection('On the limitation of third-order thought to assertion')
//       .type('{backspace}')
//       .wait(500)

//     cy.get('@pageBlocks').then(page => {
//       const refIdList = JSON.parse(page.text()).pageBlocks.map(b => b.refId)
//       const expected = toSlateJson(
//         <value>
//           <document>
//             <block type="SOURCE" data={{ refId: refIdList[0] }}>
//               <text />
//               <inline type="SOURCE">
//                 Stamenov, Language Structure, Discourse and the Access to
//                 Consciousness
//               </inline>
//               <text />
//             </block>
//             <block type="ENTRY" data={{ refId: refIdList[1] }}>
//               <text />
//             </block>
//             <block type="TOPIC" data={{ refId: refIdList[2] }}>
//               <text />
//               <inline type="TOPIC">topic</inline>
//               <text />
//             </block>
//           </document>
//         </value>
//       )
//       cy.get('@slateDocument').then(matchExpectedJson(expected.document))
//     })
//   })
//   // https://www.notion.so/databyss/Demo-error-7-If-you-click-location-and-press-return-it-doesn-t-move-the-cursor-but-it-makes-everyth-9eaa6b3f02c04358b42f00159863a355
//   it('it should toggle location on empty line using the format menu', () => {
//     cy.get('@editor')
//       .nextBlock()
//       .startOfLine()
//       .newLine()
//       .wait(500)
//       .previousBlock()

//     cy.get('@editor')
//       .get('[data-test-block-menu="open"]')
//       .click()
//       .get('[data-test-block-menu="TOPIC"]')
//       .click()
//       .get('@editor')
//       .newLine()
//       .wait(500)

//     cy.get('@pageBlocks').then(page => {
//       const refIdList = JSON.parse(page.text()).pageBlocks.map(b => b.refId)
//       const expected = toSlateJson(
//         <value>
//           <document>
//             <block type="SOURCE" data={{ refId: refIdList[0] }}>
//               <text />
//               <inline type="SOURCE">
//                 Stamenov, Language Structure, Discourse and the Access to
//                 Consciousness
//               </inline>
//               <text />
//             </block>
//             <block type="ENTRY" data={{ refId: refIdList[1] }} />
//             <block type="ENTRY" data={{ refId: refIdList[2] }} />
//             <block type="ENTRY" data={{ refId: refIdList[3] }}>
//               On the limitation of third-order thought to assertion
//             </block>
//             <block type="TOPIC" data={{ refId: refIdList[4] }}>
//               <text />
//               <inline type="TOPIC">topic</inline>
//               <text />
//             </block>
//           </document>
//         </value>
//       )
//       cy.get('@slateDocument').then(matchExpectedJson(expected.document))
//     })
//   })
// })
