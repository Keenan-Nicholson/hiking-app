# TrekSpot

A web application for hikers to share their hikes with friends

## Installation

Clone the repository

### Install dependencies in the root directory

```sh
poetry install
```

### Install dependencies in the frontend directory

```sh
npm install
```

### Create a .env file in the root directory and add the following variables

```sh
DATABASE_URL = your_database_url
```

### Create a .env in the frontend directory and add the following variables

```sh
VITE_MAP_TILER_API_KEY = your_map_tiler_api_key
```

### Run the docker container

```sh
docker compose up -d
```

### Run TiPG

```sh
DATABASE_URL=postgresql://username:password@0.0.0.0:5432/postgis
uvicorn tipg.main:app
```
