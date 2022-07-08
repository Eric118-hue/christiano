import React, {Component} from 'react';
import trans from 'ryapp/translations';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import $ from 'jquery';

class RepoItem extends Component
{
    render() {
        const prefix = this.props.prefix ? this.props.prefix + '[nsetup]':'nsetup'
        return <div className="row">
            <div className="form-group col-md-1">
                <label className="control-label">&nbsp;</label>
                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id={`active-repo-${this.props.name}-${this.props.pkey2}-${this.props.pkey}`} value="1" defaultChecked={this.props.data.active==1} name={`${prefix}[repos][${this.props.name}][${this.props.pkey}][active]`}/>
                    <label className="custom-control-label" htmlFor={`active-repo-${this.props.name}-${this.props.pkey2}-${this.props.pkey}`}></label>
                </div>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Protocole')}</label>
                <select name={`${prefix}[repos][${this.props.name}][${this.props.pkey}][type]`} className="form-control" defaultValue={this.props.data.type}>
                    <option value="sftp">{trans('SFTP')}</option>
                    <option value="ftp">{trans('FTP')}</option>
                </select>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Hôte')}</label>
                <input type="text" className="form-control" placeholder="example.com" required defaultValue={this.props.data.host} name={`${prefix}[repos][${this.props.name}][${this.props.pkey}][host]`}/>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Login')}</label>
                <input type="text" className="form-control" defaultValue={this.props.data.username} required name={`${prefix}[repos][${this.props.name}][${this.props.pkey}][username]`}/>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Mot de passe')}</label>
                <input type="text" className="form-control" defaultValue={this.props.data.password} required name={`${prefix}[repos][${this.props.name}][${this.props.pkey}][password]`}/>
            </div>
            <div className="form-group col-md-2">
                <label className="control-label">{trans('Chemin')}</label>
                <input type="text" className="form-control" defaultValue={this.props.data.path} name={`${prefix}[repos][${this.props.name}][${this.props.pkey}][path]`}/>
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

class AirlineAcquiringMethod extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            acquiring_methods: [
                {
                    id: 'appscan',
                    label: 'AppScan'
                }
            ]
        }
        this.acquiring_method = React.createRef()
    }

    componentDidMount() {
        $(this.acquiring_method.current).selectpicker({
          noneSelectedText: '--',
          container: 'body'
        });
      }

    render() {
        const prefix = this.props.prefix ? this.props.prefix + '[nsetup]' : 'nsetup'
        return <div className="align-items-center mb-2 row">
            <div className="col-md-6">
                <select ref={this.acquiring_method} className="form-control" name={`${prefix}[acquiring_methods]`}>
                    {this.state.acquiring_methods.map(acquiring_method=><option key={`acquiring-method-${acquiring_method.id}`} value={acquiring_method.id}>{acquiring_method.label}</option>)}
                </select>
            </div>
        </div>
    }
}

Modelizer(AirlineAcquiringMethod)

class EdiToAirline extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            edis: this.props.selectEdis
        }
        this.edi = React.createRef()
    }

    componentDidMount() {
        $(this.edi.current).selectpicker({
          noneSelectedText: '--',
          container: 'body'
        });
    }

    render() {
        const prefix = this.props.prefix ? this.props.prefix + '[nsetup]' : 'nsetup'
        return <div className="align-items-center mb-2 row">
            <div className="col-md-6">
                <select ref={this.edi} className="form-control" name={`${prefix}[edi][id]`}>
                    {this.state.edis.map(edi=><option key={`edi-${edi.id}`} value={edi.id}>{edi.edi_address}</option>)}
                </select>
            </div>
        </div>
    }
}

Modelizer(EdiToAirline)

class Repository extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            airlines: this.models(`props.data.nsetup.acquiring_methods`, [{}]),
            edis: this.models( `props.data.nsetup.edis`, [{}]),
            scan_repos : this.models(`props.data.nsetup.repos.scan`, []),
            input_repos : this.models(`props.data.nsetup.repos.in`, []),
            lta_repos : this.models(`props.data.nsetup.repos.lta`, []),
            mrd_repos : this.models('props.data.nsetup.repos.mrd', []),
            mld_repos : this.models('props.data.nsetup.repos.mld', [])
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
        return <React.Fragment>
            <div className="card">
                <div className="card-header">
                    {trans('DATA Acquisition')}
                </div>
                <div className="body">
                    <div className='form-group pt-3 border-bottom col-md-4'>
                        <AirlineAcquiringMethod prefix={this.props.prefix} key={`nsetup-airline-acquiring-method`}/>
                    </div>
                    {this.state.scan_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} pkey2={this.props.data.id} prefix={this.props.prefix} key={`repo-${index}`} name="scan" data={repo} remove={()=>this.removeLine(index, 'scan_repos')}/>)}
                    <button type="button" className="btn btn-primary my-4" onClick={()=>this.addLine('scan_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Réception CARDIT')}
                </div>
                <div className="body">
                    <div className='form-group pt-3 border-bottom col-md-4'>
                        <EdiToAirline selectEdis={this.props.selectEdis} prefix={this.props.prefix} key={`nsetup-edi-airline-edi-id`}/>
                    </div>
                    {this.state.input_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} pkey2={this.props.data.id} prefix={this.props.prefix} key={`repo-${index}`} name="in" data={repo} remove={()=>this.removeLine(index, 'input_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('input_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Dépôts CARDIT AWB')}
                </div>
                <div className="body">
                    {this.state.lta_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} pkey2={this.props.data.id} pkey2={this.props.data.id} prefix={this.props.prefix} key={`repo-${index}`} name="lta" data={repo} remove={()=>this.removeLine(index, 'lta_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('lta_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Dépôt MLD')}
                </div>
                <div className="body">
                    {this.state.mld_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} pkey2={this.props.data.id} prefix={this.props.prefix} key={`repo-${index}`} name="mld" data={repo} remove={()=>this.removeLine(index, 'mld_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('mld_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    {trans('Réception MRD')}
                </div>
                <div className="body">
                    {this.state.mrd_repos.filter(it=>!it.deleted).map((repo, index)=><RepoItem pkey={index} pkey2={this.props.data.id} prefix={this.props.prefix} key={`repo-${index}`} name="mrd" data={repo} remove={()=>this.removeLine(index, 'mrd_repos')}/>)}
                    <button type="button" className="btn btn-primary mb-4" onClick={()=>this.addLine('mrd_repos')}><i className="fa fa-plus"></i> {trans('Ajouter un dépôt')}</button>
                </div>
            </div>
        </React.Fragment>
    }
}

export default Modelizer(Repository);