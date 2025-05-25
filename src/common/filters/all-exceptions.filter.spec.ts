import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  NotFoundException,
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
});
