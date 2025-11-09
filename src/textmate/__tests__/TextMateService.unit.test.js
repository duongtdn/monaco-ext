"use strict"

import TextMateService from '../TextMateService';

// Mock onigasm
jest.mock('onigasm', () => ({
  loadWASM: jest.fn().mockResolvedValue(undefined),
}));

// Mock monaco-textmate
const mockWireTmGrammars = jest.fn().mockResolvedValue(undefined);
jest.mock('monaco-textmate', () => ({
  Registry: jest.fn().mockImplementation((config) => ({
    loadGrammar: jest.fn().mockResolvedValue({ mockGrammar: true }),
  })),
  parseRawGrammar: jest.fn().mockReturnValue({ mockGrammar: true }),
  wireTmGrammars: mockWireTmGrammars,
}));

// Mock monaco-editor
global.monaco = {
  editor: {
    defineTheme: jest.fn(),
    setTheme: jest.fn(),
  },
  languages: {
    setTokensProvider: jest.fn(),
    setMonarchTokensProvider: jest.fn(),
    setLanguageConfiguration: jest.fn()
  }
};

// Mock dynamic import for WASM
global.import = jest.fn();

describe('TextMateService', () => {
  beforeEach(() => {
    // Reset the singleton instance
    TextMateService._instance = null;
    TextMateService._initialized = false;
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize the service as singleton', async () => {
      const service1 = await TextMateService.initialize();
      const service2 = await TextMateService.initialize();

      expect(service1).toBe(service2);
      expect(TextMateService._initialized).toBe(true);
    });

    it('should load WASM during initialization', async () => {
      const { loadWASM } = require('onigasm');

      await TextMateService.initialize();

      expect(loadWASM).toHaveBeenCalledTimes(1);
    });

    it('should create Registry during initialization', async () => {
      const { Registry } = require('monaco-textmate');

      await TextMateService.initialize();

      expect(Registry).toHaveBeenCalledTimes(1);
      expect(Registry).toHaveBeenCalledWith({
        getGrammarDefinition: expect.any(Function)
      });
    });

    it('should throw error if WASM loading fails', async () => {
      const { loadWASM } = require('onigasm');
      loadWASM.mockRejectedValueOnce(new Error('WASM loading failed'));

      await expect(TextMateService.initialize()).rejects.toThrow('WASM loading failed');
    });
  });

  describe('getInstance', () => {
    it('should return instance after initialization', async () => {
      const service = await TextMateService.initialize();
      const instance = TextMateService.getInstance();

      expect(instance).toBe(service);
    });

    it('should throw error if not initialized', () => {
      expect(() => TextMateService.getInstance()).toThrow('TextMateService must be initialized first');
    });
  });

  describe('loadGrammar', () => {
    let service;

    beforeEach(async () => {
      service = await TextMateService.initialize();
    });

    it('should load and store grammar', async () => {
      const grammarData = { scopeName: 'source.js', name: 'JavaScript' };
      const mockGrammar = { mockGrammar: true };

      // Mock the registry's loadGrammar method
      service._registry.loadGrammar = jest.fn().mockResolvedValue(mockGrammar);

      const result = await service.loadGrammar('source.js', grammarData);

      expect(service._grammars.get('source.js')).toBe(grammarData);
      expect(service._registry.loadGrammar).toHaveBeenCalledWith('source.js');
      expect(result).toBe(mockGrammar);
    });

    it('should handle grammar loading errors', async () => {
      // Mock the registry's loadGrammar method to throw an error
      service._registry.loadGrammar = jest.fn().mockRejectedValue(new Error('Grammar loading failed'));

      await expect(service.loadGrammar('source.js', {})).rejects.toThrow('Grammar loading failed');
    });
  });

  describe('registerLanguage', () => {
    let service;

    beforeEach(async () => {
      service = await TextMateService.initialize();
      mockWireTmGrammars.mockClear();
    });

    it('should register language with monaco', async () => {
      await service.registerLanguage('javascript', 'source.js');

      expect(mockWireTmGrammars).toHaveBeenCalledWith(
        global.monaco,
        service._registry,
        new Map([['javascript', 'source.js']])
      );
    });

    it('should handle registration errors', async () => {
      mockWireTmGrammars.mockRejectedValueOnce(new Error('Registration failed'));

      await expect(service.registerLanguage('javascript', 'source.js'))
        .rejects.toThrow('Registration failed');
    });
  });

  describe('getRegistry', () => {
    it('should return the registry instance', async () => {
      const service = await TextMateService.initialize();
      const registry = service.getRegistry();

      expect(registry).toBe(service._registry);
    });
  });
});