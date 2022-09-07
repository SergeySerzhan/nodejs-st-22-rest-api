## Description

This is simple CRUD API for managing users entities.

## Docker

You can run application with [Docker](https://www.docker.com/). To do this you need to run a command:
```bash
docker-compose up
```

To stop running containers you need to run a command:
```bash
docker-compose down
```

## Installation

You need to clone or fork this repository and run:

```bash
npm install
```

to install all dependencies.

Install DB [PostgreSQL](https://www.postgresql.org/) on your machine or use a free web hosting services for PostgreSQL (https://www.heroku.com/postgresor https://www.elephantsql.com/plans.html).

Rename .env.example file to .env. You need to change .env file and provide your PostgreSQL database credentials.

To create and migrate new Users and Groups tables in your database you can run:

```bash
npm run sl:migrate
```

To seed existing Users and Groups table with data you can run:

```bash
npm run sl:seed
```

## Running the app

```bash
# development
npm run start:dev

# production
npm run start:prod

# build
npm run build
```

Application starts on PORT 3000 (you can change this in .env file), default URL http://localhost:3000

## Usage

You can use [Postman](https://www.postman.com/) to send requests to server. All endpoints (except POST /v1/auth/login and POST /v1/users) are protected, that means you need authorize (login), and endpoints require permissions (except POST /v1/groups/:id - addUsersToGroup).

You can view a documentation by request:

### GET /v1/docs

<details>
<summary>Users endpoints</summary>

### GET /v1/users/:id

Get user by id. Where :id is user ID in uuid v4 format. Require 'READ' permission. Response example:

```json
{
  "login": "sergeyserzhan",
  "age": 25,
  "id": "f7d16881-106b-420b-9b5e-d95649603884",
  "groups": [
    {
      "name": "admin",
      "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"],
      "id": "f7d16881-106b-420b-9b5e-d95649603884"
    }
  ]
}
```

### POST /v1/users

Create user. Request should contain body in JSON format:

```json
{
  "login": "sergeyserzhan",
  "password": "12345678sergey",
  "age": 25
}
```

Response example:

```json
{
  "login": "sergeyserzhan",
  "age": 25,
  "id": "f7d16881-106b-420b-9b5e-d95649603884"
}
```

### PUT /v1/users/:id

Update existing user by id. Where :id is user ID in uuid v4 format. Request should contain body in JSON format. Require 'WRITE' permission. Request body example:

```json
{
  "login": "sergeyserzhan",
  "password": "12345678sergey",
  "age": 25
}
```

Response example:

```json
{
  "login": "sergeyserzhan",
  "age": 25,
  "id": "f7d16881-106b-420b-9b5e-d95649603884"
}
```

### GET /v1/users?search=:searchString&limit=:limitNum

Get array of users which login contain search string. :searchString this is string to search, limit is length of response array. Require 'READ' permission.
Response example:

```json
[
  {
    "login": "sergeyserzhan",
    "age": 25,
    "id": "f7d16881-106b-420b-9b5e-d95649603884",
    "groups": [
      {
        "name": "admin",
        "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"],
        "id": "f7d16881-106b-420b-9b5e-d95649603884"
      }
    ]
  },
  {
    "login": "serzhansergey",
    "age": 25,
    "id": "dd9d4f33-39ba-44e9-a3c4-4c988e0bf76e",
    "groups": [
      {
        "name": "admin",
        "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"],
        "id": "f7d16881-106b-420b-9b5e-d95649603884"
      }
    ]
  }
]
```

### DELETE /v1/users/:id

Delete user by id. Where :id is user ID in uuid v4 format. Require 'DELETE' permission. Response with 204 status code No-Content.

</details>

<details>
<summary>Groups endpoints</summary>

### GET /v1/groups/:id

Get group by id. Where :id is group ID in uuid v4 format. Require 'READ' permission. Response example:

```json
{
  "name": "admin",
  "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"],
  "id": "f7d16881-106b-420b-9b5e-d95649603884",
  "users": [
    {
      "login": "sergeyserzhan",
      "age": 25,
      "id": "f7d16881-106b-420b-9b5e-d95649603884"
    }
  ]
}
```

### GET /v1/groups

Get all groups. Require 'READ' permission. Response example:

```json
[
  {
    "name": "admin",
    "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"],
    "id": "f7d16881-106b-420b-9b5e-d95649603884",
    "users": [
      {
        "login": "sergeyserzhan",
        "age": 25,
        "id": "f7d16881-106b-420b-9b5e-d95649603884"
      }
    ]
  },
  {
    "name": "user",
    "permissions": ["READ", "WRITE"],
    "id": "dd9d4f33-39ba-44e9-a3c4-4c988e0bf76e",
    "users": [
      {
        "login": "sergeyserzhan",
        "age": 25,
        "id": "f7d16881-106b-420b-9b5e-d95649603884"
      }
    ]
  }
]
```

### POST /v1/groups

Create group. Request should contain body in JSON format:

```json
{
  "name": "admin",
  "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"]
}
```

Response example:

```json
{
  "name": "admin",
  "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"],
  "id": "f7d16881-106b-420b-9b5e-d95649603884"
}
```

### PUT /v1/groups/:id

Update existing user by id. Where :id is group ID in uuid v4 format. Request should contain body in JSON format, where all fields are optional. Require 'WRITE' permission. Request body example:

```json
{
  "name": "admin",
  "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"]
}
```

Response example:

```json
{
  "name": "admin",
  "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"],
  "id": "f7d16881-106b-420b-9b5e-d95649603884"
}
```

### DELETE /v1/groups/:id

Delete group by id. Where :id is group ID in uuid v4 format. Require 'DELETE' permission. Response with 204 status code No-Content.

### POST /v1/groups/:id

Add users to group. Where :id is group ID in uuid v4 format. Request should contain body in JSON format. Request body example:

```json
{
  "userIds": [
    "109156be-c4fb-41ea-b1b4-efe1671c5836",
    "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
  ]
}
```

Response example:

```json
{
  "name": "admin",
  "permissions": ["READ", "WRITE", "DELETE", "UPLOAD_FILES"],
  "id": "f7d16881-106b-420b-9b5e-d95649603884",
  "users": [
    {
      "login": "sergeyserzhan",
      "age": 25,
      "id": "f7d16881-106b-420b-9b5e-d95649603884"
    }
  ]
}
```

</details>

<details>
<summary>Auth endpoints</summary>

### POST /v1/auth/login

Login user. Request should contain body in JSON format. Request body example:

```json
{
    "login": "sergeyserzhan",
    "password": "12345678qwe"
}
```

Response example: 
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YjFkZWI0ZC0zYjdkLTRiYWQtOWJkZC0yYjBkN2IzZGNiNmQiLCJpYXQiOjE1MTYyMzkwMjJ9.A7RPWdhfOusPgTTbdZSskLRezAHR4yDzoa2Enyxhwlc"
}
```

</details>
