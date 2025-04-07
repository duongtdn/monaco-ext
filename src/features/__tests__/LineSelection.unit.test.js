import LineSelection from '../LineSelection';

describe('LineSelection', () => {
  let lineSelection;
  let mockEditor;
  let mockEventChannel;
  let mockMouseDownEvent;

  beforeEach(() => {
    mockMouseDownEvent = {
      dispose: jest.fn()
    };

    mockEditor = {
      onMouseDown: jest.fn().mockReturnValue(mockMouseDownEvent),
      props: {
        lineNumberOffset: 3
      }
    };

    mockEventChannel = {
      emit: jest.fn()
    };

    lineSelection = new LineSelection();
    lineSelection.editor = mockEditor;
    lineSelection.eventChannel = mockEventChannel;
  });

  describe('activate', () => {
    it('should register mouse down event handler', () => {
      lineSelection.activate();

      expect(mockEditor.onMouseDown).toHaveBeenCalledWith(expect.any(Function));
      expect(lineSelection.mouseDownEvent).toBe(mockMouseDownEvent);
    });

    it('should emit line selection event when line is clicked', () => {
      lineSelection.activate();

      // Get the callback function passed to onMouseDown
      const mouseDownCallback = mockEditor.onMouseDown.mock.calls[0][0];

      // Simulate mouse down event on a line (line 5)
      mouseDownCallback({
        target: {
          detail: { isAfterLines: false },
          range: { startLineNumber: 5 }
        }
      });

      // With lineNumberOffset of 3, line 5 should be emitted as 8
      expect(mockEventChannel.emit).toHaveBeenCalledWith('editor.selectLine', 8);
    });

    it('should not emit event when click is after lines', () => {
      lineSelection.activate();

      // Get the callback function passed to onMouseDown
      const mouseDownCallback = mockEditor.onMouseDown.mock.calls[0][0];

      // Simulate mouse down event after lines
      mouseDownCallback({
        target: {
          detail: { isAfterLines: true },
          range: { startLineNumber: 5 }
        }
      });

      expect(mockEventChannel.emit).not.toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('should dispose mouse down event handler', () => {
      lineSelection.mouseDownEvent = mockMouseDownEvent;

      lineSelection.deactivate();

      expect(mockMouseDownEvent.dispose).toHaveBeenCalled();
    });

    it('should handle case when mouse down event is not set', () => {
      lineSelection.mouseDownEvent = null;

      // Should not throw
      lineSelection.deactivate();
    });
  });
});