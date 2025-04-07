"use strict"

import Feature from "./Feature.interface";

export default class ReadOnlyLines extends Feature {

  readOnlyLines = undefined

  decorators
  handleEvent

  constructor(readOnlyLines) {
    super()
    if (readOnlyLines) {
      this.readOnlyLines = readOnlyLines
    }
  }

  activate = (readOnlyLines) => {
    if (readOnlyLines) {
      this.readOnlyLines = readOnlyLines
    }
    this.handleEvent = this.decorateReadOnly()
  }

  deactivate = () => {
    this.decorators && this.decorators.clear();
    this.handleEvent && this.handleEvent.dispose();
  }

  decorateReadOnly = () => {
    const lineNumberOffset = this.editor.props.lineNumberOffset
    let readOnlyLines =
      this.readOnlyLines && this.readOnlyLines.map(line => line - lineNumberOffset)
      ||
      createStepArray(this.editor.getModel().getLineCount());
    this.decorators =  this.applyReadOnlyDecoration(readOnlyLines);
    return this.editor.onDidChangeModelContent(
      e => {
        if (e.isUndoing) { return; }
        this.decorators && this.decorators.clear();
        for (const change of e.changes) {
          if (this.isChangeInReadOnlyLines(change.range, readOnlyLines)) {
            this.editor.getModel().undo();
            continue;
          }
          const numOfNewLinesInChange = this.countNewLinesInChange(change);
          if (numOfNewLinesInChange.length != 0) {
            readOnlyLines = readOnlyLines.map(
              index => index > change.range.startLineNumber? index + numOfNewLinesInChange : index
            );
          }
        }
        this.decorators = this.applyReadOnlyDecoration(readOnlyLines);
      }
    );
  }

  isChangeInReadOnlyLines = (range, readOnlyLines) => {
    const { startLineNumber, endLineNumber } = range;
    // Check if any line in the range from startLineNumber to endLineNumber is readonly
    for (let line = startLineNumber; line <= endLineNumber; line++) {
      if (readOnlyLines.indexOf(line) !== -1) {
        return true;
      }
    }
    return false;
  }

  countNewLinesInChange = (change) => {
    const { startLineNumber, endLineNumber } = change.range;
    const { text } = change;
    const newLinesCount = ((text || '').match(/\n/g) || []).length;
    return startLineNumber - endLineNumber + newLinesCount;
  }

  applyReadOnlyDecoration = (readOnlyLines) => {
    if (readOnlyLines && readOnlyLines.length > 0)
      return this.editor.createDecorationsCollection(
        readOnlyLines.map(
          index => ({
            range: { startLineNumber: index, startColumn: 1, endLineNumber: index, endColumn: 1 },
            options: {
              isWholeLine: true,
              className: 'read-only-code-line',
              inlineClassName: `read-only-code-text`,
            }
          })
        )
      );
    else
      return 0;
  }

}

function createStepArray(N) {
  return Array.from({ length: N }, (_,x) => x + 1);
}
