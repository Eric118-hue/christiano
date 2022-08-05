import React, {Component} from 'react';
import {PopupHeader, PopupBody} from '../../../bs/bootstrap';
import trans from '../../../../app/translations';
import Modelizer from '../../Core/Modelizer';
import { PopupFooter } from '../../../bs/Popup';

class Macro extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            key : this.props.value
        }
        this.handleKeyChange = this.handleKeyChange.bind(this)
    }

    handleKeyChange(event) {
        this.setState({
            key : event.target.value
        })
    }

    render() {
        return <tr>
            <td>
                <input type="text" className="form-control" value={this.state.key} onChange={this.handleKeyChange} required/>
            </td>
            <td>
                <input type="text" className="form-control" name={`nsetup[macros][${this.state.key}]`} defaultValue={this.props.label} required/>
            </td>
            <td>
                <button className="btn btn-danger btn-block" type="button" onClick={this.props.remove}><i className="fa fa-times-circle"></i> {trans('Supprimer')}</button>
            </td>
        </tr>
    }
}

class Form extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            macros : this.models('props.data.row.nsetup.macros', {})
        }
        this.add = this.add.bind(this)
        this.remove = this.remove.bind(this)
    }

    remove(macro) {
        this.setState(state=>{
            delete state.macros[macro]
            return state
        })
    }

    add() {
        this.setState(state=>{
            state.macros[this.code.value] = this.label.value
            this.code.value = ''
            this.label.value = ''
            return state
        })
    }

    render() {
        return <form action="/events" method="post" name="frm_event">
            <PopupHeader>
                <h4>{this.props.data.page.title}</h4>
            </PopupHeader>
            <PopupBody>
                <div className="row">
                    <div className="col-md-8">
                        <label className="control-label text-capitalize">{trans('Alerte')}</label>
                        <input type="text" className="form-control" name="descriptif" defaultValue={this.models('props.data.row.descriptif')} required/>
                    </div>
                    <div className="col-md-4">
                        <label className="control-label text-capitalize">{trans('Code')}</label>
                        <input type="text" className="form-control" name="code" defaultValue={this.models('props.data.row.code')} required/>
                    </div>
                </div>
                <table className="mt-3 table table-bordered table-yellow">
                    <thead>
                        <tr>
                            <th className="text-capitalize" style={{width:'20%'}}>{trans('Variable')}</th>
                            <th className="text-capitalize" style={{width:'60%'}}>{trans('Désignation')}</th>
                            <th style={{width:'20%'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.macros).map(macro=><Macro key={`model-${macro}`} value={macro} label={this.state.macros[macro]} remove={()=>this.remove(macro)}/>)}
                        <tr>
                            <td>
                                <input type="text" ref={input=>this.code=input} className="form-control" defaultValue={this.props.value}/>
                            </td>
                            <td>
                                <input type="text" ref={input=>this.label=input} className="form-control" defaultValue={this.props.label}/>
                            </td>
                            <td>
                                <button className="btn btn-primary btn-block" type="button" onClick={this.add}><i className="fa fa-plus"></i> {trans('Ajouter')}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </PopupBody>
            <PopupFooter>
                <input type="hidden" name="id" value={this.models('props.data.row.id')}/>
                <button className="btn btn-primary">{trans('Enregistrer')}</button>
            </PopupFooter>
        </form>
    }
}

export default Modelizer(Form)