import React, {Component} from 'react';
import trans from '../../translations';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';

class RepoItem extends Component
{
    render() {
        return <div className="row">
            <div className="form-group col-md-1">
                <label className="control-label">&nbsp;</label>
                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id={`active-repo-${this.props.pkey}`} value="1" defaultChecked={this.props.data.active==1} name={`nsetup[repos][${this.props.name}][${this.props.pkey}][active]`}/>
                    <label className="custom-control-label" htmlFor={`active-repo-${this.props.pkey}`}></label>
                </div>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Protocole')}</label>
                <select name={`nsetup[repos][${this.props.name}][${this.props.pkey}][type]`} className="form-control" defaultValue={this.props.data.type}>
                    <option value="sftp">{trans('SFTP')}</option>
                </select>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Hôte')}</label>
                <input type="text" className="form-control" placeholder="example.com" required defaultValue={this.props.data.host} name={`nsetup[repos][${this.props.name}][${this.props.pkey}][host]`}/>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Login')}</label>
                <input type="text" className="form-control" defaultValue={this.props.data.username} required name={`nsetup[repos][${this.props.name}][${this.props.pkey}][username]`}/>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Mot de passe')}</label>
                <input type="text" className="form-control" defaultValue={this.props.data.password} required name={`nsetup[repos][${this.props.name}][${this.props.pkey}][password]`}/>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Chemin')}</label>
                <input type="text" className="form-control" defaultValue={this.props.data.path} name={`nsetup[repos][${this.props.name}][${this.props.pkey}][path]`}/>
            </div>
            <div className="form-group col-md-1">
                <label className="control-label">&nbsp;</label>
                <div>
                    <button className="btn btn-danger" type="button" onClick={this.props.remove}><i className="fa fa-trash"></i></button>
                </div>
            </div>
        </div>
    }
}

class Repository extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            input_repos : this.models(`props.data.row.nsetup.repos.in`, []),
            output_repos : this.models(`props.data.row.nsetup.repos.out`, [])
        }
        this.addInputline = this.addInputline.bind(this)
        this.addOutputline = this.addOutputline.bind(this)
        this.removeOutputline = this.removeOutputline.bind(this)
        this.removeInputline = this.removeInputline.bind(this)
    }

    removeOutputline(index) {
        this.setState(state=>{
            state.output_repos[index].deleted = true
            return state
        })
    }

    removeInputline(index) {
        this.setState(state=>{
            state.input_repos[index].deleted = true
            return state
        })
    }

    addInputline() {
        this.setState(state=>{
            state.input_repos.push({
                active : 1,
                type : 'sftp'
            })
            return state
        })
    }

    addOutputline() {
        this.setState(state=>{
            state.output_repos.push({
                active : 1,
                type : 'sftp'
            })
            return state
        })
    }

    render() {
        return <React.Fragment>
            <div className="card">
                <div className="card-header">
                    {trans('Dépôts CARDIT')}
                </div>
                <div className="body">
                    {this.state.input_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="in" data={repo} remove={()=>this.removeInputline(index)}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={this.addInputline}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Dépôts RESDIT')}
                </div>
                <div className="body">
                    {this.state.output_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="out" data={repo} remove={()=>this.removeOutputline(index)}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={this.addOutputline}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
        </React.Fragment>
    }
}

export default Modelizer(Repository);