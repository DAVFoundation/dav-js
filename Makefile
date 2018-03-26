tests:
	npm test

build-dev: tests
	npm run build-dev

build-prod: tests
	npm run build-prod
