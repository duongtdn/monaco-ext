"use strict"

import Feature from "./Feature.interface";

export default class HighLight extends Feature {

  decorators

  activate = () => {
    this.eventChannel.addListener('editor.highlight', lines => {
      this.decorators && this.decorators.clear();
      if (lines?.length && lines?.length > 0) {
        this.decorators = this.applyHighLightDecoration(lines);
      }
    })
  }

  deactivate = () => {
    this.decorators && this.decorators.clear();
    this.eventChannel.removeAllListeners('editor.highlight');
  }

  applyHighLightDecoration = (lines) => {
    if (lines) {
      const lineNumberOffset = this.editor.props.lineNumberOffset;
      const highlights = lines.map(line => line - lineNumberOffset);
      return this.editor.createDecorationsCollection(
        highlights.map(
          index => ({
            range: { startLineNumber: index, startColumn: 1, endLineNumber: index, endColumn: 1 },
            options: {
              isWholeLine: true,
              className: 'highlight-code-line',
            }
          })
        )
      );
    } else {
      return 0;
    }
  }

}
