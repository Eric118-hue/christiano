import React, { Component } from 'react';
import trans from '../../../app/translations';
import Modelizer from '../Core/Modelizer';
import $ from 'jquery';

class Authorizations extends Component
{
    constructor(props) {
        super(props)
        this.sectionForRole = this.sectionForRole.bind(this)
    }

    toggleCheck(role) {
        if($(`[data-role=${role.id}]:checked`).length==0) {
            $(`[data-role=${role.id}]`).prop('checked', true)
        }
        else {
            $(`[data-role=${role.id}]`).prop('checked', false)
        }
    }

    sectionForRole(section, role, fallback) {
        if(role.layout_overrides.length>0) {
            let links = role.layout_overrides[0].setup.filter(item=>item.title==section.title)
            if(links.length>0) {
                return links[0]
            }
            return false
        }
        return fallback
    }

    render() {
        return <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    {trans('Gestion des droits')}
                </div>
                <div className="body">
                    <table className="table">
                        <thead>
                            <tr className="bg-stone">
                                <th className="text-capitalize">{trans('Sections')} / {trans('Status')}</th>
                                {this.props.data.layout.roles.map(role=><th key={`role-${role.id}`} className="text-capitalize text-center">{trans(role.name)} <input type="hidden" name={`layout[roles][${role.id}][layout_overrides][0][id]`} value={role.layout_overrides.length>0?role.layout_overrides[0].id:''}/></th>)}
                            </tr>
                            <tr>
                                <th className="text-capitalize">{trans('Sidebar')}</th>
                                {this.props.data.layout.roles.map(role=><th key={`togglecheck-${role.id}`} className="text-center">
                                    <button type="button" className="btn btn-primary" onClick={()=>this.toggleCheck(role)}>{trans('Cocher/Décocher')}</button>
                                </th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.layout.sections[0].setup.map((section, index)=><tr key={`section-${section.title}`}>
                                <td>{section.title}</td>
                                {this.props.data.layout.roles.map((role)=><td key={`section-${section.title}-check-${role.id}`} className="text-center">
                                    <label className="fancy-checkbox">
                                        <input name={`layout[roles][${role.id}][layout_overrides][0][setup][${index}][href]`} data-role={role.id} type="checkbox" defaultChecked={this.sectionForRole(section, role, this.props.data.layout.sections[0].setup[index].href)} value="1"/>
                                        <span></span>
                                    </label>
                                </td>)}
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Authorizations);