import React, {Component} from 'react';
import moment from 'moment-timezone';
import Ry from '../../Core/Ry';
import Countdown from './Countdown';
import trans from '../../../../app/translations';
import Modelizer from '../../Core/Modelizer';
import Localtime from './Localtime';
import $ from 'jquery';
import {Popup, PopupBody, PopupHeader, PopupFooter, Datepicker} from '../../../bs/bootstrap';
import swal from 'sweetalert2';

const CHECKBOXES = false

export class Popover extends Component
{
    componentDidMount() {
        $('[data-toggle="popover"]').popover({
            html: true
        })
    }

    render() {
        return <a data-toggle="popover" data-trigger="hover" title={this.props.data.reference} data-content={trans(`Départ : :departure<br/>Arrivée : :arrival`, {departure:moment(this.props.data.departure_datetime_lt).format('DD/MM/YYYY HH:mm'), arrival:moment(this.props.data.arrival_datetime_lt).format('DD/MM/YYYY HH:mm')})}>{this.props.data.reference}</a>
    }
}

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

class Transport extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data : this.props.data,
            datetime : this.props.datetimeLT,
            hour : moment(this.props.datetimeLT).format('HHmm')
        }
        this.validate = this.validate.bind(this)
        this.handleChangeDate = this.handleChangeDate.bind(this)
        this.handleChangeHour = this.handleChangeHour.bind(this)
    }

    validate() {
        this.setState(state=>{
            switch(this.props.consignmentEvent) {
                case 'arrival':
                    state.data.arrival_datetime_lt = state.datetime
                    state.data.arrival_datetime = moment(state.datetime).utc()
                    break
                case 'departure':
                    state.data.departure_datetime_lt = state.datetime
                    state.data.departure_datetime = moment(state.datetime).utc()
                    break;
            }
            return state
        })
    }

    handleChangeDate(value) {
        this.setState(state=>{
            let t = moment(value)
            t.hour(state.hour.substr(0,2))
            t.minute(state.hour.substr(2,2))
            state.datetime = t.format('YYYY-MM-DD HH:mm:ss')
            return state
        })
        this.props.onChange()
    }

    handleChangeHour(event) {
        const value = event.target.value
        this.setState(state=>{
            state.hour = value
            if(state.hour.length==4) {
                let t = moment(state.datetime)
                t.hour(state.hour.substr(0,2))
                t.minute(state.hour.substr(2,2))
                state.datetime = t.format('YYYY-MM-DD HH:mm:ss')
            }
            return state
        })
        this.props.onChange()
    }

    render() {
        return <div>
        <h4>{this.props.data.reference}</h4>
        <div className="row">
            <div className="form-group col-md-8">
                <label className="control-label">{trans('Date')}</label>
                <Datepicker name={`event_times[${this.props.data.id}][date]`} defaultValue={this.state.datetime} className="transport-datepicker" inputProps={{required:true}} onChange={this.handleChangeDate}/>
            </div>
            <div className="form-group col-md-4">
                <label className="control-label">{trans("Heure")}</label>
                <input type="text" name={`event_times[${this.props.data.id}][time]`} className="form-control bs-default" value={this.state.hour} onChange={this.handleChangeHour} required/>
            </div>
        </div>
    </div>
    }
}

class ReceptacleLine extends Component
{
    constructor(props) {
        super(props)
        this.control = this.control.bind(this)
    }

