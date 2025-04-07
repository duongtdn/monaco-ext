// filepath: /home/duongtdn/work/duongtdn/monaco-ext/src/editor/__tests__/ExtendableCodeEditor.unit.test.js
"use strict"

import ExtendableCodeEditor from '../ExtendableCodeEditor'
import MonacoEditor from '../MonacoEditor'
import EventChannel from '../../event/EventChannel'

// Mocks
jest.mock('../MonacoEditor')
jest.mock('../../event/EventChannel')

describe('ExtendableCodeEditor', () => {
  let editor
  let element
  let props

  beforeEach(() => {
    element = document.createElement('div')
    props = { test: 'value' }

    // Clear all mocks before each test
    jest.clearAllMocks()

    // Setup MonacoEditor mock
    MonacoEditor.mockClear()

    // Create new editor instance for each test
    editor = new ExtendableCodeEditor(element, props)
  })

  it('should initialize with Monaco editor and event channel', () => {
    expect(MonacoEditor).toHaveBeenCalledWith(element, props)
    expect(EventChannel).toHaveBeenCalled()
    expect(editor.editor).toBeDefined()
    expect(editor.props).toBe(props)
    expect(editor.eventChannel).toBeDefined()
  })

  describe('static methods', () => {
    it('should call MonacoEditor.loadThemes when loadThemes is called', async () => {
      const themes = [['theme1', {}]]
      const themesPromise = Promise.resolve(themes)
      const fn = jest.fn().mockReturnValue(themesPromise)

      MonacoEditor.loadThemes.mockImplementation(t => t)

      await ExtendableCodeEditor.loadThemes(fn)

      expect(fn).toHaveBeenCalled()
      expect(MonacoEditor.loadThemes).toHaveBeenCalledWith(themes)
    })

    it('should call MonacoEditor.changeTheme when changeTheme is called', () => {
      ExtendableCodeEditor.changeTheme('theme1')
      expect(MonacoEditor.changeTheme).toHaveBeenCalledWith('theme1')
    })

    it('should call MonacoEditor.colorizeElement when colorizeElement is called', () => {
      const args = ['arg1', 'arg2']
      ExtendableCodeEditor.colorizeElement(...args)
      expect(MonacoEditor.colorizeElement).toHaveBeenCalledWith(...args)
    })
  })

  describe('features management', () => {
    it('should add a feature', () => {
      const feature = {
        inject: jest.fn(),
        deactivate: jest.fn()
      }

      const result = editor.features.add('testFeature', feature)

      expect(editor.features.testFeature).toBe(feature)
      expect(feature.inject).toHaveBeenCalledWith(editor.editor, editor.eventChannel)
      expect(result).toBe(feature)
    })

    it('should throw error when adding feature with reserved name', () => {
      const feature = { inject: jest.fn() }

      expect(() => {
        editor.features.add('_methods', feature)
      }).toThrow("The name '_methods' is already used")
    })

    it('should throw error when adding feature with existing name', () => {
      const feature1 = { inject: jest.fn() }
      const feature2 = { inject: jest.fn() }

      editor.features.add('testFeature', feature1)

      expect(() => {
        editor.features.add('testFeature', feature2)
      }).toThrow("The name 'testFeature' is already used")
    })

    it('should remove a feature', () => {
      const feature = {
        inject: jest.fn(),
        deactivate: jest.fn()
      }

      editor.features.add('testFeature', feature)
      editor.features.remove('testFeature')

      expect(feature.deactivate).toHaveBeenCalledWith('testFeature')
      expect(editor.features.testFeature).toBeUndefined()
    })

    it('should do nothing when removing non-existent feature', () => {
      // Should not throw error
      editor.features.remove('nonExistentFeature')
    })

    it('should list all added features', () => {
      const feature1 = { inject: jest.fn() }
      const feature2 = { inject: jest.fn() }

      editor.features.add('feature1', feature1)
      editor.features.add('feature2', feature2)

      const list = editor.features.list()

      expect(list).toContain('feature1')
      expect(list).toContain('feature2')
      expect(list).not.toContain('_methods')
      expect(list).not.toContain('add')
      expect(list).not.toContain('remove')
      expect(list).not.toContain('list')
    })
  })
})