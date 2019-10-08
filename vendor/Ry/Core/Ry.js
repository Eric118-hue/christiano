import React, {Component} from 'react';
import {createStore} from 'redux';
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap-select';
import 'bootstrap/js/dist/util';
import 'bootstrap-select/sass/bootstrap-select.scss';
import swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import trans, {LOADINGEND, LOADINGSTART} from '../../../app/translations';
import qs from 'qs';
import Dropzone from '../Core/dropzone';
import __Core from './Core';

export const Core = __Core;

$(document).ajaxSend(function(event, state, ajax){
	if(ajax.isPagination) {
		let url = ajax.url
		let queryparts = url.split(/\?/)
		if(queryparts.length>1) {
			let queries = qs.parse(queryparts[1])
			delete queries.json
			delete queries.ry
			url = queryparts[0]+'?'+qs.stringify(queries)
		}
		window.history.pushState({},"", url)
	}
});

$(document).ajaxStart(function() {
    $( "body" ).addClass("ry-loading");
});

$(document).ajaxError(function(event, response) {
    $( "body" ).removeClass("ry-loading");
    let errorText = (response.responseJSON && response.responseJSON.message) ? response.responseJSON.message : trans('une_erreur_sest_produite');
    switch(response.status) {
    	case 403:
    		errorText = trans("cette_action_nest_pas_autorisee_veuillez_contacter_ladministrateur_pour_vous_accorder_ce_droit");
			break;
		case 419:
		case 401:
			window.location.reload();
			errorText = trans("cette_session_a_expire");
			break;
	}
	if(response.status) {
		swal.fire({
			title: (response.responseJSON && response.responseJSON.message) ? `Erreur ${response.status}!` : trans('Désolé'),
			text: errorText,
			type: 'error'
		});
	}
});

$(window).bind("beforeunload",function(event) {
	if($(".confirmquit").length>0 || $(".ry-loading").length>0) {
		return "Veuillez cliquer sur enregistrer avant de quitter cette page";
	}
});

$(document).ajaxStop(function() {
    $( "body" ).removeClass("ry-loading");
});

const CKEDITOR = window.CKEDITOR;
$.fn.selectpicker.Constructor.BootstrapVersion = '4';

$.fn.centraleValidate = function() {
    this.each(function(){
        let requiredInput = $(this).next().find('select[required], input[required], textarea[required]')
        let requiredInput2 = $(this).siblings('select[required], input[required], textarea[required]')
        const $icon = $('<i class="alpha-80 fa fa-lock pl-2 text-orange"></i>')
        if(requiredInput.length>0) {
            if(!$(this).hasClass("required"))
                $(this).addClass('required').append($icon)
        }
        else if(requiredInput2.length>0) {
            if(!$(this).hasClass("required"))
                $(this).addClass('required').append($icon)
        }
        else if($(this).hasClass("required")) {
            $(this).removeClass('required')
            console.log($(this).find('i.fa'))
            $(this).find('i.fa').remove()
        }
    });
}

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

const AmDifferedState = (state = 0, action) => action;

const AmDiffered = createStore(AmDifferedState);

var dialogData = {};

export class Img extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            src : this.props.src?this.props.src:this.props.broken
        }
    }

    componentDidMount() {
        const broken = this.props.broken
        $(this.refs.img).on('error', function(){
            this.src = broken;
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.src!=this.props.src)
            this.setState({
                src : this.props.src
            })
    }

    render() {
        return <img ref="img" src={this.state.src} className={this.props.className}/>
    }
}

class Ry extends Component {
    constructor(props) {
        super(props);
        this.getRaw = this.getRaw.bind(this);
        this.state = {
            data: this.props.content
        }
    }

    getRaw() {
        return this.state
    }