    control(select_transport) {
        const isDisabled = this.cast(this.props.data, 'statuses.reception', 82)!=74 && this.cast(this.props.data, 'statuses.reception', 82)!=43
        const disabled = isDisabled?{disabled:true}:{}
        if(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mld')) && this.cast(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mld')), 'conveyence_id')==select_transport.id && this.props.consignmentEvent=='assignation') {
            return <div className="btn btn-xs btn-blue text-white">MLD {moment(this.cast(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mld') && this.cast(it, 'nsetup.localtime')), 'nsetup.localtime')).format('DD/MM')}</div>
        }
		else if(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.fsu')) && this.cast(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.fsu')), 'conveyence_id')==select_transport.id && this.props.consignmentEvent=='arrival') {
            return <div className="btn btn-xs btn-blue text-white">FSU {moment(this.cast(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.fsu') && this.cast(it, 'nsetup.fsu.localtime')), 'nsetup.fsu.localtime')).format('DD/MM')}</div>
        }
        else if(this.props.consignmentEvent=='departure' && this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.fsu')) && this.cast(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.fsu')), 'conveyence_id')==select_transport.id && this.cast(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.fsu')), 'consignment_event_code')==24) {
            return <div className="btn btn-xs btn-blue text-white">FSU {moment(this.cast(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.fsu')), 'created_at')).format('DD/MM')}</div>
        }
        if(this.props.selectTransports.length==1 && CHECKBOXES) {
            return <div className="fancy-checkbox">
                <label><input type="checkbox" name={`receptacles[${this.props.data.id}][conveyence_id]`} {...disabled} value={select_transport.id} checked={!disabled.disabled && this.props.data.transports[this.props.transportIndex][this.props.consignmentEvent].id==select_transport.id} onChange={()=>this.props.handleReceptacleTransportChange(select_transport)}/><span></span></label>
            </div>
        }
        else {
            return <label className="fancy-radio m-auto custom-color-green">
                <input {...disabled} name={`receptacles[${this.props.data.id}][conveyence_id]`} type="radio" value={select_transport.id} checked={!disabled.disabled && this.models(`props.data.transports.${this.props.transportIndex}.${this.props.consignmentEvent}.id`)==select_transport.id} onChange={()=>this.props.handleReceptacleTransportChange(select_transport)}/>
                <span><i className="mr-0"></i></span>
            </label>
        }
    }

    render() {
        const isDisabled = this.cast(this.props.data, 'statuses.reception', 82)!=74 && this.cast(this.props.data, 'statuses.reception', 82)!=43
        let classNames = []
        if(isDisabled)
            classNames.push('bg-stone')
        if(this.props.data.nsetup.reference_receptacle_id)
            classNames.push('row-danger')
        return <tr className={classNames.join(' ')}>
        <td className="text-left">
            {this.props.data.nsetup.receptacle_id}
        </td>
        <td>{this.props.messageFunction}</td>
        <td>{this.props.data.nsetup.nesting}</td>
        <td>{this.props.data.nsetup.type.interpretation}</td>
        <td>{this.props.messageFunction==1?0:this.props.data.nsetup.weight}</td>
        {this.props.selectTransports.map(select_transport=><td key={`select-transport-${this.props.consignmentEvent}-${select_transport.id}`} className="text-center">
            {this.control(select_transport)}
        </td>)}
    </tr>
    }
}

Modelizer(ReceptacleLine)

class Status extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            oneTransportAllChecked : false,
            receptacles : this.props.data.receptacles,
            resdits : this.props.data.resdits,
            updated_resdits : this.props.data.updated_resdits,
            changed : false,
            dtchanged : false
        }
        this.handleReceptacleTransportChange = this.handleReceptacleTransportChange.bind(this)
        this.handleAllReceptacleTransportChange = this.handleAllReceptacleTransportChange.bind(this)
        this.hrefs = this.hrefs.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.confirm = this.confirm.bind(this)
    }

    confirm() {
        if(this.state.dtchanged) {
            swal({
                title: trans("Changement de date et d'horaire de vol"),
                text: trans('Confirmez-vous cette date et cet horaire ?'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: trans('Oui je confirme'),
                confirmButtonClass: 'bg-danger'
            }).then((result) => {
                if (result.value) {
                    this.props.selectTransports.map(select_transport=>{
                        if(`schedule-transport-${this.props.consignmentEvent}-${select_transport.id}` in this.refs)
                            this.refs[`schedule-transport-${this.props.consignmentEvent}-${select_transport.id}`].validate()
                    })
                    window.setTimeout(()=>{
                        $(`#schedule-${this.props.data.id}-${this.props.consignmentEvent}`).modal('hide')
                        $(this.refs.frm_cardit).submit()
                    }, 10)
                }
            })
        }
        else {
            $(`#schedule-${this.props.data.id}-${this.props.consignmentEvent}`).modal('hide')
            $(this.refs.frm_cardit).submit()
        }
    }

    hrefs(resdit) {
        return this.props.readOnly ? {
            href : `#dialog/export/resdit-${resdit.files[0]}-${resdit.id}.txt`,
            target : '_blank'
        }:{}
    }

    handleSubmit() {
        if(this.props.consignmentEvent=='departure' || this.props.consignmentEvent=='arrival') {
            this.setState({
                dtchanged : false
            }, ()=>$(`#schedule-${this.props.data.id}-${this.props.consignmentEvent}`).modal('show'))
        }
        else {
            $(this.refs.frm_cardit).submit()
        }
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidMount() {
        this.unsubscribe = this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='resdit' && storeState.data && storeState.data.length>0) {
                this.setState(state=>{
                    state.changed = false
                    state.resdits = state.resdits.concat(storeState.data)
                    if(!('transports' in state.updated_resdits))
                        state.updated_resdits.transports = {}
                    if(!(this.props.transportIndex in state.updated_resdits.transports))
                        state.updated_resdits.transports[this.props.transportIndex] = {}
                    if(!(this.props.consignmentEvent in state.updated_resdits.transports[this.props.transportIndex]))
                        state.updated_resdits.transports[this.props.transportIndex][this.props.consignmentEvent] = []
                    state.updated_resdits.transports[this.props.transportIndex][this.props.consignmentEvent].push(storeState.data[0])
                    return state
                })
            }
            if(storeState.type=='resdit')
                $(`#schedule-${this.props.data.id}-${this.props.consignmentEvent}`).modal('hide')
        })
    }

    handleReceptacleTransportChange(receptacle, transport) {
        this.setState(state=>{
            state.changed = true
            state.resdits = state.resdits.filter(item=>{
                return item.event != this.props.consignmentEvent && item.transport_step!=this.props.transportIndex
            })
            let found_receptacle = this.state.receptacles.find(item=>item.id==receptacle.id)
            if(found_receptacle)
                found_receptacle.transports[this.props.transportIndex][this.props.consignmentEvent] = transport
            return state
        })
    }

    handleAllReceptacleTransportChange(transport, event) {
        const value = event.target.checked
        this.props.handleAllReceptacleTransportChange(transport)
        this.setState(state=>{
            state.changed = true
            state.oneTransportAllChecked = value
            if(value) {
                state.receptacles.map(item=>{
                    item.transports[this.props.transportIndex][this.props.consignmentEvent] = {...transport}
                })
            }
            else {
                state.receptacles.map(item=>{
                    item.transports[this.props.transportIndex][this.props.consignmentEvent].id = 0
                })
            }
            return state
        })
    }

    render() {
        const isDisabled = this.models('state.updated_resdits.reception', []).filter(it=>it.event=='reception').length==0
        let incr = 0
        switch(this.props.consignmentEvent) {
            case 'departure':
                incr = 1;
                break;
            case 'arrival':
                incr = 2;
                break;
        }
        let isDone =  this.models(`state.updated_resdits.transports.${this.props.transportIndex}.${this.props.consignmentEvent}.0`)
        let done = null
        let files = null
        let files_tablet = null
        let resdit_files = []
        let flights = []
        let done_head = ''
        let done_resdits = []
        if(this.models(`state.updated_resdits.transports.${this.props.transportIndex}`)) {
            files = <div className="row">
                {this.state.resdits.filter(it=>it.event==this.props.consignmentEvent && it.transport_step==this.props.transportIndex).map(resdit=>resdit.files.map(file=><div key={`download-${this.props.data.id}-resdit-${resdit.id}-${file}`}>
                    <p className="font-weight-bold mb-0">
                        {trans('RESDIT :consignment_event_code du :date à :hour', {consignment_event_code:file.split('-')[0], date:moment.utc(resdit.localtime).format('DD/MM/YYYY'), hour:moment.utc(resdit.localtime).format('HH[h]mm')})}</p>
                    <a className="btn btn-info text-white col-md-3 font-10 pt-2 m-2" {...this.hrefs(resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}<br/><small className="font-10 d-block">{file.split('-')[1]}</small></span></a>
                </div>))}
                <Ry/>
            </div>
            files_tablet =  <div className="row">
                {this.models('state.resdits', []).filter(it=>it.event==this.props.consignmentEvent && it.transport_step==this.props.transportIndex).map(resdit=>resdit.files.map(file=><div key={`download-${this.props.data.id}-resdit-${resdit.id}-${file}`}>
                    <p className="font-weight-bold mb-0">
                        {trans('RESDIT :consignment_event_code du :date à :hour', {consignment_event_code:file.split('-')[0], date:moment.utc(resdit.localtime).format('DD/MM/YYYY'), hour:moment.utc(resdit.localtime).format('HH[h]mm')})}</p>
                    <a className="btn text-white btn-info col-md-4 font-10 pt-2 m-2" {...this.hrefs(resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}</span></a>
                </div>))}
                <Ry/>
            </div> 

            this.state.resdits.filter(it=>it.event==this.props.consignmentEvent && it.transport_step==this.props.transportIndex).map(resdit=>resdit.files.map(file=>{
                resdit_files.push(file.split('-')[0])
                flights.push(file.split('-')[1])
            }))
        }
        if(isDone && resdit_files.length>0) {
            switch(this.props.consignmentEvent) {
                case 'assignation':
                    done = trans('Assignation validée le :date à :time par :author - RESDIT :resdit_files envoyé<br/>Vol :flights :flight_datetime - Départ :airport (:iata)', {
                        date : moment.utc(isDone.localtime).format('DD/MM/YYYY'),
                        time : moment.utc(isDone.localtime).format('HH:mm'),
                        author : `${this.cast(isDone.author, 'profile.gender_label')} ${this.cast(isDone.author, 'profile.official', 'AIRMAILDATA')}`,
                        resdit_files : resdit_files.join(', '),
                        flights : flights.join(', '),
                        flight_datetime : moment(this.models(`state.updated_resdits.transports.${this.props.transportIndex}.assignation.0.conveyence.departure_datetime_lt`)).format('DD/MM/YYYY [à] HH:mm'),
                        airport : this.props.data.nsetup.transports[this.props.transportIndex].departure_location.name,
                        iata : this.props.data.nsetup.transports[this.props.transportIndex].departure_location.iata
                    })
                    break;
                case 'departure':
                    done_head = trans('Départ validée le :date à :time par :author', {
                        date : moment.utc(isDone.localtime).format('DD/MM/YYYY'),
                        time : moment.utc(isDone.localtime).format('HH:mm'),
                        author : `${this.cast(isDone.author, 'profile.gender_label')} ${this.cast(isDone.author, 'profile.official', 'AIRMAILDATA')}`
                    })
                    done_resdits = []
                    this.state.resdits.filter(it=>it.event==this.props.consignmentEvent && it.transport_step==this.props.transportIndex).map(resdit=>{
                        let transport = this.models(`state.updated_resdits.transports.${this.props.transportIndex}.departure.0.conveyence`)
                        if(this.models('props.data.nsetup.transports.'+this.props.transportIndex+'.departure_datetime_lt', false) && this.models('props.data.nsetup.transports.'+this.props.transportIndex+'.departure_datetime_lt', false)!=transport.departure_datetime_lt) {
                            done_resdits.push(trans('<br/>RESDIT :resdit_files envoyé - Vol :flights :original_flight_datetime - <span class="text-danger">Horaire modifié : :flight_datetime</span>', {
                                resdit_files : resdit.files,
                                flights : this.cast(resdit, 'conveyence.reference'),
                                flight_datetime : moment(this.cast(resdit, 'conveyence.departure_datetime_lt')).format('DD/MM/YYYY [à] HH:mm'),
                                original_flight_datetime : moment(this.models('props.data.nsetup.transports.'+this.props.transportIndex+'.departure_datetime_lt', transport.departure_datetime_lt)).format('DD/MM/YYYY [à] HH:mm')
                            }))
                        }
                        else {
                            done_resdits.push(trans('<br/>RESDIT :resdit_files envoyé - Vol :flights :flight_datetime', {
                                resdit_files : resdit.files,
                                flights : this.cast(resdit, 'conveyence.reference'),
                                flight_datetime : moment(this.models('props.data.transports.'+this.props.transportIndex+'.departure_datetime_lt', transport.departure_datetime_lt)).format('DD/MM/YYYY [à] HH:mm')
                            }))
                        }
                    })
                    done = done_head + done_resdits.join('') + '<br/>' + trans('Départ :airport (:iata)', {
                        airport : this.props.data.nsetup.transports[this.props.transportIndex].departure_location.name,
                        iata : this.props.data.nsetup.transports[this.props.transportIndex].departure_location.iata
                    })
                    break;
                case 'arrival':
                    done_head = trans('Arrivée validée le :date à :time par :author', {
                        date : moment.utc(isDone.localtime).format('DD/MM/YYYY'),
                        time : moment.utc(isDone.localtime).format('HH:mm'),
                        author : `${this.cast(isDone.author, 'profile.gender_label')} ${this.cast(isDone.author, 'profile.official', 'AIRMAILDATA')}`
                    })
                    done_resdits = []
                    this.state.resdits.filter(it=>it.event==this.props.consignmentEvent && it.transport_step==this.props.transportIndex).map(resdit=>{
                        let transport = this.models(`state.updated_resdits.transports.${this.props.transportIndex}.arrival.0.conveyence`)
                        if(this.models('props.data.nsetup.transports.'+this.props.transportIndex+'.arrival_datetime_lt', false) && this.models('props.data.nsetup.transports.'+this.props.transportIndex+'.arrival_datetime_lt', false)!=transport.arrival_datetime_lt) {
                            done_resdits.push(trans('<br/>RESDIT :resdit_files envoyé - Vol :flights :original_flight_datetime - <span class="text-danger">Horaire modifié : :flight_datetime</span>', {
                                resdit_files : resdit.files.map(file=>file.split('-')[0]).join(','),
                                flights : this.cast(resdit, 'conveyence.reference'),
                                flight_datetime : moment(this.cast(resdit, 'conveyence.arrival_datetime_lt')).format('DD/MM/YYYY [à] HH:mm'),
                                original_flight_datetime : moment(this.models('props.data.nsetup.transports.'+this.props.transportIndex+'.arrival_datetime_lt', transport.arrival_datetime_lt)).format('DD/MM/YYYY [à] HH:mm')
                            }))
                        }
                        else {
                            done_resdits.push(trans('<br/>RESDIT :resdit_files envoyé - Vol :flights :flight_datetime', {
                                resdit_files : resdit.files.map(file=>file.split('-')[0]).join(','),
                                flights : this.cast(resdit, 'conveyence.reference'),
                                flight_datetime : moment(this.models('props.data.transports.'+this.props.transportIndex+'.arrival_datetime_lt', transport.arrival_datetime_lt)).format('DD/MM/YYYY [à] HH:mm')
                            }))
                        }
                    })
                    done = done_head + done_resdits.join('') + '<br/>' + trans('Arrivée :airport (:iata)', {
                        airport : this.props.data.nsetup.transports[this.props.transportIndex].arrival_location.name,
                        iata : this.props.data.nsetup.transports[this.props.transportIndex].arrival_location.iata
                    })
                    break;
            }
        } 
        const btndisabled = this.state.receptacles.filter(it=>it.transports.find(it2=>this.cast(it2, this.props.consignmentEvent+'.id', 0)!=0)).length>0?{}:{disabled:true}
        let mailclass_concat = Object.keys(this.models('props.data.nsetup.mail_classes', {})).join('')
        if(!mailclass_concat)
            mailclass_concat = this.models('props.data.nsetup.mail_class.code')
        return <div className="row">
            <div className="col-md-12 d-md-block d-xl-none">
                <div className="row text-left text-body">
                    {this.state.reception?null:<div className="col-md-4">
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
                    {this.state.reception?null:<React.Fragment>
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
                    <form ref="frm_cardit" name={`frm_cardit${this.props.data.id}`} action={`/${this.props.consignmentEvent}`} method="post">
                        <Ry title="ajaxform"/>
                        <input type="hidden" name="ry"/>
                        <input type="hidden" name="id" value={this.props.data.id}/>
                        <input type="hidden" name="consignment_event" value={this.props.consignmentEvent}/>
                        <input type="hidden" name="transport_index" value={this.props.transportIndex}/>
                        <table className="table tableRecap">
                            <thead>
                                <tr>
                                    <th rowSpan="2" colSpan="5"
                                        className="colorVert noBor pl-0 text-left text-wrap" dangerouslySetInnerHTML={{__html:done}}>
                                    </th>
                                    <th colSpan={this.props.selectTransports.length} className="thTop text-capitalize">{trans(this.props.consignmentEvent)}</th>
                                    {(this.props.consignmentEvent=='assignation' && !this.props.readOnly)?<th rowSpan="2" className="thModal">
                                        <button className="btn btn-primary js-sweetalert"
                                                data-type="with-custom-icon" type="button" onClick={this.props.addTransport}>+
                                        </button>
                                    </th>:null}
                                </tr>
                                <tr className="thLeft">
                                    {this.props.selectTransports.map(select_transport=><th key={`cardit-${this.props.consignmentEvent}-${this.props.transportIndex}-${this.props.data.id}-select-transport-${select_transport.id}`}><Popover data={select_transport}/> {select_transport.new?<button className="border-0 p-0" type="button" onClick={()=>this.props.removeSelectTransport(select_transport)}><i className="fa fa-times-circle text-danger"></i></button>:null}
                                    </th>)}
                                </tr>
                                <tr>
                                    <th>{trans("Numéro du récipient")}</th>
                                    <th>{trans("Statut")}</th>
                                    <th>{trans("Container Journey ID")}</th>
                                    <th>{trans("Type de récipient")}</th>
                                    <th>{trans("Poids (:weight_unit)", {weight_unit:'Kg'})}</th>
                                    {this.props.selectTransports.map(select_transport=><th key={`cardit-${this.props.consignmentEvent}-checkall-${this.props.transportIndex}-${this.props.data.id}-select-transport-${select_transport.id}`}>
                                        {(this.props.selectTransports.length==1 && CHECKBOXES)?<div className="fancy-checkbox">
                                        <label><input type="checkbox" onChange={event=>this.handleAllReceptacleTransportChange(select_transport, event)} checked={this.state.oneTransportAllChecked}/><span></span></label>
                                    </div>:<label className="fancy-radio custom-color-green m-auto">
                                            <input type="radio" name={`checkall[${this.props.consignmentEvent}][${this.props.transportIndex}]`} onChange={event=>this.handleAllReceptacleTransportChange(select_transport, event)} checked={this.models(`props.allTransport.id`)==select_transport.id}/>
                                            <span><i className="m-0"></i></span>
                                        </label>}
                                    </th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.receptacles.map((receptacle, index)=><ReceptacleLine key={`content-${this.props.consignmentEvent}-${this.props.transportIndex}-${receptacle.id}`} messageFunction={this.models('props.data.nsetup.message_function')} data={receptacle} selectTransports={this.props.selectTransports} consignmentEvent={this.props.consignmentEvent} transportIndex={this.props.transportIndex} handleReceptacleTransportChange={select_transport=>this.handleReceptacleTransportChange(receptacle, select_transport)}/>)}
                                <tr>
                                    <td colSpan="5" className="border-right-0 noBg"></td>
                                    <td colSpan={this.props.selectTransports.length} className="border-left-0 border-right-0 p-0">
                                        {(isDisabled || (isDone && !this.state.changed) || (this.props.readOnly && !this.state.changed))?null:<button className="btn btn-orange rounded-0" type="button" onClick={this.handleSubmit} {...btndisabled}>{trans("Valider")}</button>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Localtime/>
                        {this.props.consignmentEvent=='arrival'?<Popup id={`schedule-${this.props.data.id}-${this.props.consignmentEvent}`} className="popup-consignment-datetime">
                            <PopupHeader>
                                {trans("Confirmation dates/heures arrivée")}
                            </PopupHeader>
                            <PopupBody>
                                {this.props.selectTransports.filter(it=>this.state.receptacles.filter(receptacle=>receptacle.transports.find(transport=>this.cast(transport, 'arrival.id')==it.id)).length>0).map(select_transport=><Transport ref={`schedule-transport-${this.props.consignmentEvent}-${select_transport.id}`} key={`schedule-transport-${this.props.consignmentEvent}-${select_transport.id}`} data={select_transport} datetimeLT={select_transport.arrival_datetime_lt} onChange={()=>this.setState({dtchanged:true})} consignmentEvent={this.props.consignmentEvent}/>)}
                            </PopupBody>
                            <PopupFooter>
                                <button className="btn btn-primary p-2 font-18 text-uppercase" type="button" onClick={this.confirm}>
                                    {trans('Valider')}
                                </button>
                            </PopupFooter>
                        </Popup>:null}
                        {this.props.consignmentEvent=='departure'?<Popup id={`schedule-${this.props.data.id}-${this.props.consignmentEvent}`} className="popup-consignment-datetime">
                            <PopupHeader>
                                {trans("Confirmation dates/heures départ")}
                            </PopupHeader>
                            <PopupBody>
                                {this.props.selectTransports.filter(it=>this.state.receptacles.filter(receptacle=>receptacle.transports.find(transport=>this.cast(transport, 'departure.id')==it.id)).length>0).map(select_transport=><Transport ref={`schedule-transport-${this.props.consignmentEvent}-${select_transport.id}`} key={`schedule-transport-${this.props.consignmentEvent}-${select_transport.id}`} data={select_transport} datetimeLT={select_transport.departure_datetime_lt} onChange={()=>this.setState({dtchanged:true})} consignmentEvent={this.props.consignmentEvent}/>)}
                            </PopupBody>
                            <PopupFooter>
                                <button className="btn btn-primary p-2 font-18 text-uppercase" type="button" onClick={this.confirm}>
                                    {trans('Valider')}
                                </button>
                            </PopupFooter>
                        </Popup>:null}
                    </form>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Status);