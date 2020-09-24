import React, {Component} from 'react';
import trans from 'ryapp/translations';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';

class RepoItem extends Component
{
    render() {
        return <div className="row">
            <div className="form-group col-md-1">
                <label className="control-label">&nbsp;</label>
                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id={`active-repo-${this.props.name}-${this.props.pkey}`} value="1" defaultChecked={this.props.data.active==1} name={`nsetup[repos][${this.props.name}][${this.props.pkey}][active]`}/>
                    <label className="custom-control-label" htmlFor={`active-repo-${this.props.name}-${this.props.pkey}`}></label>
                </div>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Protocole')}</label>
                <select name={`nsetup[repos][${this.props.name}][${this.props.pkey}][type]`} className="form-control" defaultValue={this.props.data.type}>
                    <option value="sftp">{trans('SFTP')}</option>
                    <option value="ftp">{trans('FTP')}</option>
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
            lta_repos : this.models(`props.data.row.nsetup.repos.lta`, []),
            output_repos : this.models(`props.data.row.nsetup.repos.out`, []),
            mrd_repos : this.models('props.data.row.nsetup.repos.mrd', []),
            mld_repos : this.models('props.data.row.nsetup.repos.mld', []),
            fwb_repos : this.models('props.data.row.nsetup.repos.fwb', []),
            fsu_repos : this.models('props.data.row.nsetup.repos.fsu', []),
            precon_repos : this.models('props.data.row.nsetup.repos.precon', []),
            cardit_repos : this.models('props.data.row.nsetup.repos.cardit', []),
            iftmin_repos : this.models('props.data.row.nsetup.repos.iftmin', []),
            iftsta_repos : this.models('props.data.row.nsetup.repos.iftsta', []),
        }
        this.removeLine = this.removeLine.bind(this)
        this.addLine = this.addLine.bind(this)
    }

    removeLine(index, type) {
        this.setState(state=>{
            state[type][index].deleted = true
            return state
        })
    }

    addLine(type) {
        this.setState(state=>{
            state[type].push({
                active : 1,
                type : 'sftp'
            })
            return state
        })
    }

    render() {
        if(this.props.type=='road') {
            return <React.Fragment>
                <div className="card">
                    <div className="card-header">
                        {trans('Réception PRECON')}
                    </div>
                    <div className="body">
                        {this.state.precon_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="precon" data={repo} remove={()=>this.removeLine(index, 'precon_repos')}/>)}
                        <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('precon_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        {trans('Dépôt CARDIT')}
                    </div>
                    <div className="body">
                        {this.state.cardit_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="cardit" data={repo} remove={()=>this.removeLine(index, 'cardit_repos')}/>)}
                        <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('cardit_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        {trans('Dépôts IFTMIN')}
                    </div>
                    <div className="body">
                        {this.state.iftmin_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="iftmin" data={repo} remove={()=>this.removeLine(index, 'iftmin_repos')}/>)}
                        <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('iftmin_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        {trans('Réception IFTSTA')}
                    </div>
                    <div className="body">
                        {this.state.iftsta_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="iftsta" data={repo} remove={()=>this.removeLine(index, 'iftsta_repos')}/>)}
                        <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('iftsta_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        {trans('Dépôts RESDIT')}
                    </div>
                    <div className="body">
                        {this.state.output_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="out" data={repo} remove={()=>this.removeLine(index, 'output_repos')}/>)}
                        <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('output_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                    </div>
                </div>
            </React.Fragment>
        }
        return <React.Fragment>
            <div className="card">
                <div className="card-header">
                    {trans('Réception CARDIT')}
                </div>
                <div className="body">
                    {this.state.input_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="in" data={repo} remove={()=>this.removeLine(index, 'input_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('input_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Dépôts CARDIT AWB')}
                </div>
                <div className="body">
                    {this.state.lta_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="lta" data={repo} remove={()=>this.removeLine(index, 'lta_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('lta_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Dépôts RESDIT')}
                </div>
                <div className="body">
                    {this.state.output_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="out" data={repo} remove={()=>this.removeLine(index, 'output_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('output_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Réception MRD')}
                </div>
                <div className="body">
                    {this.state.mrd_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="mrd" data={repo} remove={()=>this.removeLine(index, 'mrd_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('mrd_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Réception MLD')}
                </div>
                <div className="body">
                    {this.state.mld_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="mld" data={repo} remove={()=>this.removeLine(index, 'mld_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('mld_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Dépôt FWB')}
                </div>
                <div className="body">
                    {this.state.fwb_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="fwb" data={repo} remove={()=>this.removeLine(index, 'fwb_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('fwb_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Réception FSU')}
                </div>
                <div className="body">
                    {this.state.fsu_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} key={`repo-${index}`} name="fsu" data={repo} remove={()=>this.removeLine(index, 'fsu_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('fsu_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
        </React.Fragment>
    }
}

export default Modelizer(Repository);