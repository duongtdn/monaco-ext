import HighLight from '../HighLight';

describe('HighLight', () => {
  let highLight;
  let mockEditor;
  let mockEventChannel;
  let mockDecoratorsCollection;

  beforeEach(() => {
    mockDecoratorsCollection = {
      clear: jest.fn()
    };

    mockEditor = {
      createDecorationsCollection: jest.fn().mockReturnValue(mockDecoratorsCollection),
      props: {
        lineNumberOffset: 2
      }
    };

    mockEventChannel = {
      addListener: jest.fn(),
      removeAllListeners: jest.fn()
    };

    highLight = new HighLight();
    highLight.editor = mockEditor;
    highLight.eventChannel = mockEventChannel;
  });

  describe('activate', () => {
    it('should register highlight event listener', () => {
      highLight.activate();

      expect(mockEventChannel.addListener).toHaveBeenCalledWith(
        'editor.highlight',
        expect.any(Function)
      );
    });

    it('should apply highlight decoration when event triggered with lines', () => {
      const applyHighLightSpy = jest.spyOn(highLight, 'applyHighLightDecoration')
        .mockReturnValue(mockDecoratorsCollection);

      highLight.activate();

      // Get the callback function passed to addListener
      const highlightCallback = mockEventChannel.addListener.mock.calls[0][1];

      // Simulate event with lines
      highlightCallback([5, 10]);

      expect(applyHighLightSpy).toHaveBeenCalledWith([5, 10]);
      expect(highLight.decorators).toBe(mockDecoratorsCollection);
    });

    it('should clear existing decorators before applying new ones', () => {
      highLight.decorators = mockDecoratorsCollection;

      highLight.activate();

      // Get the callback function passed to addListener
      const highlightCallback = mockEventChannel.addListener.mock.calls[0][1];

      // Simulate event with lines
      highlightCallback([5, 10]);

      expect(mockDecoratorsCollection.clear).toHaveBeenCalled();
    });

    it('should not apply highlight when event triggered with empty array', () => {
      const applyHighLightSpy = jest.spyOn(highLight, 'applyHighLightDecoration');

      highLight.activate();

      // Get the callback function passed to addListener
      const highlightCallback = mockEventChannel.addListener.mock.calls[0][1];

      // Simulate event with empty array
      highlightCallback([]);

      expect(applyHighLightSpy).not.toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('should clear decorators and remove event listeners', () => {
      highLight.decorators = mockDecoratorsCollection;

      highLight.deactivate();

      expect(mockDecoratorsCollection.clear).toHaveBeenCalled();
      expect(mockEventChannel.removeAllListeners).toHaveBeenCalledWith('editor.highlight');
    });

    it('should handle case when decorators are not set', () => {
      highLight.decorators = null;

      // Should not throw
      highLight.deactivate();

      expect(mockEventChannel.removeAllListeners).toHaveBeenCalledWith('editor.highlight');
    });
  });

  describe('applyHighLightDecoration', () => {
    it('should create decorations collection with correct configuration', () => {
      const lines = [5, 10];

      highLight.applyHighLightDecoration(lines);

      // With lineNumberOffset of 2, lines 5 and 10 should be converted to 3 and 8
      const expectedDecorations = [
        {
          range: { startLineNumber: 3, startColumn: 1, endLineNumber: 3, endColumn: 1 },
          options: {
            isWholeLine: true,
            className: 'highlight-code-line'
          }
        },
        {
          range: { startLineNumber: 8, startColumn: 1, endLineNumber: 8, endColumn: 1 },
          options: {
            isWholeLine: true,
            className: 'highlight-code-line'
          }
        }
      ];

      expect(mockEditor.createDecorationsCollection).toHaveBeenCalledWith(expectedDecorations);
    });

    it('should return 0 when no lines are provided', () => {
      const result = highLight.applyHighLightDecoration(null);

      expect(result).toBe(0);
      expect(mockEditor.createDecorationsCollection).not.toHaveBeenCalled();
    });
  });
});