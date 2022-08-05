import swal from 'sweetalert2';
import trans from '../../../../../../app/translations';

const CKEDITOR = window.CKEDITOR;

CKEDITOR.plugins.add( 'ry', {
    requires: 'widget',
    icons: 'cklaravel',
    init: function( editor ) {
        const engine = {}

        editor.addContentsCss(this.path + 'medias/css/style.css')

        const matchCallback = (text, offset)=>{
                var left = text.slice( 0, offset ),
                match = left.match( /\{\{\w*$/ );

            if ( !match ) {
                return null;
            }
            return { start: match.index, end: offset };
        }

        const textTestCallback = range=>{
            if ( !range.collapsed ) {
                return null;
            }
        
            return CKEDITOR.plugins.textMatch.match( range, matchCallback );
        }

        const dataCallback = ( matchInfo, callback )=>{
            $.ajax({
                url : '/ckeditor_macros',
                data : {s:matchInfo.query},
                success : function(response) {
                    var suggestions = response.data
                    callback(suggestions)
                    engine.autocompleter.open()
                }
            })
        }

        var textWatcher = new CKEDITOR.plugins.textWatcher( editor, textTestCallback );
        textWatcher.attach();
        textWatcher.on( 'matched', function( evt ) {
            console.log("tssss", evt.data.text );
        });

        engine.autocompleter = new CKEDITOR.plugins.autocomplete( editor, {
            textTestCallback: textTestCallback,
            dataCallback: editor.config.ryautocomplete ? editor.config.ryautocomplete(engine) : dataCallback,
            itemTemplate: '<li data-id="{id}">{name}</li>',
            outputTemplate: '{value}'
        });
        engine.autocompleter.view.on("click-item", function(){
            
        });

        editor.addCommand( 'insertCklaravel', {
            exec: function( editor ) {
                var sel = editor.getSelection()
                engine.autocompleter.model.setQuery('#', sel.getRanges()[0])
                //editor.insertHtml('#');
            }
        });
        
        editor.ui.addButton( 'Cklaravel', {
            label: 'Insert Laravel',
            command: 'insertCklaravel',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'simplebox', function(editor){
            return {
                title: 'Edit Simple Box',
                minWidth: 200,
                minHeight: 100,
                contents: [
                    {
                        id: 'info',
                        elements: [
                            {
                                id: 'align',
                                type: 'select',
                                label: 'Align',
                                items: [
                                    [ editor.lang.common.notSet, '' ],
                                    [ editor.lang.common.alignLeft, 'left' ],
                                    [ editor.lang.common.alignRight, 'right' ],
                                    [ editor.lang.common.alignCenter, 'center' ]
                                ],
                                setup: function( widget ) {
                                    this.setValue( widget.data.align );
                                },
                                commit: function( widget ) {
                                    widget.setData( 'align', this.getValue() );
                                }
                            },
                            {
                                id: 'width',
                                type: 'text',
                                label: 'Width',
                                width: '50px',
                                setup: function( widget ) {
                                    this.setValue( widget.data.width );
                                },
                                commit: function( widget ) {
                                    widget.setData( 'width', this.getValue() );
                                }
                            }
                        ]
                    }
                ]
            };
        });

        editor.widgets.add( 'cklaravel', {
            button: 'Link from laravel',
            template: '<twig></twig>',
            allowedContent: 'twig; div(!simplebox); div(!simplebox-content); h2(!simplebox-title)',
            requiredContent: 'twig',
            upcast: element=>(element.name=='twig'),
            //dialog: 'simplebox',
            inline: true,
            init: function(){
                if(this.element)
                    this.element.setText('user.name')
            },
            data : function(){
                if(this.element)
                    this.element.setText('user.name')
            },
            edit : function(){
                swal({
                    title : trans('Nommer le préreglage'),
                    type : 'question',
                    input : 'text',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        return !value && trans('Vous devez nommer le préréglage')
                    }
                }).then((response)=>{
                    if(response.value) {
                        this.element.setText(response.value);
                    }
                })
            }
        });
        
    }
});