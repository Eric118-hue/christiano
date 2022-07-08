import React, {Component} from 'react';
import moment from 'moment';
import Ry from 'ryvendor/Ry/Core/Ry';
import Countdown from './Countdown';
import trans from '../../translations';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import Localtime from './Localtime';
import {Popup, PopupBody} from 'ryvendor/bs/bootstrap';
import $ from 'jquery';

export class Route extends Component
{
    render() {
        return this.props.data.nsetup.transports.map(transport=><React.Fragment key={`transport-${transport.conveyence_reference}`}>
            <li>{trans('Départ')}<br/>
    <strong className="text-wrap">{transport.departure_location.country.nom} - {transport.departure_location.iata} - {transport.departure_location.name} {trans('le')} {moment(transport.departure_datetime_lt).format('DD/MM/YYYY HH:mm')}{(this.models('props.data.nsetup.transports.'+this.props.transportStep+'.departure_datetime_lt', false) && this.models('props.data.nsetup.transports.'+this.props.transportStep+'.departure_datetime_lt', false)!=transport.departure_datetime_lt)?<React.Fragment> - <span className="text-danger">{trans('Horaire modifié : :datetime', {datetime : moment(this.models('props.data.transports.'+this.props.transportStep+'.departure_datetime_lt')).format('DD/MM/YYYY HH:mm')})}</span></React.Fragment>:null}</strong></li>
            <li>{trans('Arrivée')}<br/>
            <strong className="text-wrap">{this.cast(transport, 'arrival_location.country.nom', this.cast(transport, 'arrival_location.adresse.ville.country.nom'))} - {this.cast(transport, 'arrival_location.iata', this.cast(transport, 'arrival_location.cardit'))} - {this.cast(transport, 'arrival_location.name')} {trans('le')} {transport.arrival_datetime_lt!='0000-00-00 00:00:00'?moment(transport.arrival_datetime_lt).format('DD/MM/YYYY HH:mm'):'00/00/00 00:00'}{(this.models('props.data.nsetup.transports.'+this.props.transportStep+'.arrival_datetime_lt', false) && this.models('props.data.nsetup.transports.'+this.props.transportStep+'.arrival_datetime_lt', false)!=transport.arrival_datetime_lt)?<React.Fragment> - <span className="text-danger">{trans('Horaire modifié : :datetime', {datetime : moment(this.models('props.data.transports.'+this.props.transportStep+'.arrival_datetime_lt')).format('DD/MM/YYYY HH:mm')})}</span></React.Fragment>:null}</strong></li>
        </React.Fragment>)
    }
}

Modelizer(Route)

class ReceptacleLine extends Component
{
    constructor(props) {
        super(props)
        this.resdit = this.resdit.bind(this)
        this.isApp = (this.props.data.statuses.amd && this.props.data.statuses.reception && this.models('props.data.resdits', []).find(it=>(it.consignment_event_code==74 || it.consignment_event_code==43) && this.cast(it.nsetup, 'mrd', 1)==this.models('props.data.statuses.amd', 2)))
        this.isMrd = (this.props.data.statuses.mrd && this.props.data.statuses.reception && this.models('props.data.resdits', []).find(it=>(it.consignment_event_code==74 || it.consignment_event_code==43) && this.cast(it.nsetup, 'mrd', 1)==this.models('props.data.statuses.mrd', 2)))
        this.isMrd82 = (this.props.data.statuses.mrd && this.props.data.statuses.reception && this.models('props.data.resdits', []).find(it=>it.consignment_event_code==82 && this.cast(it.nsetup, 'mrd', 1)==this.models('props.data.statuses.mrd', 2)))
        this.isApp82 = (this.props.data.statuses.amd && this.props.data.statuses.reception && this.models('props.data.resdits', []).find(it=>it.consignment_event_code==82))
        this.isMld = (this.props.data.statuses.mld && this.props.data.statuses.reception && this.models('props.data.resdits', []).find(it=>(it.consignment_event_code==74 || it.consignment_event_code==43)))
        this.isIftsta = (this.props.data.statuses.iftsta && this.props.data.statuses.reception && this.models('props.data.resdits', []).find(it=>(it.consignment_event_code==74 || it.consignment_event_code==43) && this.cast(it.nsetup, 'iftsta', 1)==this.models('props.data.statuses.iftsta', 2)))
        this.isIftsta82 = (this.props.data.statuses.iftsta && this.props.data.statuses.reception && this.models('props.data.resdits', []).find(it=>it.consignment_event_code==82 && this.cast(it.nsetup, 'iftsta', 1)==this.models('props.data.statuses.iftsta', 2)))
    }

