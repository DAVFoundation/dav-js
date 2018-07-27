FORCE:

test: FORCE
	npm run tslint
	npm run jest

compile: FORCE
	npm run tslint
	npm run tsc

pre-publish: FORCE
	npm run typedoc

build-dev: test
	npm run build-dev

build-prod: test
	npm run build-prod

publish: build-prod
	npm publish --access public

copy-contracts: FORCE
	-rm -rf ./build
	mkdir build/
	mkdir build/contracts/
	cp ../contracts/build/contracts/DAVToken.json build/contracts/
	cp ../contracts/build/contracts/BasicMission.json build/contracts/
	cp ../contracts/build/contracts/Identity.json build/contracts/
