/** @jsx h */

/* eslint-disable func-names */
import h from 'slate-hyperscript'
import { By, Key } from 'selenium-webdriver'
import { startSession, OSX, CHROME } from '../../../lib/saucelabs'
import { toSlateJson } from './_helpers'
import {
  endOfLine,
  endOfDoc,
  startOfDoc,
  highlightSingleSpace,
  getEditor,
  copy,
  paste,
  sleep,
  selectAll,
} from './_helpers.selenium'

let driver
let editor
// let body
let slateDocument
let pageBlocks
let actions

jest.setTimeout(40000)

describe('editor selenium', () => {
  beforeEach(async done => {
    driver = await startSession('clipboard-win-chrome', OSX, CHROME)

    // TODO: THIS PORT NEEDS TO BE CHANGED TO 8080
    await driver.get(
      process.env.LOCAL_ENV
        ? 'http://localhost:6006/iframe.html?id=editor-tests--slate-empty'
        : 'http://0.0.0.0:8080/iframe.html?id=editor-tests--slate-empty'
    )
    // editor = await driver.findElement(By.css('[contenteditable="true"]'))
    editor = await getEditor(driver)

    // body = await driver.findElement(By.css('body'))
    slateDocument = await driver.findElement(By.id('slateDocument'))
    pageBlocks = await driver.findElement(By.id('pageBlocks'))
    await editor.click()
    actions = driver.actions()
    done()
  })

  afterEach(async () => {
    await driver.quit()
  })

  it('should copy and paste an entry block', async () => {
    await editor.sendKeys('this is an example of entry text')
    await editor.sendKeys(Key.ENTER)
    await selectAll(actions)
    await copy(actions)
    await endOfLine(actions)
    await paste(actions)
    await sleep(100)

    const refIdList = JSON.parse(await pageBlocks.getText()).pageBlocks.map(
      b => b.refId
    )

    const expected = toSlateJson(
      <value>
        <document>
          <block type="ENTRY" data={{ refId: refIdList[0] }}>
            <text>this is an example of entry text</text>
          </block>
          <block type="ENTRY" data={{ refId: refIdList[1] }}>
            <text>this is an example of entry text</text>
          </block>
        </document>
      </value>
    )

    const actual = JSON.parse(await slateDocument.getText())
    expect(actual).toEqual(expected.document)
  })

  it('should copy and paste a text fragment on a new line', async () => {
    await editor.sendKeys('this is an example of entry text')
    await startOfDoc(actions)
    await highlightSingleSpace(actions)
    await highlightSingleSpace(actions)
    await highlightSingleSpace(actions)
    await highlightSingleSpace(actions)
    await copy(actions)
    await endOfLine(actions)
    await editor.sendKeys(Key.ENTER)
    await endOfDoc(actions)
    await paste(actions)
    await sleep(100)

    const refIdList = JSON.parse(await pageBlocks.getText()).pageBlocks.map(
      b => b.refId
    )

    const expected = toSlateJson(
      <value>
        <document>
          <block type="ENTRY" data={{ refId: refIdList[0] }}>
            <text>this is an example of entry text</text>
          </block>
          <block type="ENTRY" data={{ refId: refIdList[1] }}>
            <text>this</text>
          </block>
        </document>
      </value>
    )
    const actual = JSON.parse(await slateDocument.getText())
    expect(actual).toEqual(expected.document)
  })

  it('should copy and paste a text fragment on a same line', async () => {
    await editor.sendKeys('this is an example of entry text')
    await startOfDoc(actions)
    await highlightSingleSpace(actions)
    await highlightSingleSpace(actions)
    await highlightSingleSpace(actions)
    await highlightSingleSpace(actions)
    await copy(actions)
    await endOfLine(actions)
    await editor.sendKeys(' ')
    await paste(actions)

    const refIdList = JSON.parse(await pageBlocks.getText()).pageBlocks.map(
      b => b.refId
    )

    const expected = toSlateJson(
      <value>
        <document>
          <block type="ENTRY" data={{ refId: refIdList[0] }}>
            <text>this is an example of entry text this</text>
          </block>
        </document>
      </value>
    )
    const actual = JSON.parse(await slateDocument.getText())
    expect(actual).toEqual(expected.document)
  })

  it('should copy and paste a source', async () => {
    await editor.sendKeys('@this is an example of source text')
    await editor.sendKeys(Key.ENTER)
    await selectAll(actions)
    await copy(actions)
    await endOfLine(actions)
    await endOfDoc(actions)
    await paste(actions)

    const refIdList = JSON.parse(await pageBlocks.getText()).pageBlocks.map(
      b => b.refId
    )

    const expected = toSlateJson(
      <value>
        <document>
          <block type="SOURCE" data={{ refId: refIdList[1] }}>
            <text />
            <inline type="SOURCE">this is an example of source text</inline>
            <text />
          </block>
          <block type="SOURCE" data={{ refId: refIdList[1] }}>
            <text />
            <inline type="SOURCE">this is an example of source text</inline>
            <text />
          </block>
        </document>
      </value>
    )
    const actual = JSON.parse(await slateDocument.getText())
    expect(actual).toEqual(expected.document)
  })

  it('should copy and paste an entry and a source', async () => {
    await editor.sendKeys('this is an example of an entry text')
    await editor.sendKeys(Key.ENTER)
    await editor.sendKeys('@this is an example of a source text')
    await editor.sendKeys(Key.ENTER)
    await selectAll(actions)
    await copy(actions)
    // await endOfLine(actions)
    await endOfDoc(actions)
    await paste(actions)

    const refIdList = JSON.parse(await pageBlocks.getText()).pageBlocks.map(
      b => b.refId
    )

    const expected = toSlateJson(
      <value>
        <document>
          <block type="ENTRY" data={{ refId: refIdList[0] }}>
            <text>this is an example of an entry text</text>
          </block>
          <block type="SOURCE" data={{ refId: refIdList[1] }}>
            <text />
            <inline type="SOURCE">this is an example of a source text</inline>
            <text />
          </block>
          <block type="ENTRY" data={{ refId: refIdList[2] }}>
            <text>this is an example of an entry text</text>
          </block>
          <block type="SOURCE" data={{ refId: refIdList[1] }}>
            <text />
            <inline type="SOURCE">this is an example of a source text</inline>
            <text />
          </block>
        </document>
      </value>
    )
    const actual = JSON.parse(await slateDocument.getText())
    expect(actual).toEqual(expected.document)
  })
})
