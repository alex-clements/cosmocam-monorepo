# cosmocam-monorepo

Cosmocam is a multi-angle pet camera. It allows users who may have multiple internet-enabled devices with cameras to stream video of their pets through a central server, and then view their video from a single device. This lets users attain a high level of coverage of their homes.

Check out the demo [here](https://ec2-35-93-154-214.us-west-2.compute.amazonaws.com/)!

## functionality

Cosmocam has a few screens providing the core application functionality:

- Registration page allowing new users to create accounts
- Login page for users to sign into their accounts
- Streaming page where users can set up a video stream to the Cosmocam server
- Viewing page where users can view each of the video streams they have connected to the server

## tech

Cosmocam was built on the MERN stack - MongoDB, ExpressJS, ReactJS, NodeJS. It was deployed using Docker and Docker-Compose. This sets the groundwork for a more scalable deployment in the future. The application was deployed to a Raspberry Pi, which uses aarch64 architecture.

The Docker image for Cosmocam can be found [here](https://hub.docker.com/repository/docker/ahclemen/cosmocam/general) on DockerHub.

### front-end

- `ReactJS` for updating the DOM
- `Framer Motion` for adding fade animations
- `socket.io` for signaling the media server
- `mediasoup` for streaming video to the server

### back-end

- `node.js` with `expressJS` for serving requests
- `mediasoup` for relaying video from producers to consumers
- `MongoDB` for storing user data

### infrastructure

- `Docker` for compiling the project onto an image for deployment
- `Docker-Compose` for orchestrating the `MongoDB` container with the `cosmocam` project container

### hardware

- `Raspberry Pi` for hosting the application
