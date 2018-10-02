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

pre-push: FORCE
	npm run tslint
	npm run jest
	npm run spellcheck
	npm run tsc
	npm run typedoc
	npm run create-dist

pre-publish: FORCE
	npm run pre-publish

publish: pre-push
	npm publish --access public
