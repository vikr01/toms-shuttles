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

### Google Maps API Usage

[You'll need an API key for Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key). Set the API key as an environment variable `API_KEY`:

```bash
# .env file
API_KEY=<my-api-key>
```

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
