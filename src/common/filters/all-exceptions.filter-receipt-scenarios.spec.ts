import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter - Receipt Extractor Scenarios', () => {
  let filter: AllExceptionsFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;
  let loggerWarnSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);

    // Mock logger methods
    loggerWarnSpy = jest.spyOn(filter['logger'], 'warn').mockImplementation();
    loggerErrorSpy = jest.spyOn(filter['logger'], 'error').mockImplementation();

    // Mock response object
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock request object
    mockRequest = {
      url: '/extract-receipt-details',
      method: 'POST',
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
    loggerWarnSpy.mockRestore();
    loggerErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('Receipt File Validation Errors', () => {
    it('should handle missing file error', () => {
      const exception = new BadRequestException('No file provided');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No file provided',
        error: 'Bad Request',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 400 - No file provided',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          status: 400,
          response: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'No file provided',
            error: 'Bad Request',
          },
        },
      );
    });

    it('should handle invalid file type error', () => {
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

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 400 - Invalid file type. Only .jpg, .jpeg, .png are allowed.',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          status: 400,
          response: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid file type. Only .jpg, .jpeg, .png are allowed.',
            error: 'Bad Request',
          },
        },
      );
    });

    it('should handle file size exceeded error', () => {
      const exception = new BadRequestException(
        'File too large. Maximum size is 10MB.',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'File too large. Maximum size is 10MB.',
        error: 'Bad Request',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 400 - File too large. Maximum size is 10MB.',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          status: 400,
          response: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'File too large. Maximum size is 10MB.',
            error: 'Bad Request',
          },
        },
      );
    });

    it('should handle corrupted file error', () => {
      const exception = new BadRequestException(
        'File appears to be corrupted or unreadable',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'File appears to be corrupted or unreadable',
        error: 'Bad Request',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 400 - File appears to be corrupted or unreadable',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          status: 400,
          response: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'File appears to be corrupted or unreadable',
            error: 'Bad Request',
          },
        },
      );
    });
  });

  describe('Authentication and Authorization Errors', () => {
    it('should handle missing API key error', () => {
      const exception = new UnauthorizedException('API key required');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'API key required',
        error: 'Unauthorized',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 401 - API key required',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          status: 401,
          response: {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'API key required',
            error: 'Unauthorized',
          },
        },
      );
    });

    it('should handle rate limit exceeded error', () => {
      const exception = new ForbiddenException(
        'Rate limit exceeded. Please try again later.',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Rate limit exceeded. Please try again later.',
        error: 'Forbidden',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 403 - Rate limit exceeded. Please try again later.',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          status: 403,
          response: {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Rate limit exceeded. Please try again later.',
            error: 'Forbidden',
          },
        },
      );
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection timeout', () => {
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

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unhandled Exception: Connection timeout',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          stack: exception.stack,
          exception: exception,
        },
      );

      dateSpy.mockRestore();
    });

    it('should handle database constraint violation', () => {
      const exception = new Error('Duplicate key violation');
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

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unhandled Exception: Duplicate key violation',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          stack: exception.stack,
          exception: exception,
        },
      );

      dateSpy.mockRestore();
    });
  });

  describe('AI Service Errors', () => {
    it('should handle Gemini API key error', () => {
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

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unhandled Exception: API key not provided',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          stack: exception.stack,
          exception: exception,
        },
      );

      dateSpy.mockRestore();
    });

    it('should handle Gemini quota exceeded error', () => {
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

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unhandled Exception: Quota exceeded',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          stack: exception.stack,
          exception: exception,
        },
      );

      dateSpy.mockRestore();
    });

    it('should handle AI model parsing error', () => {
      const exception = new Error('Unable to parse receipt content');
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

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unhandled Exception: Unable to parse receipt content',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          stack: exception.stack,
          exception: exception,
        },
      );

      dateSpy.mockRestore();
    });
  });

  describe('Receipt Processing Errors', () => {
    it('should handle receipt not found in image error', () => {
      const exception = new NotFoundException(
        'No receipt detected in the provided image',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No receipt detected in the provided image',
        error: 'Not Found',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 404 - No receipt detected in the provided image',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          status: 404,
          response: {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No receipt detected in the provided image',
            error: 'Not Found',
          },
        },
      );
    });

    it('should handle low quality image error', () => {
      const exception = new BadRequestException(
        'Image quality too low for processing',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Image quality too low for processing',
        error: 'Bad Request',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 400 - Image quality too low for processing',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          status: 400,
          response: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Image quality too low for processing',
            error: 'Bad Request',
          },
        },
      );
    });

    it('should handle partial extraction error', () => {
      const exception = new Error('Some receipt fields could not be extracted');
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

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unhandled Exception: Some receipt fields could not be extracted',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          stack: exception.stack,
          exception: exception,
        },
      );

      dateSpy.mockRestore();
    });
  });

  describe('System Errors', () => {
    it('should handle memory allocation error', () => {
      const exception = new Error('Out of memory');
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

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unhandled Exception: Out of memory',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          stack: exception.stack,
          exception: exception,
        },
      );

      dateSpy.mockRestore();
    });

    it('should handle service unavailable error', () => {
      const exception = new InternalServerErrorException(
        'Service temporarily unavailable',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Service temporarily unavailable',
        error: 'Internal Server Error',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 500 - Service temporarily unavailable',
        {
          path: '/extract-receipt-details',
          method: 'POST',
          status: 500,
          response: {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Service temporarily unavailable',
            error: 'Internal Server Error',
          },
        },
      );
    });
  });
});
