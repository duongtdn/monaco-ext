"use strict"

import SyntaxLoader from '../SyntaxLoader';
import TextMateService from '../TextMateService';

// Mock TextMateService
jest.mock('../TextMateService');

// Mock grammar files
jest.mock('../../syntaxes/javascript/JavaScript.tmLanguage.json', () => ({
  scopeName: 'source.js',
  name: 'JavaScript'
}), { virtual: true });

jest.mock('../../syntaxes/javascript/JavaScriptReact.tmLanguage.json', () => ({
  scopeName: 'source.js.jsx',
  name: 'JavaScript React'
}), { virtual: true });

jest.mock('../../syntaxes/python/MagicPython.tmLanguage.json', () => ({
  scopeName: 'source.python',
  name: 'Python'
}), { virtual: true });

describe('SyntaxLoader', () => {
  let mockTextMateService;

  beforeEach(() => {
    mockTextMateService = {
      loadGrammar: jest.fn().mockResolvedValue(undefined),
      registerLanguage: jest.fn().mockResolvedValue(undefined),
    };

    TextMateService.initialize.mockResolvedValue(mockTextMateService);
    TextMateService.getInstance.mockReturnValue(mockTextMateService);

    jest.clearAllMocks();
  });

  describe('grammars configuration', () => {
    it('should have correct grammar mappings', () => {
      expect(SyntaxLoader.grammars).toEqual({
        'source.js': {
          grammar: expect.objectContaining({ scopeName: 'source.js' }),
          languages: ['javascript']
        },
        'source.js.jsx': {
          grammar: expect.objectContaining({ scopeName: 'source.js.jsx' }),
          languages: ['javascriptreact']
        },
        'source.tsx': {
          grammar: expect.objectContaining({ scopeName: 'source.js.jsx' }),
          languages: ['typescriptreact']
        },
        'source.python': {
          grammar: expect.objectContaining({ scopeName: 'source.python' }),
          languages: ['python']
        }
      });
    });
  });

  describe('loadAll', () => {
    it('should initialize TextMateService and load all grammars', async () => {
      const result = await SyntaxLoader.loadAll();

      expect(TextMateService.initialize).toHaveBeenCalledTimes(1);
      expect(mockTextMateService.loadGrammar).toHaveBeenCalledTimes(4); // 4 grammars now
      expect(mockTextMateService.registerLanguage).toHaveBeenCalledTimes(4); // 1 language per grammar
      expect(result).toBe(mockTextMateService);
    });

    it('should load JavaScript grammar and register languages', async () => {
      await SyntaxLoader.loadAll();

      expect(mockTextMateService.loadGrammar).toHaveBeenCalledWith(
        'source.js',
        expect.objectContaining({ scopeName: 'source.js' })
      );
      expect(mockTextMateService.registerLanguage).toHaveBeenCalledWith('javascript', 'source.js');
    });

    it('should load Python grammar and register languages', async () => {
      await SyntaxLoader.loadAll();

      expect(mockTextMateService.loadGrammar).toHaveBeenCalledWith(
        'source.python',
        expect.objectContaining({ scopeName: 'source.python' })
      );
      expect(mockTextMateService.registerLanguage).toHaveBeenCalledWith('python', 'source.python');
    });

    it('should load JSX grammar and register languages', async () => {
      await SyntaxLoader.loadAll();

      expect(mockTextMateService.loadGrammar).toHaveBeenCalledWith(
        'source.js.jsx',
        expect.objectContaining({ scopeName: 'source.js.jsx' })
      );
      expect(mockTextMateService.registerLanguage).toHaveBeenCalledWith('javascriptreact', 'source.js.jsx');
    });

    it('should load TSX grammar and register languages', async () => {
      await SyntaxLoader.loadAll();

      expect(mockTextMateService.loadGrammar).toHaveBeenCalledWith(
        'source.tsx',
        expect.objectContaining({ scopeName: 'source.js.jsx' })
      );
      expect(mockTextMateService.registerLanguage).toHaveBeenCalledWith('typescriptreact', 'source.tsx');
    });

    it('should handle loading errors', async () => {
      TextMateService.initialize.mockRejectedValueOnce(new Error('Failed to initialize'));

      await expect(SyntaxLoader.loadAll()).rejects.toThrow('Failed to initialize');
    });

    it('should handle grammar loading errors', async () => {
      mockTextMateService.loadGrammar.mockRejectedValueOnce(new Error('Grammar loading failed'));

      await expect(SyntaxLoader.loadAll()).rejects.toThrow('Grammar loading failed');
    });
  });

  describe('loadGrammar', () => {
    it('should load specific grammar and register language', async () => {
      const result = await SyntaxLoader.loadGrammar('source.js', 'javascript');

      expect(TextMateService.getInstance).toHaveBeenCalledTimes(1);
      expect(mockTextMateService.loadGrammar).toHaveBeenCalledWith(
        'source.js',
        expect.objectContaining({ scopeName: 'source.js' })
      );
      expect(mockTextMateService.registerLanguage).toHaveBeenCalledWith('javascript', 'source.js');
      expect(result).toBe(mockTextMateService);
    });

    it('should throw error for unknown scope name', async () => {
      await expect(SyntaxLoader.loadGrammar('source.unknown', 'unknown'))
        .rejects.toThrow('Grammar not found for scope: source.unknown');
    });

    it('should handle grammar loading errors', async () => {
      mockTextMateService.loadGrammar.mockRejectedValueOnce(new Error('Loading failed'));

      await expect(SyntaxLoader.loadGrammar('source.js', 'javascript'))
        .rejects.toThrow('Loading failed');
    });

    it('should handle language registration errors', async () => {
      mockTextMateService.registerLanguage.mockRejectedValueOnce(new Error('Registration failed'));

      await expect(SyntaxLoader.loadGrammar('source.js', 'javascript'))
        .rejects.toThrow('Registration failed');
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return all supported languages', () => {
      const languages = SyntaxLoader.getSupportedLanguages();

      expect(languages).toEqual([
        'javascript',
        'javascriptreact',
        'typescriptreact',
        'python'
      ]);
    });

    it('should return unique languages', () => {
      const languages = SyntaxLoader.getSupportedLanguages();
      const uniqueLanguages = [...new Set(languages)];

      expect(languages).toEqual(uniqueLanguages);
    });
  });
});