    componentDidMount() {
        AmDiffered.subscribe(() => {
            const state = AmDiffered.getState();
            if (state.type === this.props.id) {
                this.setState({
                    data: state.content
                })
            }
        });
        $('select').not(".select-default").selectpicker({
            noneSelectedText: '--',
            container: 'body'
        });
        const props = this.props.content;
        $('a[href^="#dialog/"]').each(function () {
            let dis = $(this);
            const f = function (e) {
                e.preventDefault();
                if (dis.data("content") && dis.data("content") != '')
                    AmDiffered.dispatch({
                        type: 'dialog',
                        url: dis.attr('href').replace('#dialog', ''),
                        method: 'post',
                        data: props[dis.data("content")],
                        display: dis.data("display")
                    });
                else
                    AmDiffered.dispatch({type: 'dialog', url: dis.attr('href').replace('#dialog', ''), method: 'get', display: dis.data("display")});
                return false;
            };
            if (!this.dialogBound) {
                $(this).bind('click', f);
                this.dialogBound = true;
            }
        });
        $('input:hidden[name="ry"]').parents("form").ajaxForm({
            beforeSerialize: function ($form, options) {
                if (CKEDITOR && CKEDITOR.instances) {
                    for (var instance in CKEDITOR.instances)
                        CKEDITOR.instances[instance].updateElement();
                }
                if($form.attr('method')=='get')
                    options.isPagination = true;
                const thery = $form.find("input:hidden[name='ry']")[0].ry;
                if(thery && 'getRaw' in $form.find("input:hidden[name='ry']")[0].ry) {
                    const raw = $form.find("input:hidden[name='ry']")[0].ry.getRaw();
                    options.data = Array.isArray(raw) ? {'ry.array': raw} : raw
                }
            },
            success: function (response) {
                if (response.type)
                    AmDiffered.dispatch(response);
            }
        });
        $('.dropdown-toggle').dropdown()
        $('label').centraleValidate()
        $('form').parsley({
            excluded : ':hidden'
        });
        $("[data-dropzone-action]").each(function(){
            if(this.dropzone)
				return;
            const dz = new Dropzone(this, {
                url : $(this).data('dropzone-action'),
                paramName : $(this).data('name'),
                acceptedFiles: $(this).data('accepted-files') ? $(this).data('accepted-files') : '.png,.jpg,.jpeg,.gif',
                dictCancelUpload: trans('annuler'),
                dictCancelUploadConfirmation: trans('etes_vous_certain_dannuler_le_transfert'),
                dictInvalidFileType: trans(`ce_type_de_fichier_nest_pas_autorise`),
                previewTemplate: `<div style="display: none;"></div>`,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            })
            const LOGOadded = (file) => {
                const imgContainer = $($(this).data("preview-target"));
                var reader = new FileReader();
    
                reader.onload = function (e) {
                    imgContainer.attr('src', e.target.result);
                };
    
                reader.readAsDataURL(file);
            };
            dz.on('addedfile', LOGOadded);
            dz.on("sending", ()=>LOADINGSTART($(this).data('name')));
            dz.on("complete", ()=>LOADINGEND($(this).data('name')));
            dz.on("success", (event, response)=>{
                if(response.type) {
                    AmDiffered.dispatch(response)
                }
            })
        });
    }

    render() {
        let ar = this.props.class ? this.props.class.split('.') : []
        if(ar.length>0 && (ar[0] in this.props.components)) {
            let base = this.props.components[ar[0]]
            if(base && ar.length>1) {
                for(var i=1; i<ar.length; i++) {
                    if(base)
                        base = base[ar[i]]
                    else
                        break
                }
            }
            if(base) {
                const Cpnt = base
                return <Cpnt data={this.props.content} store={AmDiffered}/>
            }
        }
        return null;
    }
}

Ry.global = {};

Ry.globalCalls = {};

Ry.setGlobal = (elementname, content)=>{
    if(!Ry.global[elementname])
        Ry.global[elementname] = [];
    Ry.global[elementname].push(content);
    if(elementname in Ry.globalCalls) {
        Ry.globalCalls[elementname](content)
        delete Ry.globalCalls[elementname]
    } 
}

Ry.getGlobal = (search, defaultValue, foundCallback) => {
    let obj = Ry.global
    let found = false
    const browse = (o) => {
        Object.keys(o).reduce((previous, key) => {
            if (typeof(o[key]) === 'object') {
                if (key === search) {
                    foundCallback(o[key])
                    found = true;
                    return;
                }
                else {
                    if ('length' in o[key]) {
                        o[key].map(j => browse(j))
                    }
                    else
                        browse(o[key])
                }
            }
        })
    };
    browse(obj);
    if (!found) {
        Ry.globalCalls[search] = foundCallback
        foundCallback(defaultValue)
    }
};

export default Ry;