# Tom's Shuttle Service - Backend

[![Dependency Status](https://img.shields.io/david/vikr01/toms-shuttles.svg?label=dependencies&path=packages/backend)](https://david-dm.org/vikr01/toms-shuttles?path=packages/backends)
[![DevDependency Status](https://img.shields.io/david/dev/vikr01/toms-shuttles.svg?label=devDependencies&path=packages/backend)](https://david-dm.org/vikr01/toms-shuttles?path=packages/backend&type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/vikr01/toms-shuttles/badge.svg?targetFile=packages/backend/package.json)](https://snyk.io/test/github/vikr01/toms-shuttles?targetFile=packages/backend/package.json)

## Getting Started

Make sure your current working directory is this folder.

If you're in [the root of the project](../..), the command would be:

```bash
cd packages/backend
```

Alternatively, you can use `yarn workspace toms-shuttles-backend <command>` instead of `yarn <command>` for any command documented below.

### Choosing a specific port

To specify a port, set an environment variable `PORT` first:

```bash
export PORT=3000
```

In this case, the server will be launched on [port 3000](http://localhost:3000).

Alternatively, you can set your `PORT` environment variable in the `.env` file generated from [`.env.example`](./.env.example) after installation.

```bash
# .env file
PORT=3000
```

By default, the development server will be launched on [port 2000](http://localhost:2000).

### Database Usage

This project requires a database to work. Any database supported by `typeorm` will work, but you'll need to [install the corresponding driver](https://github.com/typeorm/typeorm#installation):

```bash
yarn add <my-driver>
```

By default, the project comes set up for MySQL. If you're not using a MySQL database, you may want to remove its driver:

```bash
yarn remove mysql
```

You'll also need to update the corresponding database environment variables:

```bash
# .env file
DB_DRIVER=mysql # the database driver
DB_PORT=3306 # the database port
DB_HOST=sample_host # the database host
DB_USERNAME=sample_username # a username to access the database with
DB_PASSWORD=sample_password # the password for the corresponding user
DB_DATABASE=sample_database_name # the name of the database being used
```

NOTE: If you don't want to launch a database, you can use [`sql.js`](https://github.com/kripken/sql.js/).

##### Synchronization

You're probably going to want your database to synchronize during development -- having the database change to fit the schema set by the code.

To do this, you'll want to set the `SYNCHRONIZE` environment variable to `true`:

```bash
# .env file
SYNCHRONIZE=true

# command line
yarn cross-env SYNCHRONIZE=true <command>
```

For example, to run the dev server:

```bash
yarn cross-env SYNCHRONIZE=true yarn dev
```

### Hashing

Passwords need to be hashed before being stored to the database. The project uses [the `createHmac` function](https://nodejs.org/api/crypto.html#crypto_crypto_createhmac_algorithm_key_options) provided by [the built-in `crypto` module](https://nodejs.org/api/crypto.html).

You'll need the following:

- An algorithm for hashing the passwords. Some examples are `'sha256'`, `'sha512'`, and `'md5'` but you can [find more with OpenSSL](https://en.wikipedia.org/wiki/OpenSSL#Algorithms).
- A unique key for hashing. This can be whatever you want (i.e. `'foobar'`). **Warning**: This key should be kept secure to prevent user accounts from being broken into.
- A [digestion type](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings). This gets the result of the hash in a certain chracter encoding. Some examples are `'utf8'`, `'base64'`, and `'binary'`. See [the API](https://nodejs.org/api/crypto.html#crypto_hash_digest_encoding) for more details.

Once you have those, you'll need to set their corresponding environment variables:

```bash
# .env file
HASH_ALGO=sha256 # the algorithm for hashing passwords
HASH_KEY=foobar # the unique key for hashing
DIGESTION_TYPE=utf8 # the digestion type
```

### Session Secret

Like with any other web application, a session secret is needed. This can be any key you want it to be, but should be kept secure. (i.e. `'foobarsecret'`)

You'll need to set the `SESSION_SECRET` environment variable as well:

```bash
# .env file
SESSION_SECRET=foobarsecret
```

### Google Maps API Usage

[You'll need an API key for Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key). Set the API key as an environment variable `API_KEY`:

```bash
# .env file
API_KEY=<my-api-key>
```

## Environment Variables

There are a number of **required** environment variables in this project. If you don't have one of them, the application is likely to crash.

All of the environment variables you should have set are:

- `'PORT'`
- `'DB_DRIVER'`
- `'DB_HOST'`
- `'DB_USERNAME'`
- `'DB_PASSWORD'`
- `'DB_DATABASE'`
- `'DB_TYPE'`
- `'HASH_ALGO'`
- `'HASH_KEY'`
- `'DIGESTION_TYPE'`
- `'SESSION_SECRET'`
- `'API_KEY'`

If you're missing any of these, please double check the instructions in [_Getting Started_](#getting-started).

## Run in Development Mode

To start the development server, run:

```bash
yarn dev
```

Then, navigate your browser to `localhost` with the port you specified ([`http://localhost:2000`](http://localhost:2000) if you're using the default).

## Run in Production Mode

First build the package by running:

```bash
yarn build
```

Then start the application in production by running:

```bash
yarn start
```

Then, navigate your browser to `localhost` with the port you specified ([`http://localhost:2000`](http://localhost:2000) if you're using the default).
