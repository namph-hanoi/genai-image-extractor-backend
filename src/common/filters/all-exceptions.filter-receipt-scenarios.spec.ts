import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, HttpStatus, BadRequestException } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter - Receipt Extractor Scenarios', () => {
  let filter: AllExceptionsFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);

    // Mock response object
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock request object
    mockRequest = {
      url: '/extract-receipt-details',
    };

    // Mock ArgumentsHost
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Receipt Extractor File Validation Errors', () => {
    it('should handle file not provided error from ImageValidationPipe', () => {
      const exception = new BadRequestException('No file provided');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No file provided',
        error: 'Bad Request',
      });
    });

    it('should handle invalid file type error from ImageValidationPipe', () => {
      const exception = new BadRequestException(
        'Invalid file type. Only .jpg, .jpeg, .png are allowed.',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid file type. Only .jpg, .jpeg, .png are allowed.',
        error: 'Bad Request',
      });
    });

    it('should handle file size limit exceeded error', () => {
      const exception = new BadRequestException('File too large');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'File too large',
        error: 'Bad Request',
      });
    });
  });

  describe('Receipt Service Database Errors', () => {
    it('should handle database connection errors', () => {
      const exception = new Error('Connection timeout');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });

    it('should handle failed to save uploaded image error', () => {
      const exception = new Error('Failed to save uploaded image to database');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });

    it('should handle failed to save extracted receipt error', () => {
      const exception = new Error(
        'Failed to save extracted receipt to database',
      );
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });
  });

  describe('AI/Gemini Service Errors', () => {
    it('should handle Gemini API initialization failure', () => {
      const exception = new Error('API key not provided');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });

    it('should handle AI extraction failure', () => {
      const exception = new Error('Failed to extract data from image using AI');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });

    it('should handle JSON parsing errors from AI response', () => {
      const exception = new SyntaxError(
        'Unexpected token in JSON at position 0',
      );
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });

    it('should handle Gemini API rate limit errors', () => {
      const exception = new Error('Quota exceeded');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });
  });

  describe('File System Errors', () => {
    it('should handle file read errors', () => {
      const exception = new Error('ENOENT: no such file or directory');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });

    it('should handle file permission errors', () => {
      const exception = new Error('EACCES: permission denied');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });
  });

  describe('Service-specific Error Messages', () => {
    it('should handle receipt extraction failure with generic message', () => {
      const exception = new Error('Failed to extract receipt details.');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });

    it('should handle configuration errors', () => {
      const exception = new Error(
        'Environment variables not configured properly',
      );
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });
  });

  describe('Real-world Error Scenarios', () => {
    it('should handle corrupted image file', () => {
      const exception = new BadRequestException(
        'File is corrupted or not a valid image',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'File is corrupted or not a valid image',
        error: 'Bad Request',
      });
    });

    it('should handle network timeout errors', () => {
      const exception = new Error('Request timeout');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });

    it('should handle memory allocation errors', () => {
      const exception = new Error('JavaScript heap out of memory');
      const mockDate = '2025-05-25T10:00:00.000Z';

      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate,
        path: '/extract-receipt-details',
      });

      dateSpy.mockRestore();
    });

    it('should work with different receipt-related endpoints', () => {
      const exception = new BadRequestException('Invalid receipt format');
      mockRequest.url = '/api/v1/receipts/validate';

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid receipt format',
        error: 'Bad Request',
      });
    });
  });
});
