.PHONY: post
post:
	@./new.sh

.PHONY: taglist
taglist:
	@find -type f -name "index.md" | grep -v -E "^\.\/(\.\w|node_modules)" | xargs cat | grep -E "^tags: \[" | sed -r -e "s/^tags:\s\[(.*)\]$$/\1/g" | sed -r -e "s/,\s?/\n/g" | sed -r -e '/\w/!d' | sed -r -e "s/\"//g" | sort | uniq -c | column -x
