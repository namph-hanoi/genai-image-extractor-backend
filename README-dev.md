cp .env.example .env && npm run start:dev
## Pre-requisite
- Bootstrap a PostgreSQL DB with the variables specified in the .env file.
- Run command `npm run migration:run` to create all needed tables.