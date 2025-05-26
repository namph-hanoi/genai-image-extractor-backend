# Engineering Assessment Backend (NestJS)

## Project Initialization

1. Clone this repository locally

2. Create a new working branch (e.g. `git checkout -b working-branch`)

3. Set your node environment

   - Run `nvm install && nvm use`, or

   - Alternatively manually set your node to v18+ and npm to v10+

4. Run `npm install` to install dependencies

   Note: Ensure you have properly set your node version before this step

5. Run `npm run start:dev` or `npm run start:debug` to spin-up the backend

   Your backend server should be running on `localhost:3000`, unless a different port is defined in `process.env.PORT`.

   You can check that the server is running correctly by trying the base endpoint `GET http://localhost:3000`, which should return the text "Hello World!"

6. Run tests to ensure everything is working correctly:
   ```bash
   npm run test
   ```

## 🚀 Running the Project

### Prerequisites

Before running the project, ensure you have the following set up:

#### 1. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

#### 2. Database Setup
- **PostgreSQL Server**: Ensure you have a running PostgreSQL instance
- **Database Credentials**: Update the database connection details in your `.env` file to match your PostgreSQL setup

#### 3. AI Integration
- **Google AI Studio**: Register for a Google AI Studio account
- **API Key**: Obtain a `GEMINI_API_KEY` from Google AI Studio and add it to your `.env` file

#### 4. CORS Configuration
- **Frontend Origin**: Set the `ALLOW_HOSTS` environment variable in your `.env` file to include your frontend application's origin
- **Example**: `ALLOW_HOSTS=["http://localhost:5173"]`

#### 5. Build and Run Build
Remove existing build artifacts (if any) and build the application for production:
```bash
rm -rf dist && npm run build
```

Run database migrations:
```bash
npm run migration:run
```

Run the built application:
```bash
npm run start:prod
```

### 🛠️ Environment Variables

Key environment variables to configure in your `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3006` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `GEMINI_API_KEY` | Google AI Studio API key | `your-api-key-here` |
| `ALLOW_HOSTS` | Allowed CORS origins (JSON array) | `["http://localhost:5173"]` |

