tests:
	npm run test

build-dev: tests
	npm run build-dev

build-prod: tests
	npm run build-prod

publish: build-prod
	npm publish --access public

copy-contracts:
	-rm -rf ./build
	mkdir build/
	mkdir build/contracts/
	cp ../contracts/build/contracts/DAVToken.json build/contracts/
	cp ../contracts/build/contracts/BasicMission.json build/contracts/
	cp ../contracts/build/contracts/Identity.json build/contracts/
