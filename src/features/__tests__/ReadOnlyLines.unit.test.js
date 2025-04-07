import ReadOnlyLines from '../ReadOnlyLines';

describe('ReadOnlyLines', () => {
  let readOnlyLines;
  let mockEditor;
  let mockEventChannel;
  let mockDecoratorsCollection;
  let mockEventHandler;
  let mockModel;

  beforeEach(() => {
    mockDecoratorsCollection = {
      clear: jest.fn()
    };

    mockEventHandler = {
      dispose: jest.fn()
    };

    mockModel = {
      getLineCount: jest.fn().mockReturnValue(10),
      undo: jest.fn()
    };

    mockEditor = {
      createDecorationsCollection: jest.fn().mockReturnValue(mockDecoratorsCollection),
      onDidChangeModelContent: jest.fn().mockReturnValue(mockEventHandler),
      getModel: jest.fn().mockReturnValue(mockModel),
      props: {
        lineNumberOffset: 2
      }
    };

    mockEventChannel = {};

    readOnlyLines = new ReadOnlyLines();
    readOnlyLines.editor = mockEditor;
    readOnlyLines.eventChannel = mockEventChannel;
  });

  describe('constructor', () => {
    it('should set readOnlyLines if provided in constructor', () => {
      const lines = [1, 3, 5];
      const instance = new ReadOnlyLines(lines);

      expect(instance.readOnlyLines).toEqual(lines);
    });
  });

  describe('activate', () => {
    it('should set readOnlyLines if provided as parameter', () => {
      const lines = [2, 4, 6];

      readOnlyLines.activate(lines);

      expect(readOnlyLines.readOnlyLines).toEqual(lines);
    });

    it('should set up event handler for content changes', () => {
      const decorateReadOnlySpy = jest.spyOn(readOnlyLines, 'decorateReadOnly')
        .mockReturnValue(mockEventHandler);

      readOnlyLines.activate();

      expect(decorateReadOnlySpy).toHaveBeenCalled();
      expect(readOnlyLines.handleEvent).toBe(mockEventHandler);
    });
  });

  describe('deactivate', () => {
    it('should clear decorators and dispose event handler', () => {
      readOnlyLines.decorators = mockDecoratorsCollection;
      readOnlyLines.handleEvent = mockEventHandler;

      readOnlyLines.deactivate();

      expect(mockDecoratorsCollection.clear).toHaveBeenCalled();
      expect(mockEventHandler.dispose).toHaveBeenCalled();
    });

    it('should handle case when decorators and event handler are not set', () => {
      readOnlyLines.decorators = null;
      readOnlyLines.handleEvent = null;

      // Should not throw
      readOnlyLines.deactivate();
    });
  });

  describe('decorateReadOnly', () => {
    it('should apply decorations to specified read-only lines', () => {
      readOnlyLines.readOnlyLines = [3, 5, 7];
      const applyReadOnlySpy = jest.spyOn(readOnlyLines, 'applyReadOnlyDecoration')
        .mockReturnValue(mockDecoratorsCollection);

      readOnlyLines.decorateReadOnly();

      // With lineNumberOffset of 2, lines [3, 5, 7] should become [1, 3, 5]
      expect(applyReadOnlySpy).toHaveBeenCalledWith([1, 3, 5]);
      expect(readOnlyLines.decorators).toBe(mockDecoratorsCollection);
    });

    it('should apply decorations to all lines when readOnlyLines not specified', () => {
      readOnlyLines.readOnlyLines = null;
      const applyReadOnlySpy = jest.spyOn(readOnlyLines, 'applyReadOnlyDecoration')
        .mockReturnValue(mockDecoratorsCollection);

      readOnlyLines.decorateReadOnly();

      // Should create an array from 1 to lineCount (10)
      expect(applyReadOnlySpy).toHaveBeenCalledWith([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('should set up content change event handler', () => {
      readOnlyLines.decorateReadOnly();

      expect(mockEditor.onDidChangeModelContent).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle content changes properly', () => {
      const isChangeInReadOnlyLinesSpy = jest.spyOn(readOnlyLines, 'isChangeInReadOnlyLines')
        .mockReturnValueOnce(true)  // First change in read-only line
        .mockReturnValueOnce(false); // Second change not in read-only line

      const countNewLinesInChangeSpy = jest.spyOn(readOnlyLines, 'countNewLinesInChange')
        .mockReturnValue(2);

      readOnlyLines.readOnlyLines = [3, 5];
      readOnlyLines.decorateReadOnly();

      // Get the callback function passed to onDidChangeModelContent
      const contentChangeCallback = mockEditor.onDidChangeModelContent.mock.calls[0][0];

      // Simulate content change event
      contentChangeCallback({
        isUndoing: false,
        changes: [
          { range: { startLineNumber: 1, endLineNumber: 1 } },
          { range: { startLineNumber: 2, endLineNumber: 2 } }
        ]
      });

      expect(isChangeInReadOnlyLinesSpy).toHaveBeenCalledTimes(2);
      expect(mockModel.undo).toHaveBeenCalledTimes(1);
      expect(countNewLinesInChangeSpy).toHaveBeenCalledTimes(1);
      expect(mockDecoratorsCollection.clear).toHaveBeenCalled();
    });

    it('should not process changes when undoing', () => {
      readOnlyLines.decorateReadOnly();

      // Get the callback function passed to onDidChangeModelContent
      const contentChangeCallback = mockEditor.onDidChangeModelContent.mock.calls[0][0];

      // Simulate undoing event
      contentChangeCallback({
        isUndoing: true,
        changes: [{ range: {} }]
      });

      // Should not process changes when undoing
      expect(mockModel.undo).not.toHaveBeenCalled();
    });
  });

  describe('isChangeInReadOnlyLines', () => {
    it('should return true when change affects read-only lines', () => {
      const range = { startLineNumber: 2, endLineNumber: 4 };
      const readOnlyLinesArr = [1, 3, 5];

      const result = readOnlyLines.isChangeInReadOnlyLines(range, readOnlyLinesArr);

      expect(result).toBe(true);
    });

    it('should return false when change does not affect read-only lines', () => {
      const range = { startLineNumber: 2, endLineNumber: 2 };
      const readOnlyLinesArr = [1, 3, 5];

      const result = readOnlyLines.isChangeInReadOnlyLines(range, readOnlyLinesArr);

      expect(result).toBe(false);
    });
  });

  describe('countNewLinesInChange', () => {
    it('should calculate number of new lines in a change', () => {
      const change = {
        range: { startLineNumber: 2, endLineNumber: 3 },
        text: 'line1\nline2\nline3'
      };

      const result = readOnlyLines.countNewLinesInChange(change);

      // startLine(2) - endLine(3) + newLinesCount(2) = 1
      expect(result).toBe(1);
    });

    it('should handle case with no new lines', () => {
      const change = {
        range: { startLineNumber: 2, endLineNumber: 3 },
        text: 'single line'
      };

      const result = readOnlyLines.countNewLinesInChange(change);

      // startLine(2) - endLine(3) + newLinesCount(0) = -1
      expect(result).toBe(-1);
    });

    it('should handle case with no text', () => {
      const change = {
        range: { startLineNumber: 2, endLineNumber: 3 },
        text: ''
      };

      const result = readOnlyLines.countNewLinesInChange(change);

      // startLine(2) - endLine(3) + newLinesCount(0) = -1
      expect(result).toBe(-1);
    });
  });

  describe('applyReadOnlyDecoration', () => {
    it('should create decorations collection with correct configuration', () => {
      const lines = [2, 4];

      readOnlyLines.applyReadOnlyDecoration(lines);

      const expectedDecorations = [
        {
          range: { startLineNumber: 2, startColumn: 1, endLineNumber: 2, endColumn: 1 },
          options: {
            isWholeLine: true,
            className: 'read-only-code-line',
            inlineClassName: 'read-only-code-text'
          }
        },
        {
          range: { startLineNumber: 4, startColumn: 1, endLineNumber: 4, endColumn: 1 },
          options: {
            isWholeLine: true,
            className: 'read-only-code-line',
            inlineClassName: 'read-only-code-text'
          }
        }
      ];

      expect(mockEditor.createDecorationsCollection).toHaveBeenCalledWith(expectedDecorations);
    });

    it('should return 0 when no lines are provided', () => {
      const result = readOnlyLines.applyReadOnlyDecoration([]);

      expect(result).toBe(0);
    });
  });
});