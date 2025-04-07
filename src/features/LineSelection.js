"use strict"

import Feature from "./Feature.interface";

export default class LineSelection extends Feature {

  mouseDownEvent;

  activate = () => {
    const lineNumberOffset = this.editor.props.lineNumberOffset
    this.mouseDownEvent = this.editor.onMouseDown(e => {
      if (e.target.detail.isAfterLines === true) {
        return
      }
      this.eventChannel.emit('editor.selectLine', e.target.range.startLineNumber + lineNumberOffset)
    })
  }

  deactivate = () => {
    this.mouseDownEvent && this.mouseDownEvent.dispose()
  }

}