    resdit(consignment_event) {
        const disableMrd = ((this.isMrd || this.isMld || this.isIftsta) && !this.props.data.nsetup.reference_receptacle_id) ? {disabled:true} : {}
        let resdit = null
        if(this.isApp && (consignment_event.code==74 || consignment_event.code==43)) {
            resdit = <div className="btn btn-xs btn-theme text-white">AMD{this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mrd')==this.models('props.data.statuses.amd', 2))?<React.Fragment> {moment(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mrd')==this.models('props.data.statuses.amd', 2)).resdit.nsetup.mrd.handover_date_time, 'YYYYMMDDTHH:mm+-HH:mm').format('DD/MM')}</React.Fragment>:null}</div>
        }
        else if(this.isMrd && (consignment_event.code==74 || consignment_event.code==43)) {
            resdit = <div className="btn btn-xs btn-primary">MRD{this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mrd')==this.models('props.data.statuses.mrd', 2))?<React.Fragment> {moment(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mrd')==this.models('props.data.statuses.mrd', 2)).resdit.nsetup.mrd.handover_date_time, 'YYYYMMDDTHH:mm+-HH:mm').format('DD/MM')}</React.Fragment>:null}</div>
        }
        else if(this.isMld && (consignment_event.code==74 || consignment_event.code==43)) {
            resdit = <div className="btn btn-xs btn-rose">MLD{this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mld'))?<React.Fragment> {moment(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mld')).resdit.created_at).format('DD/MM')}</React.Fragment>:null}</div>
        }
        else if(this.isIftsta && (consignment_event.code==74 || consignment_event.code==43)) {
            resdit = <div className="btn btn-xs btn-army">IFTSTA{this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.iftsta')==this.models('props.data.statuses.iftsta', 2))?<React.Fragment> {moment(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.iftsta')==this.models('props.data.statuses.iftsta', 2)).resdit.nsetup.localtime).format('DD/MM')}</React.Fragment>:null}</div>
        }
        else if(this.isApp82 && consignment_event.code==82) {
            resdit = <div className="btn btn-xs btn-theme text-white">AMD {moment(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.source')).resdit.nsetup.localtime).format('DD/MM')}</div>
        }
        else if(this.isMrd82 && consignment_event.code==82) {
            resdit = <div className="btn btn-xs btn-primary">MRD{this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.source')==this.models('props.data.statuses.mrd', 2))?<React.Fragment> {moment(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mrd')==this.models('props.data.statuses.mrd', 2)).resdit.nsetup.mrd.handover_date_time, 'YYYYMMDDTHH:mm+-HH:mm').format('DD/MM')}</React.Fragment>:null}</div>
        }
        else if(this.isIftsta82 && consignment_event.code==82) {
            resdit = <div className="btn btn-xs btn-army">IFTSTA{this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.iftsta')==this.models('props.data.statuses.iftsta', 2))?<React.Fragment> {moment(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.iftsta')==this.models('props.data.statuses.iftsta', 2)).resdit.nsetup.localtime).format('DD/MM')}</React.Fragment>:null}</div>
        }
        else {
            resdit = <label className="fancy-radio m-auto custom-color-green">
                <input name={`receptacles[${this.props.data.id}][status]`} type="radio" {...disableMrd} value={consignment_event.code} checked={consignment_event.code==74?(this.models('props.data.statuses.reception', -100)==74 || this.models('props.data.statuses.reception', -100)==43):this.models('props.data.statuses.reception', -100)==consignment_event.code} onChange={()=>this.props.handleReceptacleStatusChange(consignment_event.code)}/>
                <span><i className="mr-0"></i></span>
            </label>
        }
        return resdit
    }

    render() {
        let classNames = [] 
        if((this.isMrd || this.isMld) && !this.props.data.nsetup.reference_receptacle_id)
            classNames.push('bg-stone')
        else if(this.props.data.nsetup.reference_receptacle_id)
            classNames.push('row-danger')
        else if(this.props.data.nsetup.reference_receptacle_added)
            classNames.push('row-success')
        return <tr className={classNames.join(' ')}>
        <td className="text-left">
            {this.props.data.nsetup.receptacle_id} {this.props.readOnly?<React.Fragment><a href={`#barcode?code=${this.props.data.nsetup.receptacle_id}`} onClick={()=>$(`#receptacle${this.props.data.nsetup.receptacle_id}`).modal('show')}><i className="fa fa-barcode"></i></a>
            <Popup id={`receptacle${this.props.data.nsetup.receptacle_id}`} className="modal-xl">
                <PopupBody>
                    <div className="text-center py-5">
                        <img src={`/barcode?code=${this.props.data.nsetup.receptacle_id}`}/>
                    </div>
                </PopupBody>
            </Popup>
            </React.Fragment>:null}

            {this.models('props.data.fhl.id')?<a href={`#dialog/fhl?id=${this.models('props.data.fhl.id')}`} className="p-1 rounded-circle bg-aqua">[FHL]</a>:null}
        </td>
        <td>{this.props.messageFunction}</td>
        <td>{this.props.data.nsetup.nesting}</td>
        <td>{this.models('props.data.nsetup.type.interpretation', '--')}</td>
        <td>{this.props.messageFunction==1?0:this.props.data.nsetup.weight}</td>
        {this.props.consignmentEvents.map(consignment_event=><td key={`consignment_event-check-${this.props.data.id}-${consignment_event.code}`} className="text-center">
        {this.resdit(consignment_event)}
        </td>)}
    </tr>
    }
}

