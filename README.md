# SMAT: Social Materials

Currently in development

## Running in development

To run this application in development you need docker and docker-compose installed.<br/>

By running the command bellow docker-compose will spin up 3 containers: React, Node and Postgres.<br/>

```bash
docker-compose up
```

## Creating the smatdb

Once up, you'll get an error because the database isn't created, so, follow the steps:

```bash
docker exec -it smat_postgres_1 bash
```
Now you're inside postgres container's terminal

```bash
psql -U postgres
```

Now you can run commands againt the database

```sql
CREATE DATABASE smatdb;
```

Don't forget the dot-komma at the end of the line before pressing enter.

## Run migrations