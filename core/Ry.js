import React, {Component} from 'react';
import {createStore} from 'redux';
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap-select';
import 'bootstrap/js/dist/util';
import 'bootstrap-select/sass/bootstrap-select.scss';
import './optimizations';

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