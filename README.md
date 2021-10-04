# SMAT: Social Materials

Currently in development

## Running in development

To run this application in development you need docker and docker-compose installed.<br/>

By running the command bellow docker-compose will spin up 3 containers: React, Node and Postgres.<br/>

```bash
docker-compose up
```

Run with `-d` flag to run in detached mode.<br/>
Use `docker logs <container_name> -f` to get logs from a specific container.<br/>

React is running at `localhost:3000` and Node is at `localhost:3333`.<br/>

Postgres is only accessible when inside containers.<br/>

Use `docker exec -it <container_name> bash` to connect to specified container's bash.<br/>

Postgres INFO:<br/>
host: postgres<br/>
user: postgres<br/>
password: postgres<br/>
database: smatdb

### Running migrations

To run migrations first connect to node's container, then run the command bellow.<br/>

```bash
npm run migration:run
```

Migrations commands `create` and `generate` must be succeeded by `-- -n <migration_name>`.

### Google cloud storage

This project uses a Google cloud storage bucket to store files and images. <br/>

Get the a service account key JSON file: https://cloud.google.com/iam/docs/creating-managing-service-account-keys <br/>

To connect to your bucket, place the generated service account key JSON file inside /back and add storage_bucket field with the bucket's name.

## Production

Heroku pulls github repo and builds node image in Dockerfile.prod. <br/>
This image contains node application that serves react aswell as the backend server.<br/>
Postgres is managed by heroku and doesn't have to be built.
