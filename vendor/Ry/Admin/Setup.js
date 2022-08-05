import React, {Component} from 'react';
import trans from '../../../app/translations';
import $ from 'jquery';
import swal from 'sweetalert2';

const OPTIONPROTO = {
    id : 0,
    label : '',
    adding : true
}

class OptionItem extends Component
{
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.props.changed(event.target.value)
    }

    render() {
        return <div className="input-group mb-3">
            <input type="text" className="form-control" value={this.props.item.label} onChange={this.handleChange} required/>
            <div className="input-group-append">
                {!this.props.item.adding?<button className="btn btn-danger" type="button" onClick={this.props.remove}><i className="fa fa-trash-alt"></i></button>:<button className="btn btn-success" type="button" onClick={this.props.save}><i className="fa fa-save"></i></button>}
            </div>
        </div>
    }
}

class Options extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            items : this.props.items
        }
        let ar = []
        for(var i=0; i<this.props.items.length; i++) {
            ar.push(parseInt(this.props.items[i].id))
        }
        this.index = Math.max(...ar)
        if(this.index<0)
            this.index = 0
        this.addOption = this.addOption.bind(this)
        this.deleteOption = this.deleteOption.bind(this)
        this.save = this.save.bind(this)
        this.labelChanged = this.labelChanged.bind(this)
    }

    addOption() {
        this.setState(state=>{
            this.index++
            let node = JSON.parse(JSON.stringify(OPTIONPROTO))
            node.id = this.index
            state.items.push(node)
            return state
        })
    }

    labelChanged(id, label) {
        this.setState(state=>{
            let theone = this.props.items.filter(item=>{
                return item.id == id
            })
            let oldlabel = ''
            if(theone.length>0)
                oldlabel = theone[0].label
            state.items.map(item=>{
                if(item.id==id) {
                    item.label = label
                    item.adding = label!=oldlabel
                }
            })
            return state
        })
    }

    deleteOption(item) {
        const dis = this
        swal({
            title: trans('Confirmez-vous la suppression?'),
            text: trans('Cet enregistrement sera supprimé définitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme'),
            confirmButtonClass: 'bg-danger'
        }).then((result) => {
            if (result.value) {
                dis.setState(state=>{
                    state.items = state.items.filter(it=>it.id!=item.id)
                    let data = {}
                    data[dis.props.pkey] = state.items
                    $.ajax({
                        url : '/setup',
                        type : 'post',
                        data : data
                    })
                    return state
                })
            }
        });
    }

    save() {
        let data = {}
        const dis = this
        let items = this.state.items
        items.map(item=>delete item.adding)
        data[this.props.pkey] = items
        $.ajax({
            url : '/setup',
            type : 'post',
            data : data,
            success : ()=>{
                dis.setState({items})
            }
        })
    }

    render() {
        return <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    {this.props.title}
                </div>
                <div className="body">
                    {this.state.items.map((item, key)=><OptionItem key={`site-setup-${this.props.pkey}-option-${item.id}-${key}`} remove={()=>this.deleteOption(item)} save={this.save} item={item} changed={(label)=>this.labelChanged(item.id, label)}/>)}
                </div>
                <div className="card-footer d-flex justify-content-between">
                    <input type="hidden" name="ry"/>
                    <button className="btn btn-default" type="button" onClick={this.addOption}><i className="fa fa-plus"></i> {trans('Ajouter')}</button>
                </div>
            </div>
        </div>
    }
}

export default Options;