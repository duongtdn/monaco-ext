// filepath: /home/duongtdn/work/duongtdn/monaco-ext/src/editor/__tests__/MonacoEditor.unit.test.js
"use strict"

import { editor } from 'monaco-editor'
import MonacoEditor from '../MonacoEditor'
import Editor from '../Editor.interface'

// Mock monaco-editor module
jest.mock('monaco-editor')

describe('MonacoEditor', () => {
  let monacoEditor
  let element
  let props

  beforeEach(() => {
    jest.clearAllMocks()
    element = document.createElement('div')
    props = {
      minimap: { enabled: true },
      padding: { top: 10, bottom: 10 },
      lineNumberOffset: 5,
      scrollBeyondLastLine: true,
      tabSize: 4,
      language: 'javascript',
      value: 'const test = true;',
      wordWrap: false,
      contextmenu: false,
      readOnly: true
    }

    monacoEditor = new MonacoEditor(element, props)
  })

  it('should extend Editor interface', () => {
    expect(monacoEditor).toBeInstanceOf(Editor)
  })

  it('should create monaco editor instance with correct options', () => {
    expect(editor.create).toHaveBeenCalledWith(element, {
      minimap: props.minimap,
      padding: props.padding,
      lineNumberOffset: props.lineNumberOffset,
      scrollBeyondLastLine: props.scrollBeyondLastLine,
      tabSize: props.tabSize,
      language: props.language,
      value: props.value,
      wordWrap: props.wordWrap,
      lineNumbers: expect.any(Function),
      detectIndentation: false,
      contextmenu: props.contextmenu,
      readOnly: props.readOnly
    })
  })

  it('should use default values when props are not provided', () => {
    const defaultEditor = new MonacoEditor(element)

    expect(editor.create).toHaveBeenCalledWith(element, {
      minimap: { enabled: false },
      padding: { top: 0, bottom: 0 },
      lineNumberOffset: 0,
      scrollBeyondLastLine: false,
      tabSize: 2,
      language: 'text',
      value: '',
      wordWrap: true,
      lineNumbers: expect.any(Function),
      detectIndentation: false,
      contextmenu: true,
      readOnly: false
    })
  })

  describe('static methods', () => {
    it('should call defineTheme for each theme when loadThemes is called', () => {
      const themes = [
        ['theme1', { config1: true }],
        ['theme2', { config2: false }]
      ]

      MonacoEditor.loadThemes(themes)

      expect(editor.defineTheme).toHaveBeenCalledTimes(2)
      expect(editor.defineTheme).toHaveBeenCalledWith('theme1', { config1: true })
      expect(editor.defineTheme).toHaveBeenCalledWith('theme2', { config2: false })
    })

    it('should change theme', () => {
      MonacoEditor.changeTheme('dark')

      expect(editor.setTheme).toHaveBeenCalledWith('dark')
    })

    it('should colorize element', () => {
      const args = [element, 'javascript']

      MonacoEditor.colorizeElement(...args)

      expect(editor.colorizeElement).toHaveBeenCalledWith(...args)
    })
  })

  describe('instance methods', () => {
    it('should get editor value', () => {
      const value = monacoEditor.getValue()

      expect(monacoEditor.instance.getValue).toHaveBeenCalled()
      expect(value).toBe('test content')
    })

    it('should return empty string when getValue is called without instance', () => {
      monacoEditor.instance = null

      const value = monacoEditor.getValue()

      expect(value).toBe('')
    })

    it('should call layout on instance', () => {
      monacoEditor.layout()

      expect(monacoEditor.instance.layout).toHaveBeenCalled()
    })

    it('should do nothing when layout is called without instance', () => {
      monacoEditor.instance = null

      // Should not throw error
      monacoEditor.layout()
    })

    it('should call onMouseDown on instance', () => {
      const event = { type: 'mousedown' }

      monacoEditor.onMouseDown(event)

      expect(monacoEditor.instance.onMouseDown).toHaveBeenCalledWith(event)
    })

    it('should call onDidChangeModelContent on instance', () => {
      const handler = jest.fn()

      monacoEditor.onDidChangeModelContent(handler)

      expect(monacoEditor.instance.onDidChangeModelContent).toHaveBeenCalledWith(handler)
    })

    it('should call createDecorationsCollection on instance', () => {
      const decorations = [{ range: { startLineNumber: 1 } }]

      monacoEditor.createDecorationsCollection(decorations)

      expect(monacoEditor.instance.createDecorationsCollection).toHaveBeenCalledWith(decorations)
    })

    it('should call getModel on instance', () => {
      monacoEditor.getModel()

      expect(monacoEditor.instance.getModel).toHaveBeenCalled()
    })

    it('should call updateOptions on instance', () => {
      const options = { readOnly: true }

      monacoEditor.update(options)

      expect(monacoEditor.instance.updateOptions).toHaveBeenCalledWith(options)
    })

    it('should call focus on instance', () => {
      monacoEditor.focus()

      expect(monacoEditor.instance.focus).toHaveBeenCalled()
    })

    it('should call getOption on instance', () => {
      monacoEditor.getOption('readOnly')

      expect(monacoEditor.instance.getOption).toHaveBeenCalledWith('readOnly')
    })

    it('should call getTopForLineNumber on instance', () => {
      monacoEditor.getTopForLineNumber(5)

      expect(monacoEditor.instance.getTopForLineNumber).toHaveBeenCalledWith(5)
    })

    it('should handle properly lineNumbers function', () => {
      const lineNumbersFn = editor.create.mock.calls[0][1].lineNumbers

      const result = lineNumbersFn(5)

      expect(result).toBe(10) // 5 + lineNumberOffset (5)
    })
  })
})