"use strict"

import { editor } from 'monaco-editor'
import Editor from "./Editor.interface";

export default class MonacoEditor extends Editor {

  constructor(element, props) {
    super(element, props);

    this.props = {
      minimap : this.getProp('minimap', {  enabled: false }),
      padding : this.getProp('padding', {  top: 0, bottom: 0 }),
      lineNumberOffset : this.getProp('lineNumberOffset', 0),
      scrollBeyondLastLine : this.getProp('scrollBeyondLastLine', false),
      tabSize : this.getProp('tabSize', 2),
      language : this.getProp('language', 'text'),
      value : this.getProp('value', ''),
      wordWrap: this.getProp('wordWrap', true),
      contextmenu: this.getProp('contextmenu', true),
      readOnly: this.getProp('readOnly', false),
    }

    this.instance = editor.create(element, {
      minimap: this.props.minimap,
      padding: this.props.padding,
      lineNumberOffset: this.props.lineNumberOffset,
      scrollBeyondLastLine: this.props.scrollBeyondLastLine,
      tabSize: this.props.tabSize,
      language: this.props.language,
      value: this.props.value,
      wordWrap: this.props.wordWrap,
      lineNumbers: (x) => x + this.props.lineNumberOffset,
      detectIndentation: false,
      contextmenu: this.props.contextmenu,
      readOnly: this.props.readOnly,
    })

  }

  static loadThemes = (themes) => {
    for (let [name, config] of themes) {
      editor.defineTheme(name, config);
    }
  }

  static changeTheme = (theme) => {
    editor.setTheme(theme)
  }

  static colorizeElement = (...args) => editor.colorizeElement(...args)

  getValue = () => this.instance && this.instance.getValue() || ''
  layout = () => this.instance && this.instance.layout()

  onMouseDown = (e) => this.instance && this.instance.onMouseDown(e)
  onDidChangeModelContent = (e) => this.instance && this.instance.onDidChangeModelContent(e)

  createDecorationsCollection = (x) => this.instance && this.instance.createDecorationsCollection(x)
  getModel = () => this.instance && this.instance.getModel()

  update = (options) => this.instance && this.instance.updateOptions(options)

  focus = () => this.instance && this.instance.focus()

  getOption = (option) => this.instance && this.instance.getOption(option)

  getTopForLineNumber = (number) => this.instance && this.instance.getTopForLineNumber(number)

	dispose = () =>this.instance && this.instance.dispose()

}
