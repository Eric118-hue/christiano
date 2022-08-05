import React, { Component } from 'react';
import trans, {locale} from '../../../app/translations';
import $ from 'jquery';
import swal from 'sweetalert2';
import Modelizer from '../Core/Modelizer';
import {Popup, PopupBody, PopupHeader} from '../../bs/bootstrap';

const CKEDITOR = window.CKEDITOR;

class HtmlBuilder extends Component
{
    constructor(props) {
        super(props)
        let data = {...this.props.data}
        data.tab = 0
        this.state = data
        this.sendPreview = this.sendPreview.bind(this)
        this.onSubjectChange = this.onSubjectChange.bind(this)
        this.onSignatureChange = this.onSignatureChange.bind(this)
        this.onContentChange = this.onContentChange.bind(this)
        this.popup = this.popup.bind(this)
        this.putMacro = this.putMacro.bind(this)
        this.checkEvent = this.checkEvent.bind(this)
        this.insert = this.insert.bind(this)
        this.insertText = this.insertText.bind(this)
    }

    insert(event, field) {
        this.field = field
        this.selection = $(event.target.parentElement.parentElement).find('input:text')[0]
        $('#cklaravel').modal('show')
    }

    checkEvent(e, event) {
        const checked = e.target.checked
        this.setState(state=>{
            state.all_alerts.find(it=>it.id==event.id).selected = checked
            return state
        })
    }

    popup(widget) {
        $('#cklaravel').modal('show')
        this.widget = widget
    }

    insertText(text, field) {
        var input = this.selection;
        if (input == undefined) { return; }
        var scrollPos = input.scrollTop;
        var pos = 0;
        var browser = ((input.selectionStart || input.selectionStart == "0") ? 
          "ff" : (document.selection ? "ie" : false ) );
        if (browser == "ie") { 
            input.focus();
            var range = document.selection.createRange();
            range.moveStart ("character", -input.value.length);
            pos = range.text.length;
        }
        else if (browser == "ff") { pos = input.selectionStart };
      
        var front = (input.value).substring(0, pos);  
        var back = (input.value).substring(pos, input.value.length); 
        input.value = front+text+back;
        this.setState(state=>{
            state.contents[state.tab].bindings[this.field] = input.value
            return state
        })
        pos = pos + text.length;
        if (browser == "ie") { 
            input.focus();
            var range = document.selection.createRange();
            range.moveStart ("character", -input.value.length);
            range.moveStart ("character", pos);
            range.moveEnd ("character", 0);
            range.select();
        }
        else if (browser == "ff") {
            input.selectionStart = pos;
            input.selectionEnd = pos;
            input.focus();
        }
        input.scrollTop = scrollPos;
    }

    putMacro(macro) {
        if(this.selection) {
            this.insertText(`{{${macro.twig}}}`)
        }
        else {
            this.widget.element.setText(macro.descriptif);
            this.widget.element.setAttribute('macro', macro.twig);
        }
    }

