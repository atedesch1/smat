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

Node is running at `localhost:3333` and React is at `localhost:3000`

Postgres INFO:<br/>
host: postgres<br/>
user: postgres<br/>
password: postgres<br/>
database: smatdb

## Production

Heroku pulls github repo and builds node image in Dockerfile.prod. <br/>
This image contains node application that serves react aswell as the backend server.<br/>
Finally, postgres is managed by heroku and doesn't have to be built.
