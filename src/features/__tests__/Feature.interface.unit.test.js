import Feature from '../Feature.interface';

describe('Feature interface', () => {
  let feature;
  let mockEditor;
  let mockEventChannel;

  beforeEach(() => {
    feature = new Feature();
    mockEditor = {
      someEditorMethod: jest.fn()
    };
    mockEventChannel = {
      addChannel: jest.fn().mockReturnValue('mockChannel'),
      emit: jest.fn()
    };
  });

  it('should inject editor instance and event channel', () => {
    feature.inject(mockEditor, mockEventChannel);

    expect(feature.editor).toBe(mockEditor);
    expect(feature.eventChannel).toBe(mockEventChannel);
  });

  it('should call activate method when injected', () => {
    const activateSpy = jest.spyOn(feature, 'activate');

    feature.inject(mockEditor, mockEventChannel);

    expect(activateSpy).toHaveBeenCalled();
  });

  it('should create an event channel', () => {
    feature.eventManager = { addChannel: jest.fn().mockReturnValue('testChannel') };

    const result = feature.createEventChannel('testChannelName');

    expect(feature.eventManager.addChannel).toHaveBeenCalledWith('testChannelName');
    expect(feature.event).toBe('testChannel');
    expect(result).toBe('testChannel');
  });

  it('should have empty activate and deactivate methods by default', () => {
    expect(feature.activate).toBeDefined();
    expect(feature.deactivate).toBeDefined();

    // Should not throw errors
    feature.activate();
    feature.deactivate();
  });
});