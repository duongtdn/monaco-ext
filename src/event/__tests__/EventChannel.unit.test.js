import EventChannel from '../EventChannel';

describe('EventChannel', () => {
  let eventChannel;

  beforeEach(() => {
    eventChannel = new EventChannel();
  });

  describe('event listeners', () => {
    it('should call registered event handlers when event is emitted', () => {
      // Arrange
      const handler = jest.fn();
      eventChannel.addListener('testEvent', handler);

      // Act
      eventChannel.emit('testEvent', 'arg1', 'arg2');

      // Assert
      expect(handler).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should not call handlers for other events', () => {
      // Arrange
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      eventChannel.addListener('event1', handler1);
      eventChannel.addListener('event2', handler2);

      // Act
      eventChannel.emit('event1', 'data');

      // Assert
      expect(handler1).toHaveBeenCalledWith('data');
      expect(handler2).not.toHaveBeenCalled();
    });

    it('should call multiple handlers for the same event', () => {
      // Arrange
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      eventChannel.addListener('sameEvent', handler1);
      eventChannel.addListener('sameEvent', handler2);

      // Act
      eventChannel.emit('sameEvent', 'data');

      // Assert
      expect(handler1).toHaveBeenCalledWith('data');
      expect(handler2).toHaveBeenCalledWith('data');
    });
  });

  describe('removeListener', () => {
    it('should remove a specific listener from an event', () => {
      // Arrange
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      eventChannel.addListener('testEvent', handler1);
      eventChannel.addListener('testEvent', handler2);

      // Act
      eventChannel.removeListener('testEvent', handler1);
      eventChannel.emit('testEvent', 'data');

      // Assert
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith('data');
    });

    it('should do nothing when removing a non-existent handler', () => {
      // Arrange
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      eventChannel.addListener('testEvent', handler1);

      // Act - Should not throw
      eventChannel.removeListener('testEvent', handler2);
      eventChannel.emit('testEvent', 'data');

      // Assert
      expect(handler1).toHaveBeenCalledWith('data');
    });

    it('should do nothing when removing a handler from a non-existent event', () => {
      // Arrange
      const handler = jest.fn();

      // Act - Should not throw
      eventChannel.removeListener('nonExistentEvent', handler);

      // Assert - No error means test passes
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for a specific event', () => {
      // Arrange
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const handler3 = jest.fn();
      eventChannel.addListener('event1', handler1);
      eventChannel.addListener('event1', handler2);
      eventChannel.addListener('event2', handler3);

      // Act
      eventChannel.removeAllListeners('event1');
      eventChannel.emit('event1', 'data1');
      eventChannel.emit('event2', 'data2');

      // Assert
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(handler3).toHaveBeenCalledWith('data2');
    });

    it('should remove all listeners for all events when no event name is provided', () => {
      // Arrange
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      eventChannel.addListener('event1', handler1);
      eventChannel.addListener('event2', handler2);

      // Act
      eventChannel.removeAllListeners();
      eventChannel.emit('event1', 'data1');
      eventChannel.emit('event2', 'data2');

      // Assert
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('hookListener', () => {
    it('should transform event arguments through hooks', () => {
      // Arrange
      const handler = jest.fn();
      const hook = jest.fn((arg1, arg2) => [arg1.toUpperCase(), arg2 * 2]);

      eventChannel.addListener('testEvent', handler);
      eventChannel.hookListener('testEvent', hook);

      // Act
      eventChannel.emit('testEvent', 'hello', 5);

      // Assert
      expect(hook).toHaveBeenCalledWith('hello', 5);
      expect(handler).toHaveBeenCalledWith('HELLO', 10);
    });

    it('should chain multiple hooks in order', () => {
      // Arrange
      const handler = jest.fn();
      const hook1 = jest.fn((arg) => [arg + 1]);
      const hook2 = jest.fn((arg) => [arg * 2]);

      eventChannel.addListener('testEvent', handler);
      eventChannel.hookListener('testEvent', hook1);
      eventChannel.hookListener('testEvent', hook2);

      // Act
      eventChannel.emit('testEvent', 5);

      // Assert
      expect(hook1).toHaveBeenCalledWith(5);
      expect(hook2).toHaveBeenCalledWith(6);
      expect(handler).toHaveBeenCalledWith(12);
    });
  });

  describe('removeHookListener', () => {
    it('should remove a specific hook from an event', () => {
      // Arrange
      const handler = jest.fn();
      const hook1 = jest.fn((arg) => [arg + 1]);
      const hook2 = jest.fn((arg) => [arg * 2]);

      eventChannel.addListener('testEvent', handler);
      eventChannel.hookListener('testEvent', hook1);
      eventChannel.hookListener('testEvent', hook2);

      // Act
      eventChannel.removeHookListener('testEvent', hook1);
      eventChannel.emit('testEvent', 5);

      // Assert
      expect(hook1).not.toHaveBeenCalled();
      expect(hook2).toHaveBeenCalledWith(5);
      expect(handler).toHaveBeenCalledWith(10);
    });

    it('should do nothing when removing a non-existent hook', () => {
      // Arrange
      const handler = jest.fn();
      const hook1 = jest.fn((arg) => [arg + 1]);
      const hook2 = jest.fn((arg) => [arg * 2]);

      eventChannel.addListener('testEvent', handler);
      eventChannel.hookListener('testEvent', hook1);

      // Act - Should not throw
      eventChannel.removeHookListener('testEvent', hook2);
      eventChannel.emit('testEvent', 5);

      // Assert
      expect(hook1).toHaveBeenCalledWith(5);
      expect(handler).toHaveBeenCalledWith(6);
    });

    it('should do nothing when removing a hook from a non-existent event', () => {
      // Arrange
      const hook = jest.fn();

      // Act - Should not throw
      eventChannel.removeHookListener('nonExistentEvent', hook);

      // Assert - No error means test passes
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex event flow with multiple listeners and hooks', () => {
      // Arrange
      const event1Handler1 = jest.fn();
      const event1Handler2 = jest.fn();
      const event2Handler = jest.fn();

      const event1Hook = jest.fn((arg) => [arg * 2]);

      eventChannel.addListener('event1', event1Handler1);
      eventChannel.addListener('event1', event1Handler2);
      eventChannel.addListener('event2', event2Handler);

      eventChannel.hookListener('event1', event1Hook);

      // Act
      eventChannel.emit('event1', 5);
      eventChannel.emit('event2', 'data');

      // Assert
      expect(event1Hook).toHaveBeenCalledWith(5);
      expect(event1Handler1).toHaveBeenCalledWith(10);
      expect(event1Handler2).toHaveBeenCalledWith(10);
      expect(event2Handler).toHaveBeenCalledWith('data');
    });

    it('should not affect other events when modifying listeners', () => {
      // Arrange
      const event1Handler = jest.fn();
      const event2Handler = jest.fn();
      const event2Hook = jest.fn((arg) => [arg.toUpperCase()]);

      eventChannel.addListener('event1', event1Handler);
      eventChannel.addListener('event2', event2Handler);
      eventChannel.hookListener('event2', event2Hook);

      // Act
      eventChannel.removeAllListeners('event1');
      eventChannel.emit('event1', 'data1');
      eventChannel.emit('event2', 'data2');

      // Assert
      expect(event1Handler).not.toHaveBeenCalled();
      expect(event2Hook).toHaveBeenCalledWith('data2');
      expect(event2Handler).toHaveBeenCalledWith('DATA2');
    });
  });
});