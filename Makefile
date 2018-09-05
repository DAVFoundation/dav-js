FORCE:

tslint: FORCE
	npm run tslint

jest: FORCE
	npm run jest

copy-contracts: FORCE
	npm run copy-contracts

tsc: FORCE
	npm run tsc

spellcheck: FORCE
	npm run spellcheck

pre-publish: FORCE
	npm run typedoc

build: tslint tsc jest pre-publish copy-contracts

pre-push: spellcheck tslint tsc jest pre-publish

publish: pre-push
	npm publish --access public
