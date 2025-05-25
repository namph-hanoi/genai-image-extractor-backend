import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
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
      url: '/test-endpoint',
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

  describe('HttpException handling', () => {
    it('should handle BadRequestException correctly', () => {
      const exception = new BadRequestException('Invalid input data');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid input data',
        error: 'Bad Request',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 400 - Invalid input data',
        {
          path: '/test-endpoint',
          method: 'POST',
          status: 400,
          response: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid input data',
            error: 'Bad Request',
          },
        },
      );
    });

    it('should handle NotFoundException correctly', () => {
      const exception = new NotFoundException('Resource not found');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Resource not found',
        error: 'Not Found',
      });

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'HTTP Exception: 404 - Resource not found',
        {
          path: '/test-endpoint',
          method: 'POST',
          status: 404,
          response: {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Resource not found',
            error: 'Not Found',
          },
        },
      );
    });

    it('should handle InternalServerErrorException correctly', () => {
      const exception = new InternalServerErrorException('Server error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Server error',
        error: 'Internal Server Error',
      });
    });

    it('should handle custom HttpException with custom response', () => {
      const customResponse = {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        errors: ['Field is required'],
      };
      const exception = new HttpException(
        customResponse,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(customResponse);
    });

    it('should handle HttpException with string message', () => {
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.json).toHaveBeenCalledWith('Forbidden');
    });
  });

  describe('Generic error handling', () => {
    it('should handle generic Error as internal server error', () => {
      const exception = new Error('Something went wrong');
      const mockDate = '2023-12-01T10:00:00.000Z';

      // Mock Date.toISOString()
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
        path: '/test-endpoint',
      });

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unhandled Exception: Something went wrong',
        {
          path: '/test-endpoint',
          method: 'POST',
          stack: exception.stack,
          exception: exception,
        },
      );

      dateSpy.mockRestore();
    });

    it('should handle string exception as internal server error', () => {
      const exception = 'String error message';
      const mockDate = '2023-12-01T10:00:00.000Z';

      // Mock Date.toISOString()
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
        path: '/test-endpoint',
      });

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unhandled Exception: Unknown error',
        {
          path: '/test-endpoint',
          method: 'POST',
          stack: undefined,
          exception: exception,
        },
      );

      dateSpy.mockRestore();
    });

    it('should handle null exception as internal server error', () => {
      const exception = null;
      const mockDate = '2023-12-01T10:00:00.000Z';

      // Mock Date.toISOString()
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
        path: '/test-endpoint',
      });

      dateSpy.mockRestore();
    });

    it('should handle undefined exception as internal server error', () => {
      const exception = undefined;
      const mockDate = '2023-12-01T10:00:00.000Z';

      // Mock Date.toISOString()
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
        path: '/test-endpoint',
      });

      dateSpy.mockRestore();
    });
  });

  describe('Integration scenarios', () => {
    it('should work with different request URLs', () => {
      const exception = new Error('Test error');
      const mockDate = '2023-12-01T10:00:00.000Z';

      // Update mock request URL
      mockRequest.url = '/api/v1/receipt-extractor';

      // Mock Date.toISOString()
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
        path: '/api/v1/receipt-extractor',
      });

      dateSpy.mockRestore();
    });

    it('should maintain response chaining', () => {
      const exception = new BadRequestException('Test validation error');

      filter.catch(exception, mockArgumentsHost);

      // Verify that the response methods return the response object for chaining
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Test validation error',
        error: 'Bad Request',
      });
    });

    it('should generate different timestamps for different calls', () => {
      const exception1 = new Error('First error');
      const exception2 = new Error('Second error');

      const mockDate1 = '2023-12-01T10:00:00.000Z';
      const mockDate2 = '2023-12-01T10:01:00.000Z';

      // Mock Date.toISOString() to return different values
      const dateSpy = jest
        .spyOn(Date.prototype, 'toISOString')
        .mockReturnValueOnce(mockDate1)
        .mockReturnValueOnce(mockDate2);

      filter.catch(exception1, mockArgumentsHost);
      filter.catch(exception2, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenNthCalledWith(1, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate1,
        path: '/test-endpoint',
      });

      expect(mockResponse.json).toHaveBeenNthCalledWith(2, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: mockDate2,
        path: '/test-endpoint',
      });

      dateSpy.mockRestore();
    });
  });
});
