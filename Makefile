APPLICATION_NAME ?= ahclemen/cosmocam

build:
	docker build --tag ${APPLICATION_NAME} --push .