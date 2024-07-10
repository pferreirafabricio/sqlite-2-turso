# 🐂 sqlite-2-turso

A simple JS script to migrate a local SQLite database to a Turso database on the cloud.

<img alt="license url" src="https://img.shields.io/badge/license%20-MIT-1C1E26?style=for-the-badge&labelColor=1C1E26&color=8E562E">

## Overview

This project provides a straightforward JavaScript utility for migrating data from a local SQLite database to a Turso database hosted in the cloud. It leverages Node.js and a set of dependencies to facilitate the migration process, ensuring a seamless transition of data from a local storage mechanism to a scalable, cloud-based solution.

## Features

- Easy configuration through environment variables.
- Automated migration of tables and data.
- Logging support for monitoring the migration process.
- Utilizes the `@libsql/client` for interacting with the Turso database.
- Supports SQLite3 for local database interactions.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- Access to a Turso database instance.

### Installation

1. Clone the repository:

```sh
git clone https://github.com/pferreirafabricio/sqlite-2-turso.git
```

2. Install the dependencies:

```sh
cd sqlite-2-turso
npm install
```

3. Configure your environment variables by copying the .env.example file to .env and filling in the necessary details:

```sh
cp .env.example .env
```

### Configuration

The migration script can be configured via environment variables. Here are the variables you can set:

- `SOURCE_DATABASE_PATH`: The path to your local SQLite database file.
- `TURSO_DATABASE_URL`: The URL to your Turso database instance.
- `TURSO_AUTH_TOKEN`: The authentication token for accessing your Turso database.
- `SILENT`: Set to true to reduce logging verbosity.

## Usage

To start the migration process, run:

```sh
npm run migrate
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
