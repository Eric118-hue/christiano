const CKEDITOR = window.CKEDITOR;
import $ from 'jquery';
import 'sweetalert2/src/sweetalert2.scss';

export default {
    configure : ()=>{
        CKEDITOR.editorConfig = function(config) {
            config.language = 'fr';  
            config.uiColor = '#1FB5AD';   
            config.height = '500px';
            config.extraPlugins = 'textmatch,textwatcher,autocomplete,ry';
            config.toolbarGroups = [
            {
                name : 'document',
                groups : [ 'mode', 'document', 'doctools' ]
            },
            {
                name : 'clipboard',
                groups : [ 'clipboard', 'undo' ]
            },   
            {
                name : 'editing',
                groups : [ 'find', 'selection', 'spellchecker', 'editing' ]
            },      
            {
                name : 'forms',
                groups : [ 'forms' ]
            },       
            {
                name : 'basicstyles',
                groups : [ 'basicstyles', 'cleanup' ]
            },    
            {
                name : 'paragraph',
                groups : [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ]
            },
            {
                name : 'links',
                groups : [ 'links' ]
            },   
            {
                name : 'insert',
                groups : [ 'insert' ]
            },  
            '/',  
            {
                name : 'styles',
                groups : [ 'styles' ]
            }, 
            {
                name : 'colors',
                groups : [ 'colors' ]
            }, 
            {
                name : 'tools',
                groups : [ 'tools' ]
            }, 
            {
                name : 'others',
                groups : [ 'others' ]
            }, 
            {
                name : 'about',
                groups : [ 'about' ]
            }    
            ];     
            config.removeButtons = 'Save,Form,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,NewPage,Preview,Print,Templates,Cut,Undo,Copy,Redo,Paste,PasteText,PasteFromWord,Replace,Find,SelectAll,Scayt,Checkbox,Subscript,Superscript,CopyFormatting,RemoveFormat,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Flash,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About,Styles,Outdent,Indent'; 
        };
    },

    plugins : ()=>{
        CKEDITOR.plugins.add( 'ry', {
            icons: 'timestamp',
            init: function( editor ) {
                const matchCallback = (text, offset)=>{
                        var left = text.slice( 0, offset ),
                        match = left.match( /\#\w*$/ );

                    if ( !match ) {
                        return null;
                    }
                    return { start: match.index, end: offset };
                }

                const textTestCallback = range=>{
                    if ( !range.collapsed ) {
                        return null;
                    }
                
                    // Use the text match plugin which does the tricky job of doing
                    // a text search in the DOM. The matchCallback function should return
                    // a matching fragment of the text.
                    return CKEDITOR.plugins.textMatch.match( range, matchCallback );
                }

                const dataCallback = ( matchInfo, callback )=>{
                    $.ajax({
                        url : '/ckeditor_macros',
                        data : {s:matchInfo.query},
                        success : function(response) {
                            var suggestions = response.data
                            callback(suggestions)
                            autocompleter.open()
                        }
                    })
                }

                var textWatcher = new CKEDITOR.plugins.textWatcher( editor, textTestCallback );
                textWatcher.attach();
                textWatcher.on( 'matched', function( evt ) {
                    console.log("zao aon ndray no mapiseho an'le dropdown choisisevana azy zaoooo tssss", evt.data.text );
                });

                var autocompleter = new CKEDITOR.plugins.autocomplete( editor, {
                    textTestCallback: textTestCallback,
                    dataCallback: dataCallback,
                    itemTemplate: '<li data-id="{id}">{name}</li>',
                    outputTemplate: '{value}'
                } );
                autocompleter.view.on("click-item", function(){
                    
                });

                editor.addCommand( 'insertTimestamp', {
                    exec: function( editor ) {
                        var sel = editor.getSelection()
                        autocompleter.model.setQuery('#', sel.getRanges()[0])
                        //editor.insertHtml('#');
                        /*
                        swal({
                            title : trans('nommer_le_prereglage'),
                            type : 'question',
                            input : 'text',
                            showCancelButton: true,
                            inputValidator: (value) => {
                                return !value && trans('vous_devez_nommer_le_prereglage')
                            }
                        }).then((response)=>{
                            if(response.value) {
                                editor.insertHtml(response.value);
                            }
                        })
                        */
                    }
                });
                
                
                editor.ui.addButton( 'Timestamp', {
                    label: 'Insert Timestamp',
                    command: 'insertTimestamp',
                    toolbar: 'insert'
                });
                
            }
        });
    }
}