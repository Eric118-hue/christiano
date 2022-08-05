import React, { Component } from 'react';
import trans from '../../../../app/translations';
import homme from '../../../../medias/images/profil-homme.jpg';
import femme from '../../../../medias/images/profil-femme.jpg';
import swal from 'sweetalert2';
import $ from 'jquery';
import NavigableModel from '../../Core/NavigableModel';
import moment from 'moment';
import {GENDERMAN} from './constants';
import {Img} from '../../Core/Ry';

const MODEL = 'users'

export class User extends Component
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
        this.editLink = this.editLink.bind(this)
    }

    componentDidMount() {
        var AmDiffered = this.props.store
        $('a[href^="#dialog/"]').each(function () {
            let dis = $(this);
            const f = function (e) {
                e.preventDefault();
                AmDiffered.dispatch({type: 'dialog', url: dis.attr('href').replace('#dialog', ''), method: 'get'});
                return false;
            };
            if (!this.dialogBound) {
                $(this).bind('click', f);
                this.dialogBound = true;
            }
        });
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
            title: trans('Confirmez-vous la suppression de cet utilisateur?'),
            text: trans('Cet utilisateur sera supprimé définitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme'),
            confirmButtonClass: 'bg-danger'
        }).then((result) => {
            if (result.value) {
                dis.setState({
                    removing: true
                });
                dis.props.remove({
                    success : ()=>{
                        swal(
                            trans('Supprimé'),
                            trans("L'utilisateur a été supprimé"),
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

    editLink(roles_queries) {
        return <a href={`#dialog/edit_user/${this.props.data.id}?${roles_queries.join('&')}`} className="btn btn-primary mb-3 w-100"><strong>{trans('Éditer')}</strong></a>
    }

    render() {
        let roles
        let metas = []
        let roles_queries = []
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
        if(this.props.data.roles) {
            this.props.data.roles.map(role=>{
                roles_queries.push(`roles[]=${role.id}`)
            })
            roles = <div className="col-md-3">
                <h2>{this.props.data.name}</h2>
                <label>{trans("Fonction")} :</label> {this.props.data.roles.map((role, key)=><span key={`user-${this.props.data.id}-fonction-${key}`} className="text-orange text-capitalize mr-2">{trans(role.name)}</span>)}
                {metas}
            </div>
        }
        else {
            roles = <div className="col-md-3">
                <h2>{this.props.data.name}</h2>
                {metas}
            </div>
        }

        const cardStyle = {height:"150px"};

        return <div className="card mt-3 mb-3">
            <div className="body" style={cardStyle}>
                <div className="row">
                    <div className="col-md-2 text-center">
                        <Img src={this.props.data.medias.length>0?this.props.data.medias[0].fullpath:(!this.props.data.profile?homme : (this.props.data.profile.gender===GENDERMAN?homme:femme))} className="rounded-circle img-fluid img-thumbnail icon-110"/>
                    </div>
                    {roles}
                    <div className="col-md-3 position-absolute-sm">
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className={`custom-control-input ${this.state.active?'':'disabled'}`} id={`user-toggle-active-${this.props.data.id}`} onChange={this.activeHandler} checked={this.state.active} value="1"/>
                            <label className="custom-control-label" htmlFor={`user-toggle-active-${this.props.data.id}`}>{this.state.active?trans('Compte actif'):trans('Compte inactif')} <i className={`fa fa-sync-alt fa-spin ${this.state.loading?'':'d-none'}`}></i></label>
                        </div>
                        {this.props.data.nactivities.length>0?<React.Fragment>
                            <label>{trans("Dernière connexion")} :</label> <span className="text-orange">{moment.utc(this.props.data.nactivities[this.props.data.nactivities.length-1].datetime).local().fromNow()}</span><br/>
                        </React.Fragment>:null}
                    </div>
                    <div className="col-md-2">
                        <p><a href={`mailto:${this.props.data.email}`}><i className="fa fa-envelope"></i> {this.props.data.email}</a></p>
                        {Object.values(this.props.data.contacts).map((contact, key)=><p key={`user-${this.props.data.id}-contact-${key}`}><i className={`fa ${contact.ndetail.schedule==='fixe'?'fa-phone':'fa-mobile'}`}></i> {contact.ndetail.value}</p>)}
                    </div>
                    <div className="col-md-2 text-right">
                        <div>
                            {this.editLink(roles_queries)}
                        </div>
                        <div>
                            <a href="#" onClick={this.promptRemove} className="btn btn-orange text-white mb-3 w-100"><strong>{trans('Supprimer')}</strong></a>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    }
}

class Users extends NavigableModel
{
    constructor(props) {
        super(props)
        this.endpoint = this.props.data.path
        this.model = MODEL
        this.nopaginate = true
    }

    item(user, key) {
        return <User key={`list-user-${key}`} data={user} store={this.props.store} remove={(callbacks)=>this.remove(key, user.id, callbacks)}/>
    }

    beforelist() {
        let roles_queries = []
        if(this.props.data.roles) {
            this.props.data.roles.map(role=>{
                roles_queries.push(`roles[]=${role}`)
            })
        }
        return <a className="btn btn-primary" href={`#dialog/add_user?${roles_queries.join('&')}`}>
            {this.props.data.add_role} <i className="fa fa-plus"></i>
        </a>
        
    }

}

export default Users;