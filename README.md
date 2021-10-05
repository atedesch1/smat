<br/>

<p align="center">
  <a href="https://smat-web.herokuapp.com">
    <img
      alt="SMAT Logo"
      src="https://storage.googleapis.com/smat-files/SMAT_LOGO_ORANGE.svg"
      width="400"
    />
  </a>
</p>


<p align="center">
  Currently in development
</p>

<br/>

# Running in development

## Install Docker and Docker-compose

To run this application in development you need docker and docker-compose installed.<br/>

Docker installation instructions: https://docs.docker.com/engine/install/ <br/>
Docker-compose installation instructions: https://docs.docker.com/compose/install/ <br/>

## Run docker-compose

After installing docker and docker-compose run in the root directory (where docker-compose.yml is located):

```
docker-compose up
```

Run with `-d` flag to run in detached mode (no logs from containers).<br/>

Docker-compose should pull Node and Postgres official images from dockerhub and build on top of them the project's images. Afterwards it will run the containers. Check if containers are up by running (lists all running containers):

```
docker ps
```

React should now be accessible at http://localhost:3000 and Node at http://localhost:3333.<br/>

To get logs from a container run:

```
docker logs <container_name> -f
```

## Create Database and Run Migrations

In order to be able to use postgres you need to create the database and run migrations. <br/>

Get postgres's container name by running `docker ps` (should be **smat_postgres_1**). <br/>

Access the container's bash by running:

```
docker exec -it <container_name> bash
```

Now enter postgres by running inside the container's bash:

```
psql postgres postgres
```

Create database with:

```
CREATE DATABASE smatdb;
```

To run migrations first connect to Node's container like Postgres. <br/>

Inside Node's bash run:

```
npm run migration:run
```

## Google Cloud Storage

This project uses a Google Cloud storage bucket to store files and images. <br/>

Create a Google Cloud account and create a storage bucket. <br/>

Get the a service account key JSON file: https://cloud.google.com/iam/docs/creating-managing-service-account-keys <br/>

To connect to your bucket, place the generated service account key JSON file inside /back and add storage_bucket field with the bucket's name.



**Setup should be complete if followed correctly.**

# Production

Heroku pulls github repo and builds node image in Dockerfile.prod. <br/>

This image contains node application that serves react aswell as the backend server.<br/>

Postgres is managed by heroku and doesn't have to be built.

# Project Structure and Info

Postgres connection info:<br/>
* Host: postgres<br/>
* User: postgres<br/>
* Password: postgres<br/>
* Database: smatdb
* Port: 5432

## Project Directory Tree

* back/
  * src/
    * @types/
    * controllers/
    * database/
      * migrations/
    * middlewares/
    * models/
    * routers/
      * client/
    * services/
* front/
  * public/
  * src/
    * assets/
      * images/
      * styles/
    * components/
      * Auth/
      * Form/
      * Router/
    * hooks/
    * layouts/
    * pages/
      * CreatePost/
      * Home/
      * SignIn/
      * SignUp/
    * services/