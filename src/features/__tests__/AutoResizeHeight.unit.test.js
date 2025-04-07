import AutoResizeHeight from '../AutoResizeHeight';
import { editor } from 'monaco-editor';

jest.mock('monaco-editor', () => ({
  editor: {
    EditorOption: {
      padding: 'padding',
      lineHeight: 'lineHeight'
    }
  }
}));

describe('AutoResizeHeight', () => {
  let autoResizeHeight;
  let mockEditor;
  let mockEventChannel;
  let mockModel;

  beforeEach(() => {
    mockModel = {
      getLineCount: jest.fn().mockReturnValue(5)
    };

    mockEditor = {
      getOption: jest.fn(),
      getModel: jest.fn().mockReturnValue(mockModel),
      getTopForLineNumber: jest.fn(),
      props: {}
    };

    mockEventChannel = {
      emit: jest.fn()
    };

    autoResizeHeight = new AutoResizeHeight();
    autoResizeHeight.editor = mockEditor;
    autoResizeHeight.eventChannel = mockEventChannel;
  });

  describe('activate', () => {
    it('should calculate height and emit editor.height event', () => {
      const calculateHeightSpy = jest.spyOn(autoResizeHeight, 'calculateHeight').mockReturnValue(100);

      autoResizeHeight.activate();

      expect(calculateHeightSpy).toHaveBeenCalled();
      expect(mockEventChannel.emit).toHaveBeenCalledWith('editor.height', 100);
    });
  });

  describe('calculateHeight', () => {
    it('should calculate editor height correctly based on content', () => {
      const mockPadding = { top: 5, bottom: 5 };
      const mockLineHeight = 20;
      const mockLineCount = 5;
      const mockTopForLineNumber = 120;

      mockEditor.getOption.mockImplementation((option) => {
        if (option === editor.EditorOption.padding) return mockPadding;
        if (option === editor.EditorOption.lineHeight) return mockLineHeight;
        return null;
      });

      mockEditor.getTopForLineNumber.mockReturnValue(mockTopForLineNumber);

      const result = autoResizeHeight.calculateHeight();

      // Expected: topForLineNumber + lineHeight + padding.top + padding.bottom
      const expected = mockTopForLineNumber + mockLineHeight + mockPadding.top + mockPadding.bottom;

      expect(mockEditor.getOption).toHaveBeenCalledWith(editor.EditorOption.padding);
      expect(mockEditor.getOption).toHaveBeenCalledWith(editor.EditorOption.lineHeight);
      expect(mockEditor.getModel).toHaveBeenCalled();
      expect(mockModel.getLineCount).toHaveBeenCalled();
      expect(mockEditor.getTopForLineNumber).toHaveBeenCalledWith(mockLineCount + 1);
      expect(result).toBe(expected);
    });

    it('should handle case when model is undefined', () => {
      const mockPadding = { top: 5, bottom: 5 };
      const mockLineHeight = 20;
      const mockTopForLineNumber = 40;

      mockEditor.getOption.mockImplementation((option) => {
        if (option === editor.EditorOption.padding) return mockPadding;
        if (option === editor.EditorOption.lineHeight) return mockLineHeight;
        return null;
      });

      mockEditor.getModel.mockReturnValue(null);
      mockEditor.getTopForLineNumber.mockReturnValue(mockTopForLineNumber);

      const result = autoResizeHeight.calculateHeight();

      // When model is null, lineCount defaults to 1
      expect(mockEditor.getTopForLineNumber).toHaveBeenCalledWith(2);
      expect(result).toBe(mockTopForLineNumber + mockLineHeight + mockPadding.top + mockPadding.bottom);
    });
  });
});