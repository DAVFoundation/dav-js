FORCE:

tslint: FORCE
	npm run tslint

test: FORCE
	npm run jest

tsc: FORCE
	npm run tsc

spellcheck: FORCE
	npm run spellcheck

pre-push: tslint tsc test

pre-publish: FORCE
	npm run typedoc

publish: build-prod
	npm publish --access public

copy-contracts: FORCE
	-rm -rf ./build
	mkdir build/
	mkdir build/contracts/
	cp ../contracts/build/contracts/DAVToken.json build/contracts/
	cp ../contracts/build/contracts/BasicMission.json build/contracts/
	cp ../contracts/build/contracts/Identity.json build/contracts/
