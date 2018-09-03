FORCE:

tslint: FORCE
	npm run tslint

jest: FORCE
	npm run jest

tsc: FORCE
	npm run tsc

spellcheck: FORCE
	npm run spellcheck

pre-push: tslint tsc jest

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
