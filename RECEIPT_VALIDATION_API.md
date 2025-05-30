# Receipt Data Validation API

## Overview

This API endpoint provides robust validation for receipt data using DTOs (Data Transfer Objects) and validation pipes to ensure data integrity and compliance with business rules.

## API Endpoint

### POST `/api/extract-receipt-details/validate-receipt-data`

Validates receipt data according to predefined business rules and data constraints.

#### Request Body

```json
{
  "id": 1,
  "date": "2023-12-25",
  "currency": "USD",
  "vendor_name": "Test Vendor",
  "total": 10.42,
  "tax": 0.42,
  "receipt_items": [
    {
      "item_name": "Item 1",
      "item_cost": 5.0
    },
    {
      "item_name": "Item 2", 
      "item_cost": 5.0
    }
  ]
}
```

#### Response

**Success (200):**
```json
{
  "message": "Receipt data validation successful",
  "data": {
    "id": 1,
    "date": "2023-12-25",
    "currency": "USD", 
    "vendor_name": "Test Vendor",
    "total": 10.42,
    "tax": 0.42,
    "receipt_items": [
      {
        "item_name": "Item 1",
        "item_cost": 5.0
      },
      {
        "item_name": "Item 2",
        "item_cost": 5.0
      }
    ]
  }
}
```

**Validation Error (400):**
```json
{
  "statusCode": 400,
  "message": "Validation failed: [error details]",
  "error": "Bad Request"
}
```

## Data Validation Rules

### ReceiptDataDto

- **id**: Must be a positive number (minimum 1)
- **date**: Must be a valid ISO date string (YYYY-MM-DD format)
- **currency**: Must be exactly 3 uppercase characters (e.g., USD, EUR, GBP)
- **vendor_name**: Required string, cannot be empty
- **total**: Must be a non-negative number (minimum 0)
- **tax**: Must be a non-negative number (minimum 0)
- **receipt_items**: Must be a non-empty array of ReceiptItemDto objects

### ReceiptItemDto

- **item_name**: Required string, cannot be empty
- **item_cost**: Must be a non-negative number (minimum 0)

## Features

### 1. Comprehensive Validation
- **Type Safety**: Automatic type conversion and validation
- **Business Rules**: Enforces business logic constraints
- **Data Sanitization**: Removes unknown properties (whitelist: true)
- **Strict Validation**: Rejects requests with non-whitelisted properties

### 2. Detailed Error Messages
- Clear, descriptive error messages for each validation failure
- Multiple validation errors are combined into a single response
- Specific field-level error reporting

### 3. Automatic Type Transformation
- Strings are automatically converted to numbers where appropriate
- Date strings are validated for proper format
- Nested object validation for receipt items

## Usage Examples

### Valid Request
```bash
curl -X POST http://localhost:3000/api/extract-receipt-details/validate-receipt-data \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "date": "2023-12-25",
    "currency": "USD",
    "vendor_name": "Coffee Shop",
    "total": 15.50,
    "tax": 1.50,
    "receipt_items": [
      {"item_name": "Latte", "item_cost": 4.50},
      {"item_name": "Sandwich", "item_cost": 9.50}
    ]
  }'
```

### Invalid Request (Bad Currency)
```bash
curl -X POST http://localhost:3000/api/extract-receipt-details/validate-receipt-data \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "date": "2023-12-25",
    "currency": "us",
    "vendor_name": "Coffee Shop",
    "total": 15.50,
    "tax": 1.50,
    "receipt_items": [
      {"item_name": "Latte", "item_cost": 4.50}
    ]
  }'
```

## Implementation Details

### Technologies Used
- **NestJS**: Framework for building scalable Node.js applications
- **class-validator**: Decorator-based validation library
- **class-transformer**: Type transformation and serialization
- **Custom Validation Pipes**: For additional business logic validation

### Validation Pipeline
1. **Request Reception**: Incoming JSON is received
2. **Type Transformation**: Plain objects converted to DTO classes
3. **Validation**: All decorators are processed and validated
4. **Business Logic**: Additional custom validations (e.g., total calculation check)
5. **Response**: Success response or detailed error message

### Error Handling
- Automatic error collection and formatting
- HTTP 400 status for validation failures
- Detailed error messages for debugging
- Graceful handling of unexpected errors

## Testing

The API includes comprehensive test coverage:
- Valid data acceptance
- Invalid currency format rejection
- Negative cost rejection
- Empty array rejection
- Missing field validation
- Invalid date format handling

Run tests with:
```bash
npm test -- receipt-extractor-validation.spec.ts
```
