const CKEDITOR = window.CKEDITOR;

export default {
    configure : ()=>{
        CKEDITOR.editorConfig = function(config) {
            config.language = 'fr';  
            config.extraAllowedContent = 'twig';
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
    }
}