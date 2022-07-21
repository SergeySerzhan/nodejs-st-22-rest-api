## Description
This is simple CRUD API for managing users entities.

## Installation
You need to clone or fork this repository and run:
```bash
npm install
```
to install all dependencies.
Rename .env.example file to .env

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
You can use [Postman](https://www.postman.com/) to send requests to server:

### GET /v1/users/:id

Get user by id. Where :id is user ID in uuid v4 format. Response example:
```json
{
    "login": "sergeyserzhan",
    "age": 25,
    "id": "f7d16881-106b-420b-9b5e-d95649603884"
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

Update existing user by id. Where :id is user ID in uuid v4 format. Request should contain body in JSON format. Request body example:
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

Get array of users which login contain search string. :searchString this is string to search, limit is length of response array.
Response example:
```json
[
    {
    "login": "sergeyserzhan",
    "age": 25,
    "id": "f7d16881-106b-420b-9b5e-d95649603884"
    },
    {
    "login": "serzhansergey",
    "age": 25,
    "id": "dd9d4f33-39ba-44e9-a3c4-4c988e0bf76e"
    }
]
```

### DELETE /v1/users/:id

Delete user by id. Where :id is user ID in uuid v4 format. Response with 204 status code No-Content.

