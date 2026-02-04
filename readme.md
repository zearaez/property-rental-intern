# Boilerplate

Boilerplate for nodejs ( typescript )

# Project file structure and pattern

Project is structured based on Component-based Approach ( Inside each folder you organize files related to that specific feature, such as controller.ts, service.ts, socket.ts, routes.ts, schema.ts etc)

## Running project

-   Note: use yarn to setup the project

## Dependencies

-   "node": ">20.17.0"
-   "npm": ">10.8.2"
-   postgresql
-   redis
-   "yarn": ">1.22.18"

## Enviroment Variable

-   everything necessary is mentioned in .env.example file

## Development

```
yarn install
yarn migrate
yarn generate
yarn gen:docs ( to generate a swagger documentation )
yarn seed ( to generate seeders at first )
yarn dev
or
user docker build and up
```

## Folder Structure

```
├── src
│   ├── app.ts
│   ├── components
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.dto.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.router.ts
│   │   │   ├── auth.schema.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validator.ts
│   │   ├── file
│   │   │   ├── file.controller.ts
│   │   │   ├── file.router.ts
│   │   │   └── file.service.ts
│   │   ├── firebase
│   │   │   └── firebase.service.ts
│   │   └── user
│   │       ├── user.controller.ts
│   │       ├── user.dto.ts
│   │       ├── user.interface.ts
│   │       ├── user.router.ts
│   │       ├── user.schema.ts
│   │       ├── user.service.ts
│   │       ├── user.socket.ts
│   │       └── user.validator.ts
│   │   ├── index.ts
│   ├── config
│   │   └── config.ts
│   ├── errors
│   │   └── apiErrors.ts
│   ├── helpers
│   │   ├── azure_blob.ts
│   │   ├── firebase.ts
│   │   ├── generator.ts
│   │   ├── jwt.ts
│   │   ├── logger.ts
│   │   ├── parser.ts
│   │   └── validator.ts
│   ├── interfaces
│   │   ├── email.d.ts
│   │   ├── error.d.ts
│   │   └── response.d.ts
│   ├── middlewares
│   │   ├── auth.middleware.ts
│   │   ├── pagination.middleware.ts
│   │   ├── socket.middleware.ts
│   │   └── uploader.middleware.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── v1
│   │       └── index.ts
│   ├── server.ts
│   ├── service
│   │   └── socket
│   │       ├── controller
│   │       │   ├── ****
│   │       └── socket.service.ts
│   ├── swagger.ts
│   ├── swagger_output.json
│   └── utils
│       ├── asyncWrapper.ts
│       ├── auth.ts
│       ├── handlers.ts
│       ├── mail.ts
│       ├── query.ts
│       └── socketWrapper.ts
```
