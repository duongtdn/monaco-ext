// filepath: /home/duongtdn/work/duongtdn/monaco-ext/src/editor/__tests__/Editor.interface.unit.test.js
"use strict"

import Editor from '../Editor.interface'

describe('Editor interface', () => {
  it('should initialize with undefined instance', () => {
    const editor = new Editor(null, {})
    expect(editor.instance).toBeUndefined()
  })

  it('should get property with provided value', () => {
    const props = { testProp: 'test value' }
    const editor = new Editor(null, props)

    // Using the getProp method via a property on the instance
    const value = editor.getProp('testProp', 'default')
    expect(value).toBe('test value')
  })

  it('should get default value when property is not provided', () => {
    const editor = new Editor(null, {})

    const value = editor.getProp('nonExistentProp', 'default value')
    expect(value).toBe('default value')
  })

  it('should get default value when props is not provided', () => {
    const editor = new Editor(null, null)

    const value = editor.getProp('testProp', 'default value')
    expect(value).toBe('default value')
  })
})