# doc-convert

COE 453 Project | 212

# Setup

NodeJS & Docker are needed to do the setup locally.
But you can access the service on [Doc Converter](https://docconvert.netlify.app/)

First thing to setup, is the converter api:

```
cd converter
docker-compose up
```

This will launch the converter api on port 4040, use this in setting up the backend.

Now, setup the backend:

- You need an AWS S3 bucket, set it's credentials as shown in `.env.example`

Then:

```
cd backend
npm i
npm run develop
```

And then setup the frontend:

- set the environment variable that points to the backend: REACT_APP_BACKEND_URL=http://localhost:1337

Then:

```
npm i
npm start
```
