import React, {Component} from 'react';
import moment from 'moment';
import Ry from '../../Core/Ry';
import Countdown from './Countdown';
import trans from '../../../../app/translations';
import Modelizer from '../../Core/Modelizer';
import Localtime from './Localtime';
import {Route} from './Status';

class Reception extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            receptacles : this.props.data.receptacles,
            updated_resdits : this.props.data.updated_resdits,
            dialogs : [{}]
        }
        this.handleReceptacleStatusChange = this.handleReceptacleStatusChange.bind(this)
        this.handleAllReceptacleStatusChange = this.handleAllReceptacleStatusChange.bind(this)
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidMount() {
        this.unsubscribe = this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='resdit' && storeState.event=='reception' && storeState.cardit_id==this.props.data.id) {
                this.setState(state => {
                    state.updated_resdits.reception = storeState
                    state.dialogs.push({})
                    return state
                })
            }
        })
    }

    handleReceptacleStatusChange(receptacle, status) {
        this.setState(state=>{
            delete state.updated_resdits.reception
            let found_receptacle = state.receptacles.find(item=>item.id==receptacle.id)
            if(found_receptacle) {
                if(!found_receptacle.statuses) {
                    found_receptacle.statuses = {}
                }
                found_receptacle.statuses.reception = status
            } 
            return state
        })
    }

    handleAllReceptacleStatusChange(status) {
        this.setState(state=>{
            state.receptacles.map(item=>{
                if(!item.statuses) {
                    item.statuses = {}
                }
                item.statuses.reception = status
            })
            return state
        })
    }

    render() {
        let files = null
        let files_tablet = null
        if(this.state.updated_resdits.reception) {
            files = <div className="row">
                {this.state.updated_resdits.reception.files.map(file=><a key={`download-${this.props.data.id}-resdit-${file}`} className="btn btn-info col-md-3 font-10 pt-2 m-2" href={`#dialog/export/resdit-${file}-${this.state.updated_resdits.reception.id}.txt`} target="_blank">RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file}</span></a>)}
            </div>  
            files_tablet =  <div className="row">
                {this.state.updated_resdits.reception.files.map(file=><a key={`download-${this.props.data.id}-resdit-${file}`} className="btn btn-info col-md-4 font-10 pt-2 m-2" href={`#dialog/export/resdit-${file}-${this.state.updated_resdits.reception.id}.txt`} target="_blank">RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file}</span></a>)}
            </div>  
        }
        return <div className="row">
            <div className="col-md-12 d-md-block d-xl-none">
                <div className="row text-left text-body">
                    {this.models('state.updated_resdits.reception', false)?null:<div className="col-md-4">
                        <div className="skillContainer d-flex align-items-center justify-content-around">
                            <Countdown from={moment.utc(this.props.data.nsetup.consignment_completion).local()} to={moment.utc(this.props.data.nsetup.handover_origin_cut_off).local()}/>
                        </div>
                    </div>}
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-md-6">
                                <small className="text-muted">{trans('Numéro du container')} :</small><br/>
                                {this.props.data.nsetup.container_id}
                            </div>
                            <div className="col-md-6">
                                <small className="text-muted">{trans('Nombre de récipient')} :</small><br/>
                                {this.props.data.nsetup.nreceptacles}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        {files_tablet}
                    </div>
                </div>
            </div>
            <div className="col-xl-3 d-md-none d-xl-block">
                <div className="blockTemps">
                    {this.models('state.updated_resdits.reception', false)?null:<React.Fragment>
                        <h3>{trans('Temps restant pour valider la réception')} :</h3>
                        <div className="skillContainer d-flex align-items-center justify-content-around">
                            <Countdown from={moment.utc(this.props.data.nsetup.consignment_completion).local()} to={moment.utc(this.props.data.nsetup.handover_origin_cut_off).local()}/>
                        </div>
                    </React.Fragment>}
                    <ul className="info">
                        <li>
                            {trans('Numéro du container')} :
                            <span>{this.props.data.nsetup.container_id}</span>
                        </li>
                        <li>
                            {trans('Container Journey ID')} :
                            <span>{this.props.data.nsetup.cjid}</span>
                        </li>
                        <li>
                            {trans('Nombre de récipient')} :
                            <span>{this.props.data.nsetup.nreceptacles}</span>
                        </li>
                        <Route data={this.props.data}/>
                    </ul>
                    {files}
                </div>
            </div>
            <div className="col-xl-9">
                <div className="table-responsive">
                    <form name={`frm_cardit${this.props.data.id}`} action={`/reception`} method="post">
                        {this.state.dialogs.map((v,k)=><Ry key={`ajaxform-${k}`} title="ajaxform"/>)}
                        <input type="hidden" name="ry"/>
                        <input type="hidden" name="id" value={this.props.data.id}/>
                        <input type="hidden" name="consignment_event" value="reception"/>
                        <table className="table tableRecap">
                            <thead>
                                <tr>
                                    <th rowSpan="2" colSpan="5"
                                        className="colorVert noBor pl-0 text-left">
                                        {(this.models('state.updated_resdits.reception.files', []).length>0)?trans('Réception validée le :date à :time par :author - RESDIT :resdits envoyé:plural_resdits', {
                                            resdits : this.state.updated_resdits.reception.files.join(', '),
                                            plural_resdits : this.state.updated_resdits.reception.files.length>1?'s':'',
                                            date : moment.utc(this.state.updated_resdits.reception.created_at).local().format('DD/MM/YYYY'),
                                            time : moment.utc(this.state.updated_resdits.reception.created_at).local().format('HH:mm'),
                                            author : `${this.state.updated_resdits.reception.author.profile.gender_label} ${this.state.updated_resdits.reception.author.profile.official}`
                                        }):null}    
                                    </th>
                                    <th colSpan={this.props.consignmentEvents.length} className="thTop">{trans('Réception')}</th>
                                </tr>
                                <tr className="thLeft">
                                    {this.props.consignmentEvents.map(consignment_event=><th key={`consignment_event-${consignment_event.code}`}>{trans(consignment_event.trans_interpretation)}</th>)}
                                </tr>
                                <tr>
                                    <th width="300">{trans('Numéro du récipient')}</th>
                                    <th>{trans('Flag')} <i className="icon-info"></i></th>
                                    <th width="250">{trans('Container Journey ID')}</th>
                                    <th>{trans('Type de récipient')}</th>
                                    <th>{trans('Poids (Kg)')}</th>
                                    {this.props.consignmentEvents.map(consignment_event=><th key={`consignment_event-checkall-${consignment_event.code}`} width="10%">
                                        <label className="fancy-radio custom-color-green m-auto">
                                            <input type="radio" name="checkall[status]" onChange={()=>this.handleAllReceptacleStatusChange(consignment_event.code)}/>
                                            <span><i className="m-0"></i></span>
                                        </label>
                                    </th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.receptacles.map((receptacle, index)=><tr key={`content-reception-${receptacle.id}`}>
                                    <td className="text-left">
                                        {receptacle.nsetup.receptacle_id}
                                    </td>
                                    <td>{receptacle.nsetup.handling}</td>
                                    <td>{receptacle.nsetup.nesting}</td>
                                    <td>{receptacle.nsetup.type.interpretation}</td>
                                    <td>{receptacle.nsetup.weight}</td>
                                    {this.props.consignmentEvents.map(consignment_event=><td key={`consignment_event-check-${receptacle.id}-${consignment_event.code}`} className="text-center">
                                        <label className="fancy-radio m-auto custom-color-green">
                                            <input name={`receptacles[${receptacle.id}][status]`} type="radio" value={consignment_event.code} checked={this.cast(receptacle, 'statuses.reception', -100)==consignment_event.code} onChange={()=>this.handleReceptacleStatusChange(receptacle, consignment_event.code)}/>
                                            <span><i className="mr-0"></i></span>
                                        </label>
                                    </td>)}
                                </tr>)}
                                <tr>
                                    <td colSpan="5" className="border-right-0 noBg"></td>
                                    <td colSpan={this.props.consignmentEvents.length} className="border-left-0 border-right-0 p-0">
                                        {(this.models('state.updated_resdits.reception', false) || this.props.readOnly)?null:<button className="btn btn-orange rounded-0">{trans('STEP')} 1 :
                                            {trans('Valider')}</button>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Localtime/>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Reception);