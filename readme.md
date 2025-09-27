# WB-Tariffs-Service

## Table of contents
- [About](#about)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Documentation](#documentation)

## About
This is a test project of a service that parses Wildberries box tariffs and exports them to google sheets.

## Installation
1. Clone this repository with `git clone https://github.com/Dmitry221060/WB-Tariffs-Service.git`.
2. Configure project by creating `.env` file based on the `.env.example`.
3. Run server in the container with `docker compose up -d`

## Configuration
The service uses [Google Service Account Key](https://cloud.google.com/iam/docs/keys-create-delete#creating) to authenticate and edit google sheets. Follow the official instructions to create one and then specify path to it in `.env` file.

By default the service exports to [public test spreadsheet](https://docs.google.com/spreadsheets/d/1N0fxfJirp5zJJaWGpS0y4iMarrEuc80GtsK2VrW2IdA). If you want to export to other spreadsheets, you should populate the `spreadsheets` table, or make a POST request to `/export` to run one-time export to provided spreadsheets. If you use private spreadsheets, remember to grant edit permissions to your Service Account.

By default the service will format the tarif data with human-readable labels, remove empty fields and convert percentage values into coefficients. If this behavior is undesirable you can set `FORMAT_EXPORT` to `false` in the `.env` file.

## Documentation
After you install and run the server, you can head to http://localhost:5000/api-docs for information on available endpoints and their functions.
