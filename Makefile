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

<<<<<<< HEAD
pre-push: spellcheck tslint tsc jest pre-publish

publish: pre-push
=======
publish: build-prod
>>>>>>> 995e98f789317c77b939792aab601e374c4d7b83
	npm publish --access public
