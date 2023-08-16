APPLICATION_NAME ?= ahclemen/general

build:
	docker buildx build --tag ${APPLICATION_NAME} --platform=linux/arm64/v8,linux/arm/v7 --push .