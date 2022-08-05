import React, { Component } from 'react';
import trans from '../../../app/translations';
import Modelizer from '../Core/Modelizer';
import $ from 'jquery';

class CategoryLine extends Component
{
    constructor(props) {
        super(props)
        this.initial = {
            secteur : this.models('props.data.data.secteur', {
                id : 0,
                term : {
                    name : ''
                },
                children : []
            }),
            famille : this.models('props.data.data.famille', {
                id : 0,
                term : {
                    name : ''
                },
                children : []
            }),
            category : this.models('props.data.data.category', {
                id : 0,
                term : {
                    name : ''
                }
            }),
            setup : Array.isArray(this.models('props.data.nsetup', [])) ? {} : this.models('props.data.nsetup', {})
        };
        this.state = {...this.initial}

        this.handleSecteurChange = this.handleSecteurChange.bind(this)
        this.handleFamilleChange = this.handleFamilleChange.bind(this)
        this.handleCategoryChange = this.handleCategoryChange.bind(this)
        this.refreshSelects = this.refreshSelects.bind(this)
        this.handleOptionChange = this.handleOptionChange.bind(this)
    }

    handleOptionChange(event, option) {
        const checked = event.target.checked
        this.setState(state=>{
            if(!(option.namespace in state.setup))
                state.setup[option.namespace] = {}
            state.setup[option.namespace][option.name] = checked?1:0
            this.props.onChange(state)
            return state
        })
    }

    componentDidMount() {
        $(this.refs.secteurs).selectpicker({
            noneSelectedText: '--',
            container: 'body'
        });
        $(this.refs.familles).selectpicker({
            noneSelectedText: '--',
            container: 'body'
        });
        $(this.refs.categories).selectpicker({
            noneSelectedText: '--',
            container: 'body'
        });
        this.refreshSelects()
    }

    refreshSelects() {
        $(this.refs.secteurs).selectpicker('val', this.state.secteur.id)
        $(this.refs.familles).selectpicker('val', this.state.famille.id)
        $(this.refs.categories).selectpicker('val', this.state.category.id)
    }

    handleSecteurChange(event) {
        const value = event.target.value
        this.setState(state=>{
            let tree = this.props.categories.filter(item=>item.id==value)[0]
            state.secteur = tree
            state.famille = {
                id : 0,
                term : {
                    name : ''
                },
                children : []
            }
            state.category = {
                id : 0,
                term : {
                    name : ''
                }
            }
            this.props.onChange(state)
            if(this.initial.secteur.id!=this.models('state.secteur.id') && this.props.onManualChange)
                this.props.onManualChange()
            return state
        })
        window.setTimeout(()=>{
            $(this.refs.familles).selectpicker('refresh')
            $(this.refs.categories).selectpicker('refresh')
        }, 0)
    }

    handleFamilleChange(event) {
        const value = event.target.value
        this.setState(state=>{
            if(state.secteur) {
                let tree = state.secteur.children.filter(item=>item.id==value)[0]
                state.famille = tree
                state.category = {
                    id : 0,
                    term : {
                        name : ''
                    }
                }
                this.props.onChange(state)
                if(this.initial.famille.id!=this.models('state.famille.id') && this.props.onManualChange)
                    this.props.onManualChange()
            }
            return state
        })
        window.setTimeout(()=>{
            $(this.refs.categories).selectpicker('refresh')
        }, 0)
    }

    handleCategoryChange(event) {
        const value = event.target.value
        this.setState(state=>{
            if(state.famille) {
                let tree = state.famille.children.filter(item=>item.id==value)[0]
                state.category = tree
                this.props.onChange(state)
                if(this.initial.category.id!=this.models('state.category.id') && this.props.onManualChange)
                    this.props.onManualChange()
            }
            return state
        })
    }

    render() {
        return <li className="list-group-item border-0">
            <div className="d-flex">
                <select ref="secteurs" className="form-control" title={trans('Sélectionnez un secteur')} value={this.models('state.secteur.id', '')} onChange={this.handleSecteurChange}>
                    {this.props.categories.map(secteur=><option key={`${this.props.pkey}-secteur-${secteur.id}`} value={secteur.id}>{secteur.term.name}</option>)}
                </select>
                <select ref="familles" className="form-control ml-2" title={trans('Sélectionnez une famille')} value={this.models('state.famille.id', '')} onChange={this.handleFamilleChange}>
                    {this.models('state.secteur.children', []).map(famille=><option key={`${this.props.pkey}-famille-${famille.id}`} value={famille.id}>{famille.term.name}</option>)}
                </select>
                <select ref="categories" className="form-control ml-2" title={trans('Sélectionnez une sous famille')} value={this.models('state.category.id', '')} onChange={this.handleCategoryChange}>
                    {this.models('state.famille.children', []).map(category=><option key={`${this.props.pkey}-category-${category.id}`} value={category.id}>{category.term.name}</option>)}
                </select>
                <button className="btn" type="button" onClick={this.props.remove}><i className="fam fam-2x fam-trash-o text-danger"></i></button>
            </div>
            <small>{trans("Paramètre de l'option pour les produits de cette catégorie.")}</small>
            <div className="bg-light border p-3 rounded">
                <div className="row">
                    {this.props.setup.option_table.map(option=><div key={`category-${this.props.data.id}-option-${option.name}`} className="col-md-4">
                        <label className="fancy-checkbox">
                            <input type="checkbox" checked={this.models(`state.setup.${option.namespace}.${option.name}`, 0)==1} onChange={event=>this.handleOptionChange(event, option)}/>
                            <span>{option.title}</span>
                        </label>
                    </div>)}
                </div>
            </div>
        </li>
    }
}

Modelizer(CategoryLine)

class CheckTree extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            lines : this.props.data
        }
        this.addLine = this.addLine.bind(this)
        this.remove = this.remove.bind(this)
    }

    addLine() {
        this.setState(state=>{
            state.lines.push({})
            return state
        })
    }

    remove(key) {
        this.setState(state=>{
            state.lines[key].deleted = true
            return state
        })
    }

    refreshSelects() {
        for(var i=0; i<this.state.lines.length; i++) {
            //this.refs[`${this.props.pkey}-categoryline-${i}`].refreshSelects()
        }
    }

    render() {
        return <div>
            <ul className="list-group">
                {this.state.lines.map((line, key)=>!line.deleted?<CategoryLine setup={this.props.setup} ref={`${this.props.pkey}-categoryline-${key}`} key={`${this.props.pkey}-categoryline-${key}`} pkey={`${this.props.pkey}-categoryline-${key}`} data={line} categories={this.props.categories} remove={()=>this.remove(key)} onChange={value=>line.data=value} onManualChange={this.props.onChange}/>:null)}
            </ul>
            <button type="button" className="btn text-blue" onClick={this.addLine}><i className="fa fa-plus"></i> {trans('Ajouter une categorie')}</button>
        </div>
    }
}

export default CheckTree;