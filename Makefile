COSMOCAM_APPLICATION_NAME ?= ahclemen/cosmocam

build:
	docker build --tag ${COSMOCAM_APPLICATION_NAME} . --file ./docker/main/Dockerfile