    componentDidMount() {
        const dis = this
        $('#cklaravel').on('hidden.bs.modal', ()=>{
            if(this.selection) {
                delete this.selection
            }
            else if(this.widget.element.getText()=='')
                this.widget.element.getParent().remove()
        })

        const stater = ()=>{
            let ar = []
            this.state.all_alerts.filter(event=>event.selected).map(it=>ar.push(it.id))
            return ar
        }

        CKEDITOR.plugins.add( 'ry', {
            requires: 'widget',
            icons: 'cklaravel',
            init: function( editor ) {
                const engine = {}
        
                editor.addContentsCss(this.path + 'medias/css/style.css')
        
                const matchCallback = (text, offset)=>{
                        var left = text.slice( 0, offset ),
                        match = left.match( /\{\{[\w\.]*$/ );
        
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
                        data : {
                            s:matchInfo.query,
                            alerts:stater()
                        },
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
                    itemTemplate: '<li data-id="{id}">{name} : <strong>{sample}</strong></li>',
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
        
                editor.widgets.add( 'cklaravel', {
                    button: trans('Insérer variable'),
                    template: '<twig></twig>',
                    allowedContent: 'twig[macro]; div(!simplebox)',
                    requiredContent: 'twig',
                    upcast: element=>(element.name=='twig'),
                    inline: true,
                    init: function(){
                        
                    },
                    data : function(){
                        
                    },
                    edit : function(){
                        dis.popup(this)
                    }
                });
                
            }
        });

        $(".content-editor").each(function(){
            CKEDITOR.replace(this, {
                language:locale,
                ryautocomplete: (engine)=>{
                    return ( matchInfo, callback )=>{
                        $.ajax({
                            url : '/ckeditor_macros',
                            data : {
                                s:matchInfo.query,
                                alerts:stater()
                            },
                            success : function(response) {
                                let suggestions = response.data
                                callback(suggestions)
                                engine.autocompleter.open()
                            }
                        })
                    }
                }
            })
        })

        $(".langtabs").on('shown.bs.tab', event=>{
            dis.setState({
                tab : $(event.target).data("index")
            })
        })
    }

    onSubjectChange(event, index) {
        const value = event.target.value
        this.setState(state=>{
            state.contents[index].bindings.subject = value
            return state
        })
    }

    onSignatureChange(event, index) {
        const value = event.target.value
        this.setState(state=>{
            state.contents[index].bindings.signature = value
            return state
        })
    }

    onContentChange(event, index) {
        const value = event.target.value
        this.setState(state=>{
            state.contents[index].content = value
            return state
        })
    }

    sendPreview() {
        if(CKEDITOR && CKEDITOR.instances) {
            for (var instance in CKEDITOR.instances)
                CKEDITOR.instances[instance].updateElement();
        }
        $.ajax({
            url : '/test_email',
            type : 'post',
            data : {
                subject : this.models(`state.contents.${this.state.tab}.bindings.subject`),
                signature : this.models(`state.contents.${this.state.tab}.bindings.signature`),
                content : CKEDITOR.instances[`contents[${this.state.tab}][content]`].getData(),
                id : this.models('props.data.id')
            },
            success : (response)=>{
                swal(
                    trans('Votre message a bien été envoyé'),
                    trans('Votre message a bien été envoyé'),
                    'success'
                )
            },
            error : ()=>{
                swal(
                    trans("Erreur pendant l'envoi du mail"),
                    trans("L'envoi du mail a échoué"),
                    'error'
                )
            }
        })
    }

    render() {
        let channels = []
        for(var channel in this.models('props.data.channels', [])) {
            channels.push(channel);
        }
        let macros = []
        this.models('state.all_alerts', []).filter(event=>event.selected).map(event=>{
            Object.keys(event.nsetup.macros).map(variable=>{
                macros.push({
                    twig : variable,
                    descriptif : event.nsetup.macros[variable]
                })
            })
        })
        return <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    <form action={this.models('props.data.action', '/')} method="post" name="frm_templates">
                        <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
                        <div className="p-4">
                            <div className="form-group">
                                <label htmlFor="template_name">{trans('Nom')}</label>
                                <input type="text" className="form-control" id="template_name" aria-describedby="template_name" name="template[name]" placeholder={trans('Nom')} defaultValue={this.models("state.name", "")} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="recipient_name">{trans('Nom du destinataire')}</label>
                                <input type="text" className="form-control" id="recipient_name" name="template[nsetup][recipient][name]" placeholder="{{user.name}}" defaultValue={this.models("state.nsetup.recipient.name", "{{user.name}}")} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="recipient">{trans('Email du destinataire')}</label>
                                <input type="text" className="form-control" id="recipient" name="template[nsetup][recipient][email]" placeholder="{{user.email}}" defaultValue={this.models("state.nsetup.recipient.email", "{{user.email}}")} required/>
                            </div>
                            <h5 className="border-bottom">{trans("Évènements déclenchant l'envoi :")}</h5>
                            <div className="row pb-3 border-bottom mb-3">
                                {this.models('state.all_alerts', []).map(event=><div key={`event-${event.id}`} className="col-md-6">
                                    <div className="form-inline justify-content-between py-2">
                                        <div className="col-8 custom-checkbox custom-control">
                                            <input type="checkbox" className="custom-control-input" id={`alerts_${event.id}`} checked={event.selected?true:false} onChange={(e)=>this.checkEvent(e, event)}/>
                                            <label className="custom-control-label justify-content-start" htmlFor={`alerts_${event.id}`}>{event.descriptif}</label>
                                        </div>
                                        <input type="hidden" name={`alerts[${event.id}]`} value={event.selected?1:0}/>
                                    </div>
                                </div>)}
                            </div>
                            {channels.length>1?<React.Fragment>
                                <h5>{trans('Canaux de diffusion')}</h5>
                                <div className="form-inline justify-content-between pb-4 pt-4">
                                    {channels.map(channel=><div key={channel} className="custom-checkbox custom-control">
                                        <input type="checkbox" className="custom-control-input" id={`template_channels_${this.models(`props.data.channels.${channel}`)}`} name={`template[channels][${channel}]`} value={this.models(`props.data.channels.${channel}`)} defaultChecked={this.models(`state.archannels.${channel}`)}/>
                                        <label className="custom-control-label justify-content-start" htmlFor={`template_channels_${this.models(`props.data.channels.${channel}`)}`}>{trans(this.models(`props.data.channels.${channel}`))}</label>
                                    </div>)}
                                </div>
                            </React.Fragment>:<input type="hidden" name={`template[channels][${channels[0]}]`} value={this.models(`props.data.channels.${channels[0]}`)}/>}
                            <h5 className="border-bottom">{trans('Contenu du message')}</h5>
                            <div>
                                <ul className="nav nav-tabs" role="tablist">
                                    {this.models('state.contents', []).map((content, key) => <li key={`${content.lang}-tab`} className="nav-item"><a
                                        className={`nav-link langtabs ${key==0?'active':''}`}
                                        data-toggle="tab" href={`#${content.lang}-tab`} role="tab"
                                        aria-controls={content.lang} data-index={key}>{content.lang}</a></li>)}
                                </ul>
                                <div className="tab-content border-bottom border-left border-right">
                                    {this.models('state.contents', []).map((content, key) => <div key={`content-${content.lang}`} className={`tab-pane mb-4 p-4 ${key==0?'active':''}`} id={`${content.lang}-tab`} role="tabpanel" aria-labelledby={content.lang}>
                                        <div className="form-group">
                                            <label>{trans('Objet')}</label>
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" name={`contents[${key}][bindings][subject]`} placeholder={trans('Objet')} value={this.cast(content, 'bindings.subject', '')} onChange={e=>this.onSubjectChange(e, key)} required/>
                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-secondary" type="button" onClick={e=>this.insert(e, 'subject')}><i className="fa fa-plug"></i> {trans('Insérer variable')}</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="template_injections_signature">{trans('Signature')}</label>
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" name={`contents[${key}][bindings][signature]`} placeholder={trans('Signature')} value={this.cast(content, 'bindings.signature')} onChange={e=>this.onSignatureChange(e, key)} required/>
                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-secondary" type="button" onClick={e=>this.insert(e, 'signature')}><i className="fa fa-plug"></i> {trans('Insérer variable')}</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <textarea name={`contents[${key}][content]`} key={`content-${this.models('props.data.id')}-${content.lang}`} className="content-editor" value={this.cast(content, 'content')} onChange={e=>this.onContentChange(e, key)} required></textarea>
                                        </div>
                                        <input type="hidden" name={`contents[${key}][lang]`} value={content.lang}/>
                                        <input type="hidden" name={`contents[${key}][id]`} value={content.id}/>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-between m-0">
                            <div>
                                <button type="button" onClick={this.sendPreview} className="btn btn-aubergine">{trans('Envoyer un aperçu')}</button>
                            </div>
                            <div>
                                <input type="hidden" name="id" defaultValue={this.models('state.id')}/>
                                <button className="ml-3 btn btn-primary" type="submit">{trans('Enregistrer')}</button>
                            </div>
                        </div>
                        <Popup id="cklaravel" className="modal-xl">
                            <PopupHeader>
                                <h6>{trans('Champs disponibles')}</h6>
                            </PopupHeader>
                            <PopupBody>
                                <h5>{trans('Variables exposées')}</h5>
                                {macros.map(macro=><button key={`macro-${macro.twig}`} type="button" className="btn btn-default" onClick={()=>this.putMacro(macro)}>{macro.descriptif}</button>)}
                                <hr/>
                                <div className="alert alert-warning">
                                    <i className="fa fa-info-circle"></i> {trans(`Vous pouvez tout aussi bien taper {{ pour voir les suggestion d'autocompletion.`)}
                                </div>
                            </PopupBody>
                        </Popup>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(HtmlBuilder);