# SMAT: Social Materials

Currently in development

## Running in development

By running the command bellow docker-compose will spin up 3 containers: React, Node and Postgres.

```bash
docker-compose up
```

Node is running at `localhost:3333` and React is at `localhost:3000`

Postgres INFO:<br/>
host: postgres<br/>
user: postgres<br/>
password: postgres<br/>
database: smatdb

## Commit to github

Make sure to run `npm run build` in /front before commiting changes to front.

## Production

Heroku pulls github repo and builds node image in Dockerfile.prod. <br/>
This image contains node application that serves react aswell as the backend server.<br/>
In order to speed up image build front must have already been built, this way heroku doesn't have to install all react dependencies in docker image.<br/>
Finally, postgres is managed by heroku and doesn't have to be built.
