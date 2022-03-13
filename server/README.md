# HD Computer Server

To run:

```
pnpm install
node server.js
```

1. build code: `npm build` --> create a folder name: **build**
2. create `.env` file
    ```
    DB_URL_DEV=postgresql://postgres:postgres@127.0.0.1:5432/my-db
    JWT_SECRET=12345
    NODE_ENV=development
    ```
3. ```
   cd build/
   npm install
   node server.js
   ```

_Note:_ `pnpm` can be alternated by `npm`

Priority:

    1. in command: NODE_ENV=development nodemon server.ts
    2. in .env file
