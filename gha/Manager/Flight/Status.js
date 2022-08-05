import React, {Component} from 'react';
import moment from 'moment-timezone';
import Ry from 'ryvendor/Ry/Core/Ry';
import trans from 'ryapp/translations';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import Localtime from 'ryvendor/Ry/Airline/Cardit/Localtime';
import {Popover} from 'ryvendor/Ry/Airline/Cardit/Status';
import $ from 'jquery';
import {Popup, PopupBody, PopupHeader, PopupFooter, Datepicker} from 'ryvendor/bs/bootstrap';
import swal from 'sweetalert2';
import qs from 'qs';
import numeral from 'numeral';

const CHECKBOXES = true

Array.prototype.groupBy = function(fn){
    let ar = []
    let subar = []
    this.map(it=>{
        let i = fn(it)
        if(ar.indexOf(i)<0)
            ar.push(fn(it))
    })
    ar.map(a=>subar.push(this.filter(it=>fn(it)==a)))
    return subar
}

Array.prototype.unique = function(fn) {
    let ar = {}
    this.map((it, index)=>{
        let key = fn(it)
        if(!key)
            key = 'undefined-' + index
        ar[key] = it
    })
    return Object.values(ar)
}

export class Route extends Component
{
    render() {
        return this.models('props.data.transports', []).map(transport=><React.Fragment key={`transport-${transport.conveyence_reference}`}>
            <li>{trans('Départ')}<br/>
    <strong className="text-wrap">{transport.departure_location.country.nom} - {transport.departure_location.iata} - {transport.departure_location.name} {trans('le')} {moment(transport.departure_datetime_lt).format('DD/MM/YYYY HH:mm')}{(this.models('props.data.transports.'+this.props.transportStep+'.departure_datetime_lt', false) && this.models('props.data.transports.'+this.props.transportStep+'.departure_datetime_lt', false)!=transport.departure_datetime_lt)?<React.Fragment> - <span className="text-danger">{trans('Horaire modifié : :datetime', {datetime : moment(this.models('props.data.transports.'+this.props.transportStep+'.departure_datetime_lt')).format('DD/MM/YYYY HH:mm')})}</span></React.Fragment>:null}</strong></li>
            <li>{trans('Arrivée')}<br/>
            <strong className="text-wrap">{this.cast(transport, 'arrival_location.country.nom', this.cast(transport, 'arrival_location.adresse.ville.country.nom'))} - {this.cast(transport, 'arrival_location.iata', this.cast(transport, 'arrival_location.cardit'))} - {this.cast(transport, 'arrival_location.name')} {trans('le')} {transport.arrival_datetime_lt!='0000-00-00 00:00:00'?moment(transport.arrival_datetime_lt).format('DD/MM/YYYY HH:mm'):'00/00/00 00:00'}{(this.models('props.data.transports.'+this.props.transportStep+'.arrival_datetime_lt', false) && this.models('props.data.transports.'+this.props.transportStep+'.arrival_datetime_lt', false)!=transport.arrival_datetime_lt)?<React.Fragment> - <span className="text-danger">{trans('Horaire modifié : :datetime', {datetime : moment(this.models('props.data.transports.'+this.props.transportStep+'.arrival_datetime_lt')).format('DD/MM/YYYY HH:mm')})}</span></React.Fragment>:null}</strong></li>
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
        this.state = {
            assignation_conveyence_id : this.models('props.defaultConveyence.id'),
            departure_conveyence_id : this.models('props.defaultConveyence.id'),
            resdits : this.models('props.data.resdits', [])
        }
        this.mld_transport = this.props.selectTransports.length>1 ? {...this.props.selectTransports[0]} : {id:0}
        this.control = this.control.bind(this)
        this.departureControl = this.departureControl.bind(this)
        this.handleConveyenceChange = this.handleConveyenceChange.bind(this)
        this.handleUldChange = this.handleUldChange.bind(this)
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidMount() {
        this.unsubscribe = this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='resdit' && storeState.event=='departure' && storeState.transport_step==this.props.transportIndex && storeState.cardit_id==this.props.pkey) {
                this.setState(state=>{
                    state.resdits.push(storeState)
                    return state
                })
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.cast(prevState, 'conveyence_id') != this.models('props.data.departure.id') && this.models('props.data.departure.id')!='')
            this.setState({
                conveyence_id : this.models('props.data.departure.id'),
                assignation_conveyence_id : this.models('props.data.departure.id'),
                departure_conveyence_id : this.models('props.data.departure.id'),
            })
    }

    handleUldChange(event) {
        const checked = event.target.checked
        this.props.handleUldChange(checked)
    }

    handleConveyenceChange(transport, event=null) {
        if(event) {
            const checked = event.target.checked
            let selected_transport = this.mld_transport
            if(checked) {
                selected_transport = transport
                this.setState({
                    departure_conveyence_id : selected_transport.id,
                    assignation_conveyence_id : selected_transport.id,
                    conveyence_id : selected_transport.id
                })
                this.props.handleReceptacleTransportChange(selected_transport, checked)
            }
            else {
                this.setState({
                    departure_conveyence_id : '',
                    assignation_conveyence_id : '',
                    conveyence_id : 'null'
                })
                this.props.handleReceptacleTransportChange(null, checked)
            }
        }
        else {
            this.setState({
                departure_conveyence_id : transport.id,
                assignation_conveyence_id : transport.id
            })
            this.props.handleReceptacleTransportChange(transport, checked)
        }
    }

    control(select_transport) {
        const isDisabled = false
        const disabled = isDisabled?{disabled:true}:{}
        if(this.models('props.data.resdits', []).find(it=>it.consignment_event_code==6)) {
            const resdit = this.models('props.data.resdits', []).find(it=>(it.conveyence_id==select_transport.id && it.consignment_event_code==6))
            if(resdit) {
                if(this.cast(resdit, 'nsetup.mld')) {
                    return <div className="btn btn-xs btn-blue text-white">MLD {moment(this.cast(this.models('props.data.resdits', []).find(it=>(this.cast(it, 'nsetup.mld') && this.cast(it, 'nsetup.localtime'))), 'nsetup.localtime')).format('DD/MM')}</div>
                }
            }
        }
        return <div className="fancy-checkbox">
            <label><input type="checkbox" name={`assignation_receptacles[${this.props.data.id}][conveyence_id]`} {...disabled} value={select_transport.id} checked={!disabled.disabled && this.state.assignation_conveyence_id==select_transport.id} onChange={e=>this.handleConveyenceChange(select_transport, e)}/><span></span></label>
        </div>
    }

    departureControl(select_transport) {
        const isDisabled = false
        const disabled = isDisabled?{disabled:true}:{}
        if(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mld'))) {
            return <div className="fancy-checkbox">
                <label><input type="checkbox" name={`departure_receptacles[${this.props.data.id}][conveyence_id]`} {...disabled} value={select_transport.id} checked={!disabled.disabled && this.state.departure_conveyence_id==select_transport.id} onChange={e=>this.handleConveyenceChange(select_transport, e)}/><span></span></label>
            </div>
        }
        return null
    }

    render() {
        const isDisabled = false
        const disabled = isDisabled?{disabled:true}:{}
        let classNames = []
        if(isDisabled)
            classNames.push('bg-stone')
        if(this.props.data.nsetup.reference_receptacle_id)
            classNames.push('row-danger')
        return <tr className={classNames.join(' ')}>
        <td>
            <div className="fancy-checkbox">
                <label><input type="checkbox" name={`receptacle_ulds[${this.props.data.id}]`} value={1} checked={this.props.data.selected} onChange={this.handleUldChange}/><span></span></label>
            </div>
        </td>
        <td className="text-left">
            {this.props.data.nsetup.receptacle_id}
            <input type="hidden" name={`cardits[${this.props.data.cardit_id}][receptacles][${this.props.data.id}][conveyence_id]`} value={this.state.assignation_conveyence_id}/>
            <input type="hidden" name={`cardits[${this.props.data.cardit_id}][receptacles][${this.props.data.id}][setup][container_id]`} value={this.cast(this.props.data.resdits.find(it=>this.cast(it, 'nsetup.container_id')), 'nsetup.container_id')}/>
        </td>
        <td>
            {this.models('props.data.cardit.nsetup.document_number')}
        </td>
        <td>
            {this.models('props.data.cardit.lta.code')}
        </td>
        {this.props.selectTransports.map(select_transport=><td key={`select-transport-departure-${select_transport.id}`} className="text-center">
            {this.departureControl(select_transport)}
        </td>)}
    </tr>
    }
}

Modelizer(ReceptacleLine)

class Status extends Component
{
    constructor(props) {
        super(props)
        const flightHref = {href:`/flight?${qs.stringify({id:this.models('props.pkey'),format:'pdf'})}`,target:'_blank'}
        let resdit_files = []
        let flights = []
        let files = []
        let files_tablet = [<div className="row" key={`mail-manifest-file-tablet-${this.props.data.id}`}>
            <a key={`download-tablet-${this.props.data.id}-mail-manifest`} className="btn btn-orange text-white col-md-3 font-10 pt-2 m-2" {...flightHref}><span className="bg-light pt-1 d-block font-25 m-2 rounded text-primary"><i className="fa fa-file-contract fa-2x text-orange"></i></span></a>
            <Ry/>
        </div>]
        this.models('props.data.resdits', []).map(resdit=>{
            resdit.files.map(file=>{
                files.push(<a key={`download-${this.props.data.id}-resdit-${file}-${files.length}`} className="btn btn-info text-white col-md-3 font-10 pt-2 m-2" {...this.hrefs(file, resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}<br/><small className="font-10 d-block">{file.split('-')[1]}</small></span></a>)
                files_tablet.push(<a key={`download-tablet-${this.props.data.id}-resdit-${file}-${files_tablet.length}`} className="btn text-white btn-info col-md-4 font-10 pt-2 m-2" {...this.hrefs(file, resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file}</span></a>)
                resdit_files.push(file.split('-')[0])
                flights.push(file.split('-')[1])
            })
        })
        this.state = {
            oneTransportAllChecked : false,
            oneUldAllChecked: false,
            receptacles : this.props.data.receptacles,
            resdits : this.props.data.resdits,
            updated_resdits : this.props.data.updated_resdits,
            changed : false,
            dtchanged : false,
            consignment_event : "departure",
            files : files,
            files_tablet : files_tablet,
            resdit_files : resdit_files,
            flights : flights,
            conveyence: this.props.data.conveyence
        }
        this.handleReceptacleTransportChange = this.handleReceptacleTransportChange.bind(this)
        this.handleAllReceptacleTransportChange = this.handleAllReceptacleTransportChange.bind(this)
        this.handleAllReceptacleUldChange = this.handleAllReceptacleUldChange.bind(this)
        this.handleUldChange = this.handleUldChange.bind(this)
        this.hrefs = this.hrefs.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleValidate = this.handleValidate.bind(this)
        this.confirm = this.confirm.bind(this)
        this.departure_date = React.createRef()
    }

    handleUldChange(value, receptacle) {
        this.setState(state=>{
            const r = state.receptacles.find(it=>it.id==receptacle.id)
            r.selected = value
            return state
        })
    }

    handleSubmit(consignment_event) {
        $(`#infos-detail-${this.props.data.id}`).modal('show')
    }

    handleValidate() {
        $(`#infos-detail-${this.props.data.id}`).modal('hide')
        $(this.refs.frm_cardit).submit()
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
                        if(`schedule-transport-departure-${select_transport.id}` in this.refs)
                            this.refs[`schedule-transport-departure-${select_transport.id}`].validate()
                    })
                    window.setTimeout(()=>{
                        $(`#schedule-${this.props.data.id}-departure`).modal('hide')
                        $(this.refs.frm_cardit).submit()
                    }, 10)
                }
            })
        }
        else {
            $(`#schedule-${this.props.data.id}-departure`).modal('hide')
            $(this.refs.frm_cardit).submit()
        }
    }

    hrefs(file, resdit) {
        return this.props.readOnly ? {
            href : `#dialog/export/resdit-${file}-${resdit.id}.txt`,
            target : '_blank'
        }:{}
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidMount() {
        const opts = {
            language : 'fr',
            autoclose : true
        }
        const dp = $(this.departure_date.current).datepicker(opts)
        dp.on("changeDate", ()=>{
            this.setState(state=>{
                state.conveyence.departure_datetime_lt = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
                return state
            })
        });
        this.unsubscribe = this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='flight_resdit' && storeState.id==this.props.data.id) {
                this.setState(state=>{
                    let resdits = state.resdits
                    let resdit_files = []
                    let flights = []
                    let transports = {}
                    storeState.resdits.map(resdit_group=>{
                        resdit_group.data.map(resdit=>{
                            resdits.push(resdit)
                            this.descend(transports, storeState.consignment_event, resdit)
                            resdit.files.map(file=>{
                                resdit_files.push(file.split('-')[0])
                                flights.push(file.split('-')[1])
                            })
                        })
                    })
                    state.changed = false
                    state.resdits = resdits
                    state.updated_resdits = transports
                    state.resdit_files = resdit_files
                    state.flights = flights
                    if(state.resdits.length>0) {
                        state.resdits.map(resdit=>{
                            if(storeState.consignment_event=='assignation') {
                                resdit.files.map(file=>{
                                    state.files.push(<a key={`download-${this.props.data.id}-resdit-${file}-${state.files.length}`} className="btn btn-info text-white col-md-3 font-10 pt-2 m-2" {...this.hrefs(file, resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}<br/><small className="font-10 d-block">{file.split('-')[1]}</small></span><Ry/></a>)
                                    state.files_tablet.push(<a key={`download-tablet-${this.props.data.id}-resdit-${file}-${state.files.length}`} className="btn text-white btn-info col-md-4 font-10 pt-2 m-2" {...this.hrefs(file, resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file}</span><Ry/></a>)
                                })
                            }
                            else {
                                resdit.files.map(file=>{
                                    state.files.push(<a key={`download-${this.props.data.id}-resdit-${file}-${state.files.length}`} className="btn btn-info text-white col-md-3 font-10 pt-2 m-2" {...this.hrefs(file, resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}<br/><small className="font-10 d-block">{file.split('-')[1]}</small></span><Ry/></a>)
                                    state.files_tablet.push(<a key={`download-tablet-${this.props.data.id}-resdit-${file}-${state.files.length}`} className="btn text-white btn-info col-md-4 font-10 pt-2 m-2" {...this.hrefs(file, resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file}</span><Ry/></a>)
                                })
                            }
                        })
                    }
                    return state
                })
            }
            if(storeState.type=='resdit')
                $(`#schedule-${this.props.data.id}-departure`).modal('hide')
        })
    }

    handleReceptacleTransportChange(receptacle, transport, checked) {
        this.setState(state=>{
            state.changed = true
            let found_receptacle = state.receptacles.find(item=>item.id==receptacle.id)
            if(found_receptacle) {
                if(checked) {
                    found_receptacle.departure = checked
                }
                else {
                    found_receptacle.departure = null
                }
            }
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
                    item.departure = {...transport}
                })
            }
            else {
                state.receptacles.map(item=>{
                    item.departure.id = 0
                })
            }
            return state
        })
    }

    handleAllReceptacleUldChange(event) {
        const value = event.target.checked
        this.setState(state=>{
            state.oneUldAllChecked = value
            state.receptacles.map(item=>{
                item.selected = value
            })
            return state
        })
    }

    render() {
        const isDisabled = false
        let isDone = this.models('state.updated_resdits.departure')
        let done = null
        let done_head = ''
        let done_resdits = []
        if(isDone && this.state.resdit_files.length>0) {
            done_head = trans('Départ validée le :date à :time par :author', {
                date : moment.utc(isDone.localtime).format('DD/MM/YYYY'),
                time : moment.utc(isDone.localtime).format('HH:mm'),
                author : `${this.cast(isDone, 'author.profile.gender_label')} ${this.cast(isDone, 'author.profile.official')}`
            })
            done_resdits = []
            this.state.flights.map((flight, index)=>{
                let transport = this.props.data.conveyence
                if(this.models('props.data.conveyence.departure_datetime_lt', false) && this.models('props.data.conveyence.departure_datetime_lt', false)!=transport.departure_datetime_lt) {
                    done_resdits.push(trans('<br/>RESDIT :resdit_files envoyé - Vol :flights :original_flight_datetime - <span class="text-danger">Horaire modifié : :flight_datetime</span>', {
                        resdit_files : this.state.resdit_files[index],
                        flights : flight,
                        original_flight_datetime : moment(transport.departure_datetime_lt).format('DD/MM/YYYY [à] HH:mm'),
                        flight_datetime : moment(this.models('props.data.conveyence.departure_datetime_lt', transport.departure_datetime_lt)).format('DD/MM/YYYY [à] HH:mm')
                    }))
                }
                else {
                    done_resdits.push(trans('<br/>RESDIT :resdit_files envoyé - Vol :flights :flight_datetime', {
                        resdit_files : this.state.resdit_files[index],
                        flights : flight,
                        flight_datetime : moment(this.models('props.data.conveyence.departure_datetime_lt', transport.departure_datetime_lt)).format('DD/MM/YYYY [à] HH:mm')
                    }))
                }
            })
            done = done_head + done_resdits.join('') + '<br/>' + trans('Départ :airport (:iata)', {
                airport : this.models('props.data.conveyence.departure_location.name'),
                iata : this.models('props.data.conveyence.departure_location.iata')
            })
        } 
        return <div className="row">
        <div className="col-md-12 d-md-block d-xl-none">
            <div className="row text-left text-body">
                <div className="col-md-4">
                    {this.state.files_tablet}
                </div>
            </div>
        </div>
        <div className="col-xl-3 d-md-none d-xl-block">
            <table className="table table-bordered table-resume">
                <thead>
                    <tr>
                        <th>{trans('CARDIT')}</th>
                        <th>{trans('AWB')}</th>
                        <th>{trans('Qté de récipients')}</th>
                        <th>{trans('Poids (:weight_unit)', {weight_unit:'Kg'})}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.receptacles.groupBy(it=>it.cardit_id).map((receptacles, index)=>{
                    let weight = 0
                    receptacles.map(receptacle=>{
                        weight += parseFloat(receptacle.nsetup.weight)
                    })
                    return <tr key={`synthese-cardit-${this.cast(receptacles, '0.cardit_id', index)}`}>
                        <td>{this.cast(receptacles, '0.cardit.nsetup.document_number')}</td>
                        <td>{this.cast(receptacles, '0.cardit.lta.code')}</td>
                        <td>{receptacles.length}</td>
                        <td>{numeral(weight).format('0,0.00')}</td>
                    </tr>})}
                </tbody>
            </table>
            <div className="blockTemps">
                {this.state.resdits.unique(it=>it.id).groupBy(it=>it.conveyence_id).map((resdits, index)=><div className="row border-bottom" key={`resdit-files-download-${index}`}>{resdits.filter(it=>it.event!='delivery').map(resdit=>resdit.files.map(file=><a key={`download-${resdit.id}-resdit-${file}-${resdit.files.length}`} className="btn btn-info text-white col-md-3 font-10 pt-2 m-2" {...this.hrefs(file, resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}<br/><small className="font-10 d-block">{file.split('-')[1]}</small><small className="d-block text-dark subfile">{this.cast(resdit, 'cardit.nsetup.document_number')}</small></span><Ry/></a>))}</div>)}
            </div>
        </div>
        <div className="col-xl-9">
            <div className="table-responsive">
                <form ref="frm_cardit" name={`frm_cardit${this.props.data.id}`} action={`/flight`} method="post">
                    <Ry title="ajaxform"/>
                    <input type="hidden" name="ry"/>
                    <input type="hidden" name="id" value={this.props.data.id}/>
                    <input ref="consignment_event" type="hidden" name="consignment_event" value="departure"/>
                    <input type="hidden" name="transport_index" value="0"/>
                    <table className="table tableRecap">
                        <thead>
                            <tr>
                                <th rowSpan="2" colSpan="4"
                                    className="colorVert noBor pl-0 text-left text-wrap">
                                        {trans('Nombre de récipients')} : {this.state.receptacles.length}
                                </th>
                                {(!this.props.readOnly && !this.models('props.data.resdits', []).find(it=>it.event=='departure'))?<th rowSpan="2" className="thModal">
                                    <button className="btn btn-primary js-sweetalert"
                                            data-type="with-custom-icon" type="button" onClick={this.props.addTransport}>+
                                    </button>
                                </th>:null}
                                <th colSpan={this.props.selectTransports.length} className="thTop text-capitalize">{trans("Départ")}</th>
                            </tr>
                            <tr className="thLeft">
                                {this.props.selectTransports.map(select_transport=><th key={`cardit-departure-0-${this.props.data.id}-select-transport-${select_transport.id}`}><Popover data={select_transport}/>
                                </th>)}
                            </tr>
                            <tr>
                                <th>
                                    <div className="fancy-checkbox">
                                        <label><input type="checkbox" value="1" onChange={this.handleAllReceptacleUldChange} checked={this.state.oneUldAllChecked}/><span></span></label>
                                    </div>
                                </th>
                                <th>{trans("Numéro du récipient")}</th>
                                <th>{trans('Cardit')}</th>
                                <th>{trans('AWB')}</th>
                                {this.props.selectTransports.map(select_transport=><th key={`cardit-departure-checkall-${this.props.transportIndex}-${this.props.data.id}-select-transport-${select_transport.id}`}>
                                    {(this.props.selectTransports.length==1 && CHECKBOXES)?<div className="fancy-checkbox">
                                    <label><input type="checkbox" onChange={event=>this.handleAllReceptacleTransportChange(select_transport, event)} checked={this.state.oneTransportAllChecked}/><span></span></label>
                                </div>:<label className="fancy-radio custom-color-green m-auto">
                                        <input type="radio" name={`checkall[departure][${this.props.transportIndex}]`} onChange={event=>this.handleAllReceptacleTransportChange(select_transport, event)} checked={this.models(`props.allTransport.id`)==select_transport.id}/>
                                        <span><i className="m-0"></i></span>
                                    </label>}
                                </th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.receptacles.map((receptacle, index)=><ReceptacleLine key={`content-mail-manifest-${this.props.transportIndex}-${receptacle.id}`} handleUldChange={checked=>this.handleUldChange(checked, receptacle)} defaultConveyence={this.props.data.conveyence} pkey={this.props.data.id} data={receptacle} selectTransports={this.props.selectTransports} transportIndex={this.props.transportIndex} handleReceptacleTransportChange={(select_transport, checked)=>this.handleReceptacleTransportChange(receptacle, select_transport, checked)} readOnly={this.props.readOnly} store={this.props.store} departureSent={this.models('props.data.resdits', []).find(it=>it.event=='departure')}/>)}
                            <tr>
                                <td className="border-right-0 border-top-0 border-bottom-0 noBg">
                                    <div className="dropdown">
                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {trans('Actions')}
                                        </button>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#">{trans('Déplacer')}</a>
                                            <a className="dropdown-item" href="#">{trans('Supprimer')}</a>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-right-0 border-top-0 border-bottom-0 noBg" colSpan="3"></td>
                                <td colSpan={this.props.selectTransports.length} className="border-0 p-0">
                                    <button className="btn btn-orange rounded-0" type="button" onClick={()=>this.handleSubmit('departure')}>{trans("Valider")}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Localtime/>
                    <Popup id={`schedule-${this.props.data.id}-departure`} className="popup-consignment-datetime">
                        <PopupHeader>
                            {trans("Confirmation dates/heures départ")}
                        </PopupHeader>
                        <PopupBody>
                            {this.props.selectTransports.map(select_transport=><Transport ref={`schedule-transport-departure-${select_transport.id}`} key={`schedule-transport-departure-${select_transport.id}`} data={select_transport} datetimeLT={select_transport.departure_datetime_lt} onChange={()=>this.setState({dtchanged:true})} consignmentEvent="departure"/>)}
                        </PopupBody>
                        <PopupFooter>
                            <button className="btn btn-primary p-2 font-18 text-uppercase" type="button" onClick={this.confirm}>
                                {trans('Valider')}
                            </button>
                        </PopupFooter>
                    </Popup>
                    <Popup id={`infos-detail-${this.props.data.id}`} className="airport-modal">
                        <PopupHeader className="pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                            <h5><span className="text-body">{trans("Modifier")}</span></h5>
                        </PopupHeader>
                        <PopupBody>
                            <div className="form-group">
                                <label className="control-label">
                                    {trans('Nº de conteneur')}
                                </label>
                                <input type="text" name="container_id" className="form-control bs-default" required defaultValue={this.props.data.container_id}/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">
                                    {trans('Nº de vol')}
                                </label>
                                <input type="text" name="conveyence[reference]" className="form-control bs-default" required defaultValue={this.models('props.data.conveyence.reference')}/>
                            </div>
                            <div className="form-group">
                                <label className="control-label text-capitalize">
                                    {trans("Date de départ")}
                                </label>
                                <div ref={this.departure_date} className="input-group date">
                                    <input type="text" className="form-control bs-default" required data-parsley-errors-container={`#departure_date-${this.props.data.id}-error`} defaultValue={moment(this.models('state.conveyence.departure_datetime_lt')).format('DD/MM/YYYY')}/>
                                    <div className="input-group-append"> 
                                        <button className="btn-primary btn text-light pl-3 pr-3" type="button"><i className="fa fa-calendar-alt"></i></button>
                                    </div>
                                </div>
                                <span id={`departure_date-${this.props.data.id}-error`}></span>
                            </div>
                            <input type="hidden" name="conveyence[departure_datetime_lt]" value={this.models('state.conveyence.departure_datetime_lt')}/>
                            <input type='hidden' name='upl' value={this.state.changed}/>
                            <button className="btn btn-orange py-2 font-18 text-capitalize" type="button" onClick={this.handleValidate}>{trans('Confirmer')}</button>
                        </PopupBody>
                    </Popup>
                </form>
            </div>
        </div>
    </div>
    }
}

export default Modelizer(Status);