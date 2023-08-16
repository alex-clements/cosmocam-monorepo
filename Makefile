APPLICATION_NAME ?= ahclemen/general

build:
	docker build --tag ${APPLICATION_NAME} .