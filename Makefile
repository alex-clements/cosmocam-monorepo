COSMOCAM_APPLICATION_NAME ?= ahclemen/cosmocam
COSMOCAM_NGINX_NAME ?= ahclemen/cosmocam-nginx
COSMOCAM_MEDIASERVER_NAME ?= ahclemen/cosmocam-mediaserver
BUILDER_NAME ?= ahclemen/cosmocam-builder

builder:
	docker build --tag ${BUILDER_NAME} . --file ./docker/builder/Dockerfile

main:
	docker build --tag ${COSMOCAM_APPLICATION_NAME} . --file ./docker/main/Dockerfile

nginx:
	docker build --tag ${COSMOCAM_NGINX_NAME} . --file ./docker/nginx/Dockerfile

mediaserver:
	docker build --tag ${COSMOCAM_MEDIASERVER_NAME} . --file ./docker/mediaserver/Dockerfile