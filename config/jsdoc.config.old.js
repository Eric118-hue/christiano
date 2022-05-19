'use strict';

module.exports = {
	"plugins": [],
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
			"layoutFile": "/home/admin/www/macentrale/leg2react/doctemplates/default/tmpl/layout.tmpl"
		}
    },
	"opts": {
        //"template": "/home/airmaildata/ui/doctemplates/default",  // same as -t templates/default
        "encoding": "utf8",               // same as -e utf8
        "destination": "/home/admin/www/macentrale/leg2/docs/jsdocs/",          // same as -d ./out/
        "recurse": true,                  // same as -r
        //"tutorials": "path/to/tutorials", // same as -u path/to/tutorials
    }
}