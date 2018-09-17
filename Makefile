FORCE:

tslint: FORCE
	npm run tslint

jest: FORCE
	npm run jest

create-dist: FORCE
	npm run create-dist

tsc: FORCE
	npm run tsc

spellcheck: FORCE
	npm run spellcheck

build: tslint tsc jest pre-publish copy-contracts

pre-push: FORCE
	npm run prepublish

publish: pre-push
	npm publish --access public
