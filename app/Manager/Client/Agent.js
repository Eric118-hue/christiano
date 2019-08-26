import React, {Component} from 'react';
import NavigableModel from '../../../vendor/Ry/Core/NavigableModel';
import trans from '../../translations';
import {Img} from '../../../vendor/Ry/Core/Ry';
import {GENDERMAN} from '../../../vendor/Ry/Admin/User/constants';
import $ from 'jquery';
import swal from 'sweetalert2';
import homme from '../../../medias/images/profil-homme.jpg';
import femme from '../../../medias/images/profil-femme.jpg';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';

class AgentItem extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            removing : false,
            active : this.props.data.active,
            loading : false
        }
        this.promptRemove = this.promptRemove.bind(this)
        this.activeHandler = this.activeHandler.bind(this)
    }

    activeHandler(event) {
        this.setState({
            active : event.target.checked,
            loading : true
        })
        const dis = this
        $.ajax({
            url : '/activate_user',
            type : 'post',
            data : {
                active : event.target.checked,
                id : this.props.data.id,
                role_id : this.props.roles
            },
            success : function(){
                dis.setState({
                    loading : false
                })
            }
        })
    }

    promptRemove(event) {
        event.preventDefault();
        const dis = this;
        swal({
            title: trans('confirmez_vous_la_suppression_de_cet_utilisateur'),
            text: trans('cet_utilisateur_sera_supprime_definitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('oui_je_confirme'),
            confirmButtonClass: 'bg-danger'
        }).then((result) => {
            if (result.value) {
                dis.setState({
                    removing: true
                });
                dis.props.remove({
                    success : ()=>{
                        swal(
                            trans('supprime'),
                            trans('lutilisateur_a_ete_supprime'),
                            'success'
                        )
                    },
                    error : () => {
                        dis.setState({
                            removing: false
                        });
                    }
                });
            }
        })
        return false
    }

    render() {
        let metas = []
        if(this.props.data.details) {
            for(let modulename in this.props.data.details) {
                for(let key in this.props.data.details[modulename]) {
                    let detail = this.props.data.details[modulename][key]
                    if(!detail)
                        continue;
                    if(!detail.label)
                        continue;
                    metas.push(<React.Fragment key={`${this.props.pkey}-detail-${modulename}-${key}`}>
                        <br/>
                        <label>{detail.label} :</label> <span className="text-orange">{detail.value}</span>
                    </React.Fragment>)
                }
            }
        }
        return <div className="row">
            <div className="col-md-2 text-center">
                <Img src={this.props.data.medias.length>0?this.props.data.medias[0].fullpath:(!this.props.data.profile?homme : (this.props.data.profile.gender===GENDERMAN?homme:femme))} className="rounded-circle img-fluid img-thumbnail icon-110"/>
            </div>
            <div className="col-md-3">
                <h2>{this.props.data.name}</h2>
                <label>Station :</label>
                {this.models('props.data.airport')?<span className="text-orange text-capitalize mr-2"> {this.models('props.data.airport.name')} - {this.models('props.data.airport.country.nom')}</span>:null}
            </div>
            <div className="col-md-3 position-absolute-sm">
                <div className="custom-control custom-switch">
                    <input type="checkbox" className={`custom-control-input ${this.state.active?'':'disabled'}`} id={`user-toggle-active-${this.props.data.id}`} onChange={this.activeHandler} checked={this.state.active} value="1"/>
                    <label className="custom-control-label" htmlFor={`user-toggle-active-${this.props.data.id}`}>{this.state.active?trans('compte_actif'):trans('compte_inactif')} <i className={`fa fa-sync-alt fa-spin ${this.state.loading?'':'d-none'}`}></i></label>
                </div>
                {this.props.data.nactivities.length>0?<React.Fragment>
                    <label>{trans("derniere_connexion")} :</label> <span className="text-orange">{moment.utc(this.props.data.nactivities[this.props.data.nactivities.length-1].datetime).local().fromNow()}</span><br/>
                </React.Fragment>:null}
            </div>
            <div className="col-md-2">
                <p><a href={`mailto:${this.props.data.email}`}><i className="fa fa-envelope"></i> {this.props.data.email}</a></p>
                {Object.values(this.props.data.contacts).map((contact, key)=><p key={`user-${this.props.data.id}-contact-${key}`}><i className={`fa ${contact.ndetail.schedule==='fixe'?'fa-phone':'fa-mobile'}`}></i> {contact.ndetail.value}</p>)}
            </div>
            <div className="col-md-2 text-right">
                <div>
                    <a href={`/edit_agent?id=${this.props.data.id}&customer_id=${this.props.customerId}&roles[]=4`} className="btn btn-primary mb-3 w-100"><strong>{trans('editer')}</strong></a>
                </div>
                <div>
                    <a href="#" onClick={this.promptRemove} className="btn btn-orange text-white mb-3 w-100"><strong>{trans('supprimer')}</strong></a>
                </div>
            </div>
        </div>
    }
}

Modelizer(AgentItem)

class Agent extends NavigableModel
{
    constructor(props) {
        super(props)
        this.model = 'users'
        this.endpoint = '/agents?customer_id=' + this.props.customerId
    }

    beforelist() {
        return <a className="btn btn-primary" href={`/add_agent?roles[]=4&customer_id=${this.props.customerId}`}><i className="fa fa-plus-circle"></i> {trans('Ajouter agent')}</a>
    }

    item(agent, key) {
        return <div className="border-bottom pb-2 pt-2" key={`agent-${agent.id}`}>
            <AgentItem data={agent} store={this.props.store} customerId={this.props.customerId} remove={(callbacks)=>this.remove(key, agent.id, callbacks)}/>
        </div>
    }

    render() {
        let pagination = <ul className={`list-inline m-0 ${this.props.data.per_page>=this.props.data.total?'d-none':''}`}>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toFirst}><i className="fa fa-angle-double-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toPrevious}><i className="fa fa-angle-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toNext}><i className="fa fa-angle-right"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toEnd}><i className="fa fa-angle-double-right"></i></a>
            </li>
        </ul>

        return <div className="col-12">            
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {this.nopaginate?null:pagination}
            </div>
            {this.searchEngine()}
            {this.state.data.map((item, key)=>this.item(item, key))}
            <div className="justify-content-between m-0 row">
                {this.afterlist()}
                {this.nopaginate?null:pagination}
            </div>
        </div>
    }
}

export default Agent;