Modelizer(ReceptacleLine);

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
        this.hrefs = this.hrefs.bind(this)
        this.mrdhrefs = this.mrdhrefs.bind(this)
    }

    mrdhrefs(file) {
        return this.props.readOnly ? {
            href : `#dialog/export/mrdresdit-${file.media_id}`,
            target : '_blank'
        } : {}
    }

    hrefs(file, resdit_id) {
        return this.props.readOnly ? {
            href : `#dialog/export/resdit-${file}-${resdit_id}.txt`,
            target : '_blank'
        } : {}
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidMount() {
        this.unsubscribe = this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='resdit' && storeState.reception && storeState.reception.length>0 && storeState.reception[0].cardit_id==this.props.data.id) {
                this.setState(state => {
                    state.updated_resdits.reception = storeState.reception
                    state.dialogs.push({})
                    return state
                })
            }
        })
    }

    handleReceptacleStatusChange(receptacle, status) {
        this.setState(state=>{
            state.updated_resdits.reception = []
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
            state.updated_resdits.reception = []
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
        const btndisabled = this.state.receptacles.filter(it=>this.cast(it, 'statuses.reception')).length>0?{}:{disabled:true}
        let files = null
        let files_tablet = null
        let resdit_codes = []
        this.models('state.updated_resdits.reception', []).map(reception=>resdit_codes.push(reception.files.join(', ')))
        resdit_codes = resdit_codes.join(', ')
        if(this.state.updated_resdits.reception) {
            files = <div>
                {this.state.updated_resdits.reception.map(reception=>reception.files.map(file=><div key={`download-${this.props.data.id}-resdit-${file}`}>
                    {this.cast(reception.nsetup, 'mrd.handover_id')?<React.Fragment>
                        <p className="font-weight-bold mb-0">
                        {this.cast(reception.nsetup, 'mrd.source') ? trans('AMD HANDOVER ID') : trans('MRD HANDOVER ID')} : {reception.nsetup.mrd.handover_id}<br/>
                        {trans('Du :date', {date:reception.nsetup.mrd.handover_date_time})}
                        </p>
                        <a className="btn btn-info col-md-3 font-10 pt-2 m-2 text-white" {...this.mrdhrefs(reception.nsetup.mrd)}>{this.cast(reception.nsetup, 'mrd.source') ? 'AMD XML' : 'MRD XML'}<span className="bg-light d-block font-14 m-2 rounded text-primary" style={{lineHeight:'40px'}}>{reception.nsetup.mrd.handover_id}</span></a>
                    </React.Fragment>:null}
                    <p className="font-weight-bold mb-0">
                        {trans('RESDIT :consignment_event_code du :date à :hour', {consignment_event_code:file.split('-')[0], date:moment.utc(reception.localtime).format('DD/MM/YYYY'), hour:moment.utc(reception.localtime).format('HH[h]mm')})}</p>
                    <a className="btn btn-info font-10 pt-2 m-2 text-white col-md-3" {...this.hrefs(file, reception.id)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}</span></a>
                </div>))}
            </div>  
            files_tablet =  <div className="row">
                {this.state.updated_resdits.reception.map(reception=>reception.files.map(file=><React.Fragment key={`download-${this.props.data.id}-resdit-${file}`}>{this.cast(reception.nsetup, 'mrd.handover_id')?<a className="btn btn-info col-md-4 font-10 pt-2 m-2 text-white" {...this.mrdhrefs(reception.nsetup.mrd)}>{this.cast(reception.nsetup, 'mrd.source')?'AMD':'MRD'} XML<span className="bg-light d-block font-14 m-2 rounded text-primary" style={{lineHeight:'40px'}}>{reception.nsetup.mrd.handover_id}</span></a>
                    :null}<a key={`download-${this.props.data.id}-resdit-${file}`} className="btn btn-info col-md-4 font-10 pt-2 text-white m-2" {...this.hrefs(file, reception.id)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}</span></a></React.Fragment>))}
            </div>  
        }
        let mailclass_concat = Object.keys(this.models('props.data.nsetup.mail_classes', {})).join('')
        if(!mailclass_concat)
            mailclass_concat = this.models('props.data.nsetup.mail_class.code')
        return <div className="row">
            <div className="col-md-12 d-md-block d-xl-none">
                <div className="row text-left text-body">
                    {this.models('state.updated_resdits.reception', []).length>0?null:<div className="col-md-4">
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
                    {this.models('state.updated_resdits.reception', []).length>0?null:<React.Fragment>
                        <h3>{trans('Temps restant pour valider la réception')} :</h3>
                        <div className="skillContainer d-flex align-items-center justify-content-around">
                            <Countdown from={moment.utc(this.props.data.nsetup.consignment_completion).local()} to={moment.utc(this.props.data.nsetup.handover_origin_cut_off).local()}/>
                        </div>
                    </React.Fragment>}
                    <ul className="info">
                        {this.models('props.data.nsetup.consignment_category.code')=='A'?<li>
                            <a href={trans('/cn38?id=:id', {id:this.props.data.id})} target="_blank" className="btn btn-beige w-25 text-light">CN 38</a>
                        </li>:(this.models('props.data.nsetup.consignment_category.code')=='B' && mailclass_concat!='T')?<li>
                            <a href={trans('/cn41?id=:id', {id:this.props.data.id})} target="_blank" className="btn btn-beige w-25 text-light">CN 41</a>
                        </li>:(this.models('props.data.nsetup.consignment_category.code')=='B' && mailclass_concat=='T')?<li>
                            <button href={trans('/cn41?id=:id', {id:this.props.data.id})} type="button" className="btn btn-danger w-25 text-light">CN 47</button>
                        </li>:null}
                        <li>
                            {trans('Numéro du container')} :
                            <span>{this.props.data.nsetup.container_id} {this.props.readOnly?<React.Fragment><a href={`#barcode?code=${this.props.data.nsetup.container_id}`} onClick={()=>$(`#uld${this.props.data.nsetup.container_id}`).modal('show')}><i className="fa fa-barcode"></i></a>
                                <Popup id={`uld${this.props.data.nsetup.container_id}`} className="modal-xl">
                                    <PopupBody>
                                        <div className="text-center py-5">
                                            <img src={`/barcode?code=${this.props.data.nsetup.container_id}`}/>
                                        </div>
                                    </PopupBody>
                                </Popup>
                            </React.Fragment>:null}</span>
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
                                        className="colorVert noBor pl-0 text-left text-wrap">
                                        {(this.models('state.updated_resdits.reception', []).length>0)?trans('Réception validée le :date à :time par :author - RESDIT :resdits envoyé(s)', {
                                            resdits : resdit_codes,
                                            date : moment.utc(this.state.updated_resdits.reception[this.state.updated_resdits.reception.length-1].localtime).format('DD/MM/YYYY'),
                                            time : moment.utc(this.state.updated_resdits.reception[this.state.updated_resdits.reception.length-1].localtime).format('HH:mm'),
                                            author : `${this.cast(this.state.updated_resdits.reception[this.state.updated_resdits.reception.length-1].author, 'profile.gender_label')} ${this.cast(this.state.updated_resdits.reception[this.state.updated_resdits.reception.length-1].author, 'profile.official', 'AIRMAILDATA')}`
                                        }):null}    
                                    </th>
                                    <th colSpan={this.props.consignmentEvents.length} className="thTop">{trans('Réception')}</th>
                                </tr>
                                <tr className="thLeft">
                                    {this.props.consignmentEvents.map(consignment_event=><th key={`consignment_event-${consignment_event.code}`}>{trans(consignment_event.trans_interpretation)}</th>)}
                                </tr>
                                <tr>
                                    <th width="300">{trans('Numéro du récipient')}</th>
                                    <th>{trans('Statut')}</th>
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
                                {this.state.receptacles.map((receptacle, index)=><ReceptacleLine key={`content-reception-${receptacle.id}`} data={receptacle} messageFunction={this.models('props.data.nsetup.message_function')} readOnly={this.props.readOnly} consignmentEvents={this.props.consignmentEvents} handleReceptacleStatusChange={code=>this.handleReceptacleStatusChange(receptacle, code)}/>)}
                                <tr>
                                    <td colSpan="5" className="border-right-0 noBg"></td>
                                    <td colSpan={this.props.consignmentEvents.length} className="border-left-0 border-right-0 p-0">
                                        {(this.models('state.updated_resdits.reception', []).length>0 || this.props.readOnly)?null:<button className="btn btn-orange rounded-0" {...btndisabled}>{trans('STEP')} 1 :
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