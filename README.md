
## Description

This backend project was created to test different technologies on frontend and provides
post creating functionality.

Project uses Sqlite db for the sake of simplicity and provides api documentation via Swagger
(you can access it via localhost:3000/swagger after app start up).
### Features

Right now project provides next functions:
1. Auth functionality. Application uses jwt access and refresh tokens for auth and allows you to register new user,
login, logout and receive refresh token.
Refresh token is persisted in memory, so after call to refresh endpoint, old refresh token will be invalidated.
Refresh token also will be invalidated after unsuccessful compression  to db persisted token, that may happen if
someone stole your refresh token.

## Installation

```bash
$ npm install

# run this command to init db
$ npx prisma migrate dev --name init
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# run database gui
$ npx prisma studio
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


