"use strict"

import { editor } from 'monaco-editor';

import Feature from "./Feature.interface";

export default class AutoResizeHeight extends Feature {


  activate = () => {
    const height = this.calculateHeight();
    this.eventChannel.emit('editor.height', height);
  }

  deactivate = () => {
  }

  calculateHeight = () => {
    const padding = this.editor.getOption(editor.EditorOption.padding);
    const lineHeight = this.editor.getOption(editor.EditorOption.lineHeight);
    const lineCount = this.editor.getModel()?.getLineCount() || 1;
    const calculatedHeight = this.editor.getTopForLineNumber(lineCount + 1) + lineHeight + padding.top + padding.bottom;
    return calculatedHeight;
  }

}
