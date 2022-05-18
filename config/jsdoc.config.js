'use strict';

module.exports = {
	"plugins": ["plugins/markdown"],
    "recurseDepth": 10,
    "source": {
		"include": ["app", "vendor", "config"],
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "sourceType": "module",
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false,
		"default": {
			"layoutFile": "/home/airmaildata/ui/doctemplates/default/tmpl/layout.tmpl"
		}
    },
	"opts": {
        //"template": "/home/airmaildata/ui/doctemplates/default",  // same as -t templates/default
        "encoding": "utf8",               // same as -e utf8
        "destination": "/home/airmaildata/www/docs/jsdocs/",          // same as -d ./out/
        "recurse": true,                  // same as -r
        //"tutorials": "path/to/tutorials", // same as -u path/to/tutorials
    }
}