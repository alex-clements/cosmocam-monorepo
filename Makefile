COSMOCAM_APPLICATION_NAME ?= ahclemen/cosmocam
COSMOCAM_NGINX_NAME ?= ahclemen/cosmocam-nginx
COSMOCAM_MEDIASERVER_NAME ?= ahclemen/cosmocam-mediaserver

build:
	docker build --tag ${COSMOCAM_APPLICATION_NAME} . --file ./docker/main/Dockerfile --push

nginx:
	docker build --tag ${COSMOCAM_NGINX_NAME} . --file ./docker/nginx/Dockerfile --push

mediaserver:
	docker build --tag ${COSMOCAM_MEDIASERVER_NAME} . --file ./docker/mediaserver/Dockerfile --push