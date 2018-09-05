FORCE:

tslint: FORCE
	npm run tslint

jest: FORCE
	npm run jest

tsc: FORCE
	npm run tsc

spellcheck: FORCE
	npm run spellcheck

pre-publish: FORCE
	npm run typedoc

pre-push: tslint tsc jest pre-publish

publish: build-prod
	npm publish --access public
