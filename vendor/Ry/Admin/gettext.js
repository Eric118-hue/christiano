#!/usr/bin/env node
const config = require('../../../cenv');
const { GettextExtractor, JsExtractors, HtmlExtractors } = require('gettext-extractor');
 
let extractor = new GettextExtractor();
 
extractor
    .createJsParser([
        JsExtractors.callExpression('trans', {
            arguments: {
                text: 0,
                context: 1 
            }
        }),
        JsExtractors.callExpression('plural', {
            arguments: {
                text: 1,
                textPlural: 2,
                context: 3
            }
        })
    ])
    .parseFilesGlob('./app/**/*.@(ts|js|tsx|jsx)');

extractor
.createJsParser([
    JsExtractors.callExpression('trans', {
        arguments: {
            text: 0,
            context: 1 
        }
    }),
    JsExtractors.callExpression('plural', {
        arguments: {
            text: 1,
            textPlural: 2,
            context: 3
        }
    })
])
.parseFilesGlob('./vendor/**/*.@(ts|js|tsx|jsx)');
 
extractor
    .createHtmlParser([
        HtmlExtractors.elementContent('translate, [translate]')
    ])
    .parseFilesGlob('./app/**/*.html');
 
extractor.savePotFile(config.laravel.root + 'react.pot');
 
extractor.printStats();