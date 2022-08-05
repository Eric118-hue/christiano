import React, {Component} from 'react';
import Modelizer from '../Core/Modelizer';
import {Popup, PopupHeader, PopupBody, PopupFooter} from '../../bs/bootstrap';
import $ from 'jquery';

let booker = 0

class Tree extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data : this.props.data
        }
        this.handleChange = this.handleChange.bind(this)
        this.addKey = this.addKey.bind(this)
        this.addChild = this.addChild.bind(this)
        this.remove = this.remove.bind(this)
        this.removeKey = this.removeKey.bind(this)
        this.booker = 0
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='setup_tree' && storeState.booker==this.booker) {
                if(Array.isArray(this.state.data[this.props.pkey])) {
                    this.setState(state=>{
                        state.data[this.props.pkey].push(storeState.input=='array'?[]:(storeState.input=='object'?{}:''))
                        return state
                    })
                }
                else {
                    this.setState(state=>{
                        state.data[this.props.pkey][storeState.key] = storeState.input=='array'?[]:(storeState.input=='object'?{}:'')
                        return state
                    })
                }
            }
        })
    }

    remove(index) {

    }

    removeKey(key) {
        this.setState(state=>{
            delete state.data[this.props.pkey][key]
            return state
        })
    }

    addKey() {
        booker++
        this.booker = booker
        $('#newbranch').modal('show')
    }

    addChild() {
        booker++
        this.booker = booker
        $('#newbranch').modal('show')
    }

    handleChange(event) {
        const value = event.target.value
        this.setState(state=>{
            state.data[this.props.pkey] = value
            return state
        })
    }

    render() {
        let tree = null
        if(Array.isArray(this.state.data[this.props.pkey])) {
            tree = <ul>
                {this.state.data[this.props.pkey].map((item, index)=><li key={`${this.props.id}-${index}`} className="border p-2"><Tree id={`${this.props.id}-${index}`} pkey={index} data={this.state.data[this.props.pkey]} store={this.props.store}/>
                </li>)}
                <li><button className="btn" onClick={this.addChild}><i className="fa fa-plus-circle"></i></button></li>
            </ul>
        }
        else if(this.state.data[this.props.pkey]!=null && typeof this.state.data[this.props.pkey] === 'object') {
            tree = <ul>
                {Object.keys(this.props.data[this.props.pkey]).map(key=><li  className="border p-2" key={`${this.props.id}-${key}`}>
                <div className="form-inline align-items-stretch">
                    <label className="control-label mr-2 align-items-start">{key} : </label>
                    <Tree id={`${this.props.id}-${key}`} pkey={key} data={this.props.data[this.props.pkey]} store={this.props.store}/>
                    <button type="button" className="btn btn-danger" onClick={()=>this.removeKey(key)}><i className="fa fa-trash-alt"></i></button>
                </div>
            </li>)}
            <li><button className="btn" onClick={this.addKey}><i className="fa fa-plus-circle"></i></button></li>
            </ul>
        }
        else {
            tree = <div className="form-group">
                <input type="text" value={this.models(`state.data.${this.props.pkey}`)} onChange={this.handleChange} className="form-control"/>
            </div>
        }
        return tree
    }
}

Modelizer(Tree)

class SetupTree extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data : this.props.data.data
        }
        this.save = this.save.bind(this)
        this.add = this.add.bind(this)
    }

    save() {
        $.ajax({
            url : '/setup_tree',
            type : 'post',
            data : {
                setup : JSON.stringify(this.state.data)
            }
        })
    }

    add() {
        if($(this.refs.frm_new_branch).parsley().validate()) {
            const key = this.refs.key.value
            const input = this.refs.input.value
            this.props.store.dispatch({
                type : 'setup_tree',
                booker : booker,
                key : key,
                input : input
            })
            $('#newbranch').modal('hide')
        }
    }

    render() {
        return <div className="card">
            <div className="card-body">
                <Tree id="setup" pkey="data" data={this.props.data} store={this.props.store}/>
                <button type="button" className="btn btn-primary position-fixed" style={{bottom: 18, right: 48}} onClick={this.save}>Enregistrer</button>
            </div>
            <Popup id="newbranch">
                <PopupHeader>
                    Ajouter nouvelle option
                </PopupHeader>
                <PopupBody>
                    <form ref="frm_new_branch">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Clé</label>
                                    <input type="text" className="form-control" ref="key"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Type</label>
                                    <select className="form-control" ref="input" required>
                                        <option value="value">Valeur</option>
                                        <option value="array">Tableau</option>
                                        <option value="object">Objet</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </PopupBody>
                <PopupFooter>
                    <button type="button" className="btn btn-primary" onClick={this.add}>Ajouter</button>
                </PopupFooter>
            </Popup>
        </div>
    }
}

export default SetupTree;