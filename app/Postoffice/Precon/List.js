import React, {Component} from 'react';
import $ from 'jquery';
import moment from 'moment';
import {Popup, PopupHeader, PopupBody} from 'ryvendor/bs/bootstrap';
import numeral from 'numeral';
import trans from 'ryapp/translations';
import NavigableModel from 'ryvendor/Ry/Core/NavigableModel';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import swal from 'sweetalert2';
import Ry, {store} from 'ryvendor/Ry/Core/Ry';
import {StepView} from 'ryvendor/Ry/Airline/Cardit/Item';
import Localtime from 'ryvendor/Ry/Airline/Cardit/Localtime';
import {Route} from 'ryvendor/Ry/Airline/Cardit/Status';

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
            {this.props.data.nsetup.receptacle_id}
        </td>
        <td>{this.props.data.nsetup.handling}</td>
        <td>{this.props.data.nsetup.nesting}</td>
        <td>{this.models('props.data.nsetup.type.interpretation', '--')}</td>
        <td>{this.props.data.nsetup.weight}</td>
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
                    <ul className="info">
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
                                    <th width="300">{trans('Numéro du récipient')}</th>
                                    <th>{trans('Flag')} <i className="icon-info"></i></th>
                                    <th width="250">{trans('Container Journey ID')}</th>
                                    <th>{trans('Type de récipient')}</th>
                                    <th>{trans('Poids (Kg)')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.receptacles.map((receptacle, index)=><ReceptacleLine key={`content-reception-${receptacle.id}`} data={receptacle} readOnly={this.props.readOnly} consignmentEvents={this.props.consignmentEvents} handleReceptacleStatusChange={code=>this.handleReceptacleStatusChange(receptacle, code)}/>)}
                            </tbody>
                        </table>
                        <Localtime/>
                    </form>
                </div>
            </div>
        </div>
    }
}

Modelizer(Reception);

class FullDetail extends Component
{
    constructor(props) {
        super(props)
        let allTransports = []
        let data = this.props.data
        data.nsetup.transports.map(transport=>{
            allTransports.push({
                assignation : null,
                departure : null,
                arrival : null
            })
        })
        this.state = {
            data : this.props.data,
            step : 'reception',
            transport_index : 0,
            transports : data.transports,
            allTransports : allTransports,
            newairport : {
                iata : ''
            },
            select_airport : false,
            select_airports : []
        }
        this.reception = this.reception.bind(this)
        this.assignation = this.assignation.bind(this)
        this.departure = this.departure.bind(this)
        this.delivery = this.delivery.bind(this)
        this.arrival = this.arrival.bind(this)
        this.addTransport = this.addTransport.bind(this)
        this.saveTransport = this.saveTransport.bind(this)
        this.removeSelectTransport = this.removeSelectTransport.bind(this)
        this.arrival_date = moment()
        this.departure_date = moment()
        this.handleAllReceptacleTransportChange = this.handleAllReceptacleTransportChange.bind(this)
        this.handleSearchAirport = this.handleSearchAirport.bind(this)
        this.handleSelectAirport = this.handleSelectAirport.bind(this)
        this.offClick = this.offClick.bind(this)
        this.getStepView = this.getStepView.bind(this)
        this.getHeadStep = this.getHeadStep.bind(this)
    }

    getStepView() {
        return <StepView data={this.props.data} step={this.state.step} store={this.props.store} reception={this.reception} assignation={transport_index=>this.assignation(transport_index)} departure={transport_index=>this.departure(transport_index)} arrival={transport_index=>this.arrival(transport_index)} delivery={this.delivery}/>
    }

    offClick() {
        this.setState({
            select_airport : false
        })
        $('body').off('click', this.offClick)
    }

    handleSearchAirport(event) {
        const value = event.target.value
        this.setState(state=>{
            state.newairport.iata = value
            return state
        })
        if(this.axRunning)
            this.axRunning.abort()

        this.axRunning = $.ajax({
            url : '/airports',
            data : {
                json : true,
                s : value
            },
            success : response=>{
                if(response.data && response.data.data.length>0) {
                    $('body').on('click', this.offClick)
                    this.setState({
                        select_airport : true,
                        select_airports : response.data.data
                    })
                }
            }
        })
    }

    handleSelectAirport(event, airport) {
        event.preventDefault()
        this.setState({
            newairport : airport,
            select_airport : false
        })
        return false
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentDidMount() {
        if(this.props.data.transports.length>0) {
            const opts = {
                startDate : moment(this.cast(this.props.data.transports.find(it=>it.pivot.step==0), 'departure_datetime_lt')).toDate(),
                language : 'fr',
                autoclose : true
            }
            const dp = $(this.refs.departure_date).datepicker(opts)
            const dp_arrival = $(this.refs.arrival_date).datepicker(opts)
            dp.on("changeDate", ()=>{
                this.departure_date = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
                $(this.refs.arrival_date).datepicker('setStartDate', moment(dp.datepicker('getDate')).toDate())
            });
            dp_arrival.on("changeDate", ()=>{
                this.arrival_date = moment(dp_arrival.datepicker('getDate')).format('YYYY-MM-DD')
            });
        }
        this.unsubscribe = this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='resdit' && storeState.data && storeState.data.length>0) {
                this.setState(state=>{
                    state.data.resdits = state.data.resdits.concat(storeState.data)
                    return state
                })
            }
        })
    }

    saveTransport() {
        if($(this.refs.frm_add_transport).parsley().validate()) {
            const departure_datetime = this.refs.departure_time.value
            const arrival_datetime = this.refs.arrival_time.value
            const values = {
                new : true,
                reference : this.refs.conveyence_reference.value,
                departure_date : this.departure_date,
                departure_time : this.refs.departure_time.value,
                departure_datetime_lt : this.departure_date+' '+departure_datetime.substr(0,2)+':'+departure_datetime.substr(2,2)+':00',
                arrival_date : this.arrival_date,
                arrival_time : this.refs.arrival_time.value,
                departure_location : this.state.newairport,
                arrival_datetime_lt : this.arrival_date+' '+arrival_datetime.substr(0,2)+':'+arrival_datetime.substr(2,2)+':00',
                pivot : {
                    step : this.state.transport_index
                }
            }
            $.ajax({
                url : '/transports',
                type : 'post',
                data : {...values, cardit_id: this.props.data.id, transport_index: this.state.transport_index, json:true},
                success : response=>{
                    this.setState(state=>{
                        state.allTransports[state.transport_index][state.step] = null
                        values.id = response.id
                        state.transports.push(values)
                        state.newairport = {
                            iata : ''
                        }
                        return state
                    })
                    this.refs.conveyence_reference.value = ''
                    this.departure_date = moment()
                    this.arrival_date = moment()
                    this.refs.departure_time.value = ''
                    this.refs.arrival_time.value = ''
                    $(this.refs.departure_date).datepicker('update', '');
                    $(this.refs.arrival_date).datepicker('update', '');
                    $(`#transport_popup_${this.props.data.id}`).modal('hide')
                }
            })
        }
    }

    addTransport() {
        $(`#transport_popup_${this.props.data.id}`).modal('show')
    }

    reception() {
        this.setState({
            step : 'reception'
        })
    }

    assignation(transport_index) {
        this.setState({
            step : 'assignation',
            transport_index : transport_index
        })
    }

    departure(transport_index) {
        this.setState({
            step : 'departure',
            transport_index : transport_index
        })
    }

    delivery() {
        this.setState({
            step : 'delivery'
        })
    }

    arrival(transport_index) {
        this.setState({
            step : 'arrival',
            transport_index : transport_index
        })
    }

    removeSelectTransport(select_transport) {
        this.setState(state=>{
            state.transports = state.transports.filter(item=>item.pivot.step==state.transportIndex && item.id!=select_transport.id)
            return state
        })
    }

    handleAllReceptacleTransportChange(transport) {
        this.setState(state=>{
            state.allTransports[state.transport_index][state.step] = transport
            return state
        })
    }

    getHeadStep() {
        let headStep = null;
        let transport = this.props.data.transports.find(it=>it.pivot.step==this.state.transport_index)
        switch(this.state.step) {
            case 'reception':
                headStep = <div className="centerText">
                    {trans("Réception : récipients au départ de l'aéroport d'origine")} : {this.props.data.nsetup.handover_origin_location.country.nom} - {this.props.data.nsetup.handover_origin_location.iata} - {this.props.data.nsetup.handover_origin_location.name}
                </div>
                break;
            case 'delivery':
                headStep = <div className="centerText">
                    {trans("Livraison des récipients à destination : :country_name - :iata - :airport_name", {
                        country_name : this.models('props.data.nsetup.handover_destination_location.country.nom', this.models('props.data.nsetup.handover_destination_location.adresse.ville.country.nom')),
                        iata : this.models('props.data.nsetup.handover_destination_location.iata', this.models('props.data.nsetup.handover_destination_location.cardit')),
                        airport_name : this.props.data.nsetup.handover_destination_location.name
                    })}
                </div>
                break;
            case 'assignation':
            //todo : choices available transport at same point
                headStep = <div className="centerText">
                    {trans("Assignation : récipients assignés au vol :vol au départ de l'aéroport :country_name - :iata - :airport_name", {vol:transport.reference, country_name:transport.departure_location.country.nom, iata:transport.departure_location.iata, airport_name:transport.departure_location.name})}
                </div>
                break;
            case 'departure':
                headStep = <div className="centerText">
                    {trans("Départ des récipients sur le vol Nº:vol au départ de l'aéroport :country_name - :iata - :airport_name", {vol:transport.reference, country_name:transport.departure_location.country.nom, iata:transport.departure_location.iata, airport_name:transport.departure_location.name})}
                </div>
                break;
            case 'arrival':
                headStep = <div className="centerText">
                    {trans("Arrivée des récipients à l'aéroport :airport_name (:iata) - :country_name - Vol :vol", {vol:transport.reference, airport_name:this.cast(transport, 'arrival_location.name'), iata:this.cast(transport, 'arrival_location.iata', this.cast(transport, 'arrival_location.cardit')), country_name:this.cast(transport, 'arrival_location.country.nom', this.cast(transport, 'arrival_location.adresse.ville.country.nom'))})}
                </div>
                break;
        }
        return headStep
    }

    render() {
        let step = <Reception data={this.props.data} consignmentEvents={this.props.consignmentEvents} store={this.props.store} readOnly={this.props.readOnly}/>;
        return <tr className={`detail`}>
        <td colSpan="18" className="no-padding">
            <div className="bandeau">
                <span className="title-bandeau">{trans('Liste des récipients')} </span>
                {this.getHeadStep()}
            </div>
            <div className="tableBottom position-relative">
                {step}
            </div>
            <Popup id={`transport_popup_${this.props.data.id}`} className="modal-sm">
                <PopupBody>
                    <form className="text-left" ref="frm_add_transport">
                        <div className="form-group">
                            <label className="control-label">
                                {trans('Nº de vol')}
                            </label>
                            <input type="text" className="form-control bs-default" ref="conveyence_reference" required/>
                        </div>
                        <div className="form-group">
                            <label className="control-label text-capitalize">
                                {trans("Date de départ")}
                            </label>
                            <div ref="departure_date" className="input-group date">
                                <input type="text" className="form-control bs-default" required data-parsley-errors-container="#departure_date-error"/>
                                <div className="input-group-append"> 
                                    <button className="btn-primary btn text-light pl-3 pr-3" type="button"><i className="fa fa-calendar-alt"></i></button>
                                </div>
                            </div>
                            <span id="departure_date-error"></span>
                        </div>
                        <div className="form-group">
                            <label className="control-label">
                                {trans('Heure de départ')} HHMM
                            </label>
                            <input type="text" className="form-control bs-default" ref="departure_time" data-parsley-pattern="^\d{4}$" required/>
                        </div>
                        <div className="form-group">
                            <label className="control-label text-capitalize">
                                {trans("Date d'arrivée")}
                            </label>
                            <div ref="arrival_date" className="input-group date">
                                <input type="text" className="form-control bs-default" required data-parsley-errors-container="#arrival_date-error"/>
                                <div className="input-group-append"> 
                                    <button className="btn-primary btn text-light pl-3 pr-3" type="button"><i className="fa fa-calendar-alt"></i></button>
                                </div>
                            </div>
                            <span id="arrival_date-error"></span>
                        </div>
                        <div className="form-group">
                            <label className="control-label">
                                {trans("Heure d'arrivée")} HHMM
                            </label>
                            <input type="text" data-parsley-pattern="^\d{4}$" className="form-control bs-default" ref="arrival_time" required/>
                        </div>
                        <div className="form-group">
                            <label className="control-label">
                                {trans('Aéroport de départ')}
                            </label>
                            <div className="input-group position-relative">
                                <input type="text" className="form-control bs-default" value={this.state.newairport.iata} onChange={this.handleSearchAirport} required/>
                                <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_airport?'show':''}`} style={{maxHeight:200}}>
                                    {this.state.select_airports.map(airport=><a key={`airport-${airport.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectAirport(e, airport)}>{airport.iata} ({airport.name} - {this.cast(airport, 'country.nom')})</a>)}
                                </div>
                            </div>
                            
                        </div>
                        <button className="btn btn-orange text-capitalize" type="button" onClick={this.saveTransport}>{trans('Confirmer')}</button>
                    </form>
                </PopupBody>
            </Popup>
        </td>
    </tr>
    }
}

Modelizer(FullDetail)

class Item extends Component
{
	constructor(props) {
        super(props)
        this.state = {
            data : null,
            open : false,
			groupOpen : false
        }
        this.detail = this.detail.bind(this)
		this.departure = this.departure.bind(this)
		this.reception = this.reception.bind(this)
		this.arrival = this.arrival.bind(this)
		this.deliver = this.deliver.bind(this)
    }

	componentDidMount() {
		store.subscribe(()=>{
			const storeState = store.getState()
			if(storeState.type=='detailOpened' && storeState.group==this.props.group) {
				this.setState({
					groupOpen:storeState.open
				})
			}
		})
	}

    detail(e) {
        e.preventDefault()
        if(this.state.data) {
            this.setState(state=>{
                state.open = !state.open
				return state
            }, ()=>{
				store.dispatch({
					type : 'detailOpened',
					group : this.props.group,
					open : this.state.open
				})
			})
            return false
        }
        $.ajax({
            url : '/precon',
            data : {
                id : this.props.data.id,
                json : true
            },
            success : response=>{
                this.setState({
                    open : true,
                    data : response.data.data,
                    delivery_consignment_events : response.delivery_consignment_events,
                    consignment_events : response.consignment_events
                }, ()=>{
				store.dispatch({
					type : 'detailOpened',
					group : this.props.group,
					open : true
				})
			})
            }
        })
        return false
    }

	escales(precon) {
        let k = precon.nsetup.transports.length
        switch(k) {
            case 1:
                return <div>{trans('Direct')}</div>
            case 2:
                return <a className="btn btn-turquoise cursor-default d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${precon.id}`).modal('show')
                }}><span className="font-12">{trans('1 escale')}</span><i className="icon-pencil"></i></a>
            case 3:
                return <a className="btn btn-turquoise cursor-default d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${precon.id}`).modal('show')
                }}><span className="font-12">{trans(':n escales', {n:2})}</span><i className="icon-pencil"></i></a>
            
        }
    }

	departure(precon) {
		return this.reception(precon, 'DEP')
	}
	
	arrival(precon) {
		return this.reception(precon, 'ARR')
	}
	
	deliver(precon) {
		return this.reception(precon, 'DLV')
	}

	reception(precon, type="RCS") {
		const TYPECODES = {
			ARR : 14,
			DEP : 24,
			DLV : 21,
			RCS : 74
		}
        return <a className={`btn ${this.cast(precon, 'nsetup.fsus.' + TYPECODES[type])?'btn-turquoise':'btn-theme'} cursor-default d-flex justify-content-center pr-1 align-items-center m-auto`} href="#" style={{height:20,width:20}}><span></span> {true?null:<i className="icon-pencil"></i>}</a>
    }
	
	afterTd(precon) {

    }

    afterTh() {

    }
	
	render() {
		return <React.Fragment>
		<tr className={`gradeA ${this.props.bg}`}>
                    <td>{moment.utc(this.models('props.data.nsetup.preparation_datetime')).local().format('DD/MM/YYYY')}</td>
                    <td>{moment(this.models("props.data.nsetup.preparation_datetime_lt")).format('HH:mm')}</td>
                    <td className="actions border-right-0">
						<div className="d-flex align-items-center px-3">
							<a href={`#dialog/precon_file?id=${this.models("props.data.id")}`}><i className="icon-info"></i></a><span className="d-inline-block px-2 list-document-number">{this.models("props.data.nsetup.document_number")}</span>
							<a href="#" onClick={this.detail} className="btnAccord"><i className={`fa ${this.state.open?'fa-sort-up':'fa-sort-down'}`}></i></a>
							{this.models('props.data.lta.lta.medias', []).find(it=>(it.title=='fhl' && it.descriptif==this.models("props.data.id")))?<a href={`#dialog/fhl?id=${this.models('props.data.lta.lta.medias', []).find(it=>(it.title=='fhl' && it.descriptif==this.models("props.data.id"))).id}`} className="btn-turquoise ml-2 px-3 py-1 text-white w-auto" data-display="modal-xl">{trans('FHL')}</a>:null}          
						</div>
                    </td>
					{(this.props.nrows>0 && this.props.pindex==0)?<td rowSpan={this.props.nrows+(this.state.groupOpen?1:0)} className="border-left-0">
						<div className="d-flex align-items-center px-3">
							{this.models('props.data.lta.lta.medias', [].find(it=>it.title=='carditlta'))?<React.Fragment>
								<a href={`#barcode?code=${this.models("props.data.lta.lta.code")}`} onClick={()=>$(`#precon${this.models("props.data.id")}`).modal('show')}><i className="fa fa-barcode"></i></a>
					            <Popup id={`precon${this.models("props.data.id")}`}>
					                <PopupBody>
										<table className="table table-bordered table-centerall table-transparent">
											<thead>
												<tr>
													<th colSpan="2"><h3>{this.models('props.data.lta.lta.company.company.name')}</h3></th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td colSpan="2">
														<div className="text-left font-10 mx-3">
															{trans("AWB No.")}
														</div>
														<img src={`/barcode?code=${numeral(this.models('props.data.lta.lta.company.company.prefix')).format('000')}-${this.models('props.data.lta.lta.code')}`}/><br/>
														<span className="font-10">{numeral(this.models('props.data.lta.lta.company.company.prefix')).format('000')}-{this.models('props.data.lta.lta.code')}</span>														<h3>{numeral(this.models('props.data.lta.lta.company.company.prefix')).format('000')}-{this.models('props.data.lta.lta.code')}</h3>
													</td>
												</tr>
												<tr>
													<td>
														<div className="text-left font-10 mx-3">
															{trans("Origine")}
														</div>
														{this.models("props.data.nsetup.handover_origin_location.iata")}
													</td>
													<td>
														<div className="text-left font-10 mx-3">
															{trans("Destination")}
														</div>
														{this.models("props.data.nsetup.handover_destination_location.iata")}
													</td>
												</tr>
												<tr>
													<td>
														<div className="text-left font-10 mx-3">
															{trans("Weight")}
														</div>
														{numeral(this.models("props.wreceptacles")).format('0,0.00')} KG
													</td>
													<td>
														<div className="text-left font-10 mx-3">
															{trans("Total number of pieces")}
														</div>
														{this.models("props.nreceptacles")}
													</td>
												</tr>
											</tbody>
										</table>

					                    <div className="text-center py-5">
					                        
					                    </div>
					                </PopupBody>
					            </Popup>
								<a href={`#dialog/awb?precon_id=${this.models("props.data.id")}`} className="btn-success ml-2 px-3 py-1 text-white w-auto" data-display="modal-xl">{trans('AWB')}</a>
							</React.Fragment>:null}
							{this.models('props.data.lta.lta.medias', [].find(it=>it.title=='fwb'))?<a href={`#dialog/fwb?precon_id=${this.models("props.data.id")}`} className="btn-rose ml-2 px-3 py-1 text-white w-auto" data-display="modal-xl">{trans('FWB')}</a>:null}
						</div>
					</td>:null}
                    <td>{this.models("props.data.nsetup.consignment_category.code")}</td>
                    <td>{this.models("props.data.nsetup.mail_class.code")}</td>
                    <td>{this.models("props.data.nsetup.nreceptacles")}</td>
                    <td>{numeral(this.models("props.data.nsetup.wreceptacles")).format('0,0.00')}</td>
                    <td>{this.models("props.data.nsetup.handover_origin_location.iata")} <a href="#" onClick={e=>{
                        e.preventDefault()
                        $(`#origin-${this.models("props.data.id")}`).modal('show')
                    }}><i className="fa fa-info-circle text-turquoise"></i></a>
                        <Popup id={`origin-${this.models("props.data.id")}`} className="airport-modal">
                            <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                                <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans("Aéroport d'origine")}</span></h5>
                            </PopupHeader>
                            <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                            <PopupBody>
                                <div className="row">
                                    <div className="col-5 text-right text-grey">
                                        {trans('Pays')} :
                                    </div>
                                    <div className="col-7 text-left">
                                        {this.models("props.data.nsetup.handover_origin_location.country.nom")}
                                    </div>
                                    <div className="col-5 text-right text-grey">
                                        {trans('Code')} :
                                    </div>
                                    <div className="col-7 text-left">
                                        {this.models("props.data.nsetup.handover_origin_location.iata")}
                                    </div>
                                    <div className="col-5 text-right text-grey">
                                        {trans('Aéroport')} :
                                    </div>
                                    <div className="col-7 text-left text-wrap">
                                        {this.models("props.data.nsetup.handover_origin_location.name")}
                                    </div>
                                </div>
                            </PopupBody>
                        </Popup>
                    </td>
                    <td className="p-2">{this.escales(this.props.data)}
                        <Popup id={`escales-${this.models("props.data.id")}`}>
                            <PopupHeader>
                                {trans('Escales')}
                            </PopupHeader>
                            <PopupBody>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>{trans('Aéroport')}</th>
                                            <th>{trans('Arrivée')}</th>
                                            <th>{trans('Départ')}</th>
                                            <th>{trans('Vol')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.models("props.data.nsetup.transports", []).slice(0, -1).map((transport, index)=><tr key={`escale-${this.models("props.data.item.id")}-${index}`}>
                                            <td>{transport.arrival_location.iata} - {transport.arrival_location.name} - {transport.arrival_location.country.nom}</td>
                                            <td>{moment(transport.arrival_datetime_lt).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{moment(this.models(`props.data.nsetup.transports.${index+1}.departure_datetime_lt`)).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{this.models(`props.data.nsetup.transports.${index+1}.conveyence_reference`)}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </PopupBody>
                        </Popup>
                    </td>
                    <td>{this.models("props.data.nsetup.handover_destination_location.iata")} <a href="#" onClick={e=>{
                        e.preventDefault()
                        $(`#destination-${this.models("props.data.id")}`).modal('show')
                    }}><i className="fa fa-info-circle text-turquoise"></i></a>
                        <Popup id={`destination-${this.models("props.data.id")}`} className="airport-modal">
                            <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                                <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans('Aéroport de destination')}</span></h5>
                            </PopupHeader>
                            <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                            <PopupBody>
                                <div className="row">
                                    <div className="col-5 text-right text-grey">
                                        {trans('Pays')} :
                                    </div>
                                    <div className="col-7 text-left">
                                        {this.models("props.data.nsetup.handover_destination_location.country.nom")}
                                    </div>
                                    <div className="col-5 text-right text-grey">
                                        {trans('Code')} :
                                    </div>
                                    <div className="col-7 text-left">
                                        {this.models("props.data.nsetup.handover_destination_location.iata")}
                                    </div>
                                    <div className="col-5 text-right text-grey">
                                        {trans('Aéroport')} :
                                    </div>
                                    <div className="col-7 text-left text-wrap">
                                        {this.models("props.data.item.nsetup.handover_destination_location.name")}
                                    </div>
                                </div>
                            </PopupBody>
                        </Popup>
                    </td>
                    <td>{this.models("props.data.nsetup.transports.0.carrier_code")}{this.models("props.data.nsetup.transports.0.conveyence_reference")} <a href="#" onClick={e=>{
                        e.preventDefault()
                        $(`#conveyence-${this.models("props.data.id")}`).modal('show')
                    }}><i className="fa fa-info-circle text-turquoise"></i></a>
                        <Popup id={`conveyence-${this.models("props.data.id")}`} className="airport-modal">
                            <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                                <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans('Premier vol')}</span></h5>
                            </PopupHeader>
                            <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                            <PopupBody>
                                {this.models('props.data.nsetup.transports.0.companies', []).join('<br/>')}
                            </PopupBody>
                        </Popup>
                    </td>
					<td>{moment(this.models("props.data.nsetup.transports.0.departure_datetime_lt")).format("DD/MM/YYYY")}</td>
					<td className="preconred">{moment(this.models("props.data.nsetup.transports.0.departure_datetime_lt")).format("HH:mm")}<Ry/></td>
                    {(this.props.nrows>0 && this.props.pindex==0)?<React.Fragment>
						<td rowSpan={this.props.nrows+(this.state.groupOpen?1:0)} className="precon100">{this.reception(this.props.data)}</td>
	                    <td rowSpan={this.props.nrows+(this.state.groupOpen?1:0)} className="precon100">{this.departure(this.props.data)}</td>
	 					<td rowSpan={this.props.nrows+(this.state.groupOpen?1:0)} className="precon100">{this.arrival(this.props.data)}</td>
	                    <td rowSpan={this.props.nrows+(this.state.groupOpen?1:0)} className="precon100">{this.deliver(this.props.data)}</td>
					</React.Fragment>:null}
                    {this.afterTd(this.props.data)}
                </tr>
			{(this.state.data && this.state.open)?<FullDetail data={this.state.data} consignmentEvents={this.state.consignment_events} deliveryConsignmentEvents={this.state.delivery_consignment_events} store={store} readOnly={true}/>:null}
		</React.Fragment>
	}
}

Modelizer(Item)

class List extends NavigableModel
{
    constructor(props) {
        super(props)
        this.endpoint = '/precons'
        this.model = 'precon'
        this.nopaginate = true
        this.readOnly = false
        this.state.date = moment().format('YYYY-MM-DD')
        this.state.datefilter = this.models('props.data.filter.prepared_at_year') ? 'year' : 'date'
        this.state.nreceptacles = 0
        this.state.errors = []
        this.state.filter = {
            prepared_at : this.models('props.data.filter.prepared_at', moment()),
            to_prepared_at : this.models('props.data.filter.to_prepared_at', moment()),
            prepared_at_year : this.models('props.data.filter.prepared_at_year', moment().year()),
            airline_id : '',
            handover_origin_location : this.models('props.data.filter.handover_origin_location', ''),
            document_number : this.models('props.data.filter.document_number', ''),
            receptacle_id : this.models('props.data.filter.receptacle_id', ''),
            lta_number : this.models('props.data.filter.lta_number', ''),
            handover_destination_location : this.models('props.data.filter.handover_destination_location', '')
            //conveyence_reference : ''
        }
		this.state.airline = null
        this.xhrdata = {...this.state.filter}
        this.xhrdata.prepared_at = moment(this.xhrdata.prepared_at).format('YYYY-MM-DD')
        this.xhrdata.to_prepared_at = moment(this.xhrdata.to_prepared_at).format('YYYY-MM-DD')
        this.table = this.table.bind(this)
        this.beforelist = this.beforelist.bind(this)
        this.onFilter = this.onFilter.bind(this)
        let criterias = this.models('props.data.filter', {})
        this.data = {
            json : true,
            s : Array.isArray(criterias) ? {
                to_prepared_at : moment().format('YYYY-MM-DD')
            } : criterias 
        }
        this.afterTd = this.afterTd.bind(this)
        this.afterTh = this.afterTh.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleCheckAll = this.handleCheckAll.bind(this)
        this.validatePrecon = this.validatePrecon.bind(this)
        this.documentSearch = this.documentSearch.bind(this)
        this.receptacleSearch = this.receptacleSearch.bind(this)
        this.handleDateChecked = this.handleDateChecked.bind(this)
        this.handleYearChecked = this.handleYearChecked.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)
        this.ltaSearch = this.ltaSearch.bind(this)
        this.reception = this.reception.bind(this)
        this.deliver = this.deliver.bind(this)
        this.departure = this.departure.bind(this)
		this.arrival = this.arrival.bind(this)
        this.handleToPreparedAtChange = this.handleToPreparedAtChange.bind(this)
		this.cover = this.cover.bind(this)
    }

	cover() {
		$.ajax({
			url : '/cover',
			success : response=>{
				setTimeout(()=>{
					document.location.reload()
				}, 200)
			}
		})
	}

    ltaSearch() {
        const field = 'lta_number'
        const value = this.refs.lta_number.value
        if(this.pxhr)
            this.pxhr.abort()
        if(!/^\d{8}$/.test(value)) {
            swal(
                trans('LTA erroné'),
                trans("Ce N° de LTA n’existe pas"),
                'error'
            )
            this.setState({
                errors : ['lta_number']
            })
            return
        }
        this.setState(state=>{
            state.filter.lta_number = value
            state.data = []
            state.total = 0
            return state
        })
        this.urls = []
        this.data.s[field] = value
        delete this.data.s.prepared_at
        delete this.data.s.to_prepared_at
        delete this.data.s.prepared_at_year
        delete this.data.s.handover_origin_location
        delete this.data.s.handover_destination_location
        if(this.request) {
            this.request.abort()
        }
        this.request = $.ajax({
            isPagination : true,
            url : this.endpoint,
            data : this.data,
            success : response=>{
                this.setState({
                    data : response.data.data,
                    last_page : response.data.last_page,
                    page : response.data.current_page,
                    total : response.data.total
                })
                window.setTimeout(this.progress, 100)
            }
        })
    }

    handleYearChecked(event) {
        const value = event.target.value
        if(event.target.checked) {
            if(this.pxhr)
                this.pxhr.abort()
            this.setState(state=>{
                state.data = []
                state.datefilter = value
                state.filter.document_number = ''
                state.filter.receptacle_id = ''
                state.filter.lta_number = ''
                state.total = 0
                return state
            })
            this.urls = []
            this.data.s = {...this.state.filter}
            delete this.data.s.prepared_at
            delete this.data.s.to_prepared_at
            delete this.data.s.document_number
            delete this.data.s.lta_number
            delete this.data.s.receptacle_id
            if(this.request) {
                this.request.abort()
            }
            this.request = $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.total = response.data.total
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
                        state.page = response.data.current_page
                        return state
                    })
                    window.setTimeout(this.progress, 100)
                }
            })
        }
    }

    handleToPreparedAtChange(e) {
        const value = e.target.value
        this.setState(state=>{
            state.filter.to_prepared_at = value
            return state
        })
    }

    handleDateChecked(event) {
        const value = event.target.value
        if(event.target.checked) {
            if(this.pxhr)
                this.pxhr.abort()
            this.setState(state=>{
                state.data = []
                state.datefilter = value
                state.total = 0
                state.filter.document_number = ''
                state.filter.receptacle_id = ''
                return state
            })
            this.urls = []
            this.data.s = {...this.state.filter}
            if(this.data.s.prepared_at)
                this.data.s.prepared_at = moment(this.data.s.prepared_at).format('YYYY-MM-DD')
            if(this.data.s.to_prepared_at)
                this.data.s.to_prepared_at = moment(this.data.s.to_prepared_at).format('YYYY-MM-DD')
            delete this.data.s.document_number
            delete this.data.s.lta_number
            delete this.data.s.prepared_at_year
            delete this.data.s.receptacle_id
            if(this.request) {
                this.request.abort()
            }
            this.request = $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.page = response.data.current_page
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
                        state.total = response.data.total
                        return state
                    })
                    this.urls = []
                    window.setTimeout(this.progress, 100)
                }
            })
        }
    }

    handleYearChange(event) {
        const value = event.target.value
        this.setState(state=>{
            state.filter.prepared_at_year = value
            state.filter.document_number = ''
            state.filter.lta_number = ''
            state.filter.receptacle_id = ''
            return state
        })
        if(this.state.datefilter=='year') {
            if(this.pxhr)
                this.pxhr.abort()
            this.data.s = {...this.state.filter}
            this.data.s.prepared_at_year = value
            this.setState(state=>{
                state.data = [],
                state.total = 0
                return state
            })
            this.urls = []
            delete this.data.s.prepared_at
            delete this.data.s.to_prepared_at
            delete this.data.s.document_number
            delete this.data.s.lta_number
            delete this.data.s.receptacle_id
            if(this.request) {
                this.request.abort()
            }
            this.request = $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.page = response.data.current_page
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
                        state.total = response.data.total
                        return state
                    })
                    window.setTimeout(this.progress, 100)
                }
            })
        }
    }

    handleCheck(event, receptacle, precon) {
        const value = event.target.checked
        this.setState(state=>{
            state.data.map(i_precon=>{
                if(precon.id==i_precon.id) {
                    i_precon.receptacles.map(i_receptacle=>{
                        if(i_receptacle.id==receptacle.id)
                            i_receptacle.selected = value
                    })
                }
            })
            return state
        })
    }

    validatePrecon(precon) {
        $.ajax({
            url : '/receptacles',
            type : 'post',
            data : {...this.state.data.find(item=>item.id==precon.id)},
            success : ()=>{
                $(`#receptacles-${precon.id}`).modal('hide')
            }
        })
    }

    handleCheckAll(event, precon) {
        const value = event.target.checked
        this.setState(state=>{
            state.data.map(i_precon=>{
                if(precon.id==i_precon.id) {
                    i_precon.selected = value
                    i_precon.receptacles.map(i_receptacle=>{
                        i_receptacle.selected = value
                    })
                }
            })
            return state
        })
    }

    afterTd(precon) {

    }

    afterTh() {

    }

    onFilter(event, field) {
        const value = event.target.value
        if(this.pxhr)
            this.pxhr.abort()
        this.setState(state=>{
            state.filter.document_number = ''
            state.filter.receptacle_id = ''
            state.filter.lta_number = ''
            state.filter[field] = value
			if(field=='airline_id') {
				state.airline = this.models('props.data.airlines', []).find(it=>it.id==value)
			}
            state.data = []
            state.total = 0
            return state
        })
        this.urls = []
        this.data.s = {...this.state.filter}
        if(this.state.datefilter=='year')
            delete this.data.s.prepared_at
        if(this.state.datefilter=='date' && this.data.s.prepared_at)
            this.data.s.prepared_at = moment(this.data.s.prepared_at).format('YYYY-MM-DD')
        if(this.state.datefilter=='date' && this.data.s.to_prepared_at)
            this.data.s.to_prepared_at = moment(this.data.s.to_prepared_at).format('YYYY-MM-DD')
        delete this.data.s.document_number
        delete this.data.s.lta_number
        delete this.data.s.receptacle_id
        this.data.s[field] = value
        if(this.request) {
            this.request.abort()
        }
        this.request = $.ajax({
            isPagination : true,
            url : this.endpoint,
            data : this.data,
            success : response=>{
                this.setState(state=>{
                    state.data = response.data.data
                    state.last_page = response.data.last_page
                    state.page = response.data.current_page
                    let total_weight = 0
                    let nreceptacles = 0
                    state.data.map(item=>{
                        total_weight += parseFloat(item.nsetup.wreceptacles)
                        nreceptacles += parseInt(item.nsetup.nreceptacles)
                    })
                    state.total_weight = total_weight
                    state.nreceptacles = nreceptacles
                    state.total = response.data.total
                    return state
                })
                window.setTimeout(this.progress, 100)
            }
        })
    }

    beforelist() {

    }

    componentDidMount() {
        super.componentDidMount()
        const opts = {
            //zIndexOffset : 100,
            language : 'fr',
            autoclose : true
        }
        const dp = $(this.refs.datepicker).datepicker(opts)
        const dp_to = $(this.refs.datepicker_to).datepicker(opts)
        dp.on("changeDate", ()=>{
            if(this.state.datefilter!='date')
                return

            const date = moment(dp.datepicker('getDate')).format('YYYY-MM-DD')
            if(this.pxhr)
                this.pxhr.abort()
            this.setState(state=>{
                state.filter.prepared_at = date
                state.filter.receptacle_id = ''
                state.filter.document_number = ''
                state.filter.lta_number = ''
                state.date = date
                state.data = []
                state.total = 0
                return state
            })
            this.urls = []
            this.data.s.prepared_at = date
            delete this.data.s.prepared_at_year
            delete this.data.s.receptacle_id
            delete this.data.s.document_number
            delete this.data.s.lta_number
            $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.page = response.data.current_page
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
                        state.total = response.data.total
                        return state
                    })
                    window.setTimeout(this.progress, 1)
                }
            })
        });
        dp_to.on("changeDate", ()=>{
            if(this.state.datefilter!='date')
                return

            const date = moment(dp_to.datepicker('getDate')).format('YYYY-MM-DD')
            if(this.pxhr)
                this.pxhr.abort()
            this.setState(state=>{
                state.filter.to_prepared_at = date
                state.filter.receptacle_id = ''
                state.filter.document_number = ''
                state.filter.lta_number = ''
                state.date = date
                state.data = []
                state.total = 0
                return state
            })
            this.urls = []
            this.data.s.to_prepared_at = date
            delete this.data.s.prepared_at_year
            delete this.data.s.receptacle_id
            delete this.data.s.document_number
            delete this.data.s.lta_number
            $.ajax({
                isPagination : true,
                url : this.endpoint,
                data : this.data,
                success : response=>{
                    this.setState(state=>{
                        state.data = response.data.data,
                        state.last_page = response.data.last_page
                        state.page = response.data.current_page
                        let total_weight = 0
                        let nreceptacles = 0
                        state.data.map(item=>{
                            total_weight += parseFloat(item.nsetup.wreceptacles)
                            nreceptacles += parseInt(item.nsetup.nreceptacles)
                        })
                        state.total_weight = total_weight
                        state.nreceptacles = nreceptacles
                        state.total = response.data.total
                        return state
                    })
                    window.setTimeout(this.progress, 1)
                }
            })
        });
        $(this.refs.frm_receptacles).ajaxForm()
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='precon' && storeState.row) {
                this.setState(state=>{
                    state.data = state.data.filter(it=>(it.nsetup.document_number!=storeState.row.nsetup.document_number || (it.nsetup.document_number==storeState.row.nsetup.document_number && it.id==storeState.row.id)))
                    let total_weight=0;
                    let nreceptacles = 0
                    state.data.map(item=>{
                        total_weight += parseFloat(item.nsetup.wreceptacles)
                        nreceptacles += parseInt(item.nsetup.nreceptacles)
                    })
                    state.total_weight = total_weight
                    state.nreceptacles = nreceptacles
                    return state
                })
            }
        })
    }

    onProgress(state) {
        let total_weight=0;
        let nreceptacles=0;
        state.data.map(item=>{
            total_weight += parseFloat(item.nsetup.wreceptacles)
            nreceptacles += parseInt(item.nsetup.nreceptacles)
        })
        state.total_weight = total_weight
        state.nreceptacles = nreceptacles
    }

    documentSearch() {
        const field = 'document_number'
        const value = this.refs.document_number.value
        if(this.pxhr)
            this.pxhr.abort()
        this.setState(state=>{
            state.filter.document_number = value
            state.data = []
            state.total = 0
            return state
        })
        this.urls = []
        this.data.s[field] = value
        delete this.data.s.prepared_at
        delete this.data.s.to_prepared_at
        delete this.data.s.prepared_at_year
        delete this.data.s.handover_origin_location
        delete this.data.s.handover_destination_location
        if(this.request) {
            this.request.abort()
        }
        this.request = $.ajax({
            isPagination : true,
            url : this.endpoint,
            data : this.data,
            success : response=>{
                this.setState({
                    data : response.data.data,
                    last_page : response.data.last_page,
                    page : response.data.current_page,
                    total : response.data.total
                })
                window.setTimeout(this.progress, 100)
            }
        })
    }

    receptacleSearch() {
        const field = 'receptacle_id'
        const value = this.refs.receptacle_id.value
        if(this.pxhr)
            this.pxhr.abort()
        this.setState(state=>{
            state.filter.receptacle_id = value
            state.data = []
            state.total = 0
            return state
        })
        this.urls = []
        this.data.s[field] = value
        delete this.data.s.prepared_at
        delete this.data.s.to_prepared_at
        delete this.data.s.prepared_at_year
        delete this.data.s.handover_origin_location
        delete this.data.s.handover_destination_location
        if(this.request) {
            this.request.abort()
        }
        this.request = $.ajax({
            isPagination : true,
            url : this.endpoint,
            data : this.data,
            success : response=>{
                this.setState({
                    data : response.data.data,
                    last_page : response.data.last_page,
                    page : response.data.current_page,
                    total : response.data.total
                })
                window.setTimeout(this.progress, 100)
            }
        })
    }

    escales(precon) {
        let k = precon.nsetup.transports.length
        switch(k) {
            case 1:
                return <div>{trans('Direct')}</div>
            case 2:
                return <a className="btn btn-turquoise cursor-default d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${precon.id}`).modal('show')
                }}><span className="font-12">{trans('1 escale')}</span><i className="icon-pencil"></i></a>
            case 3:
                return <a className="btn btn-turquoise cursor-default d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${precon.id}`).modal('show')
                }}><span className="font-12">{trans(':n escales', {n:2})}</span><i className="icon-pencil"></i></a>
            
        }
    }

    reception(precon) {
        return <a className="btn btn-blue cursor-default d-flex text-white justify-content-center pr-1 align-items-center" href="#" style={{height:34}}>MRD</a>
    }

	departure(precon) {
        return <a className={`btn btn-danger cursor-default d-flex ${true?'justify-content-center':'justify-content-between'} pr-1 align-items-center`} href="#" style={{height:34}}><span></span><span>NT</span>{true?null:<i className="icon-pencil"></i>}</a>
    }

    arrival(precon) {
        return <a className={`btn btn-danger cursor-default d-flex ${true?'justify-content-center':'justify-content-between'} pr-1 align-items-center`} href="#" style={{height:34}}><span></span><span>NT</span>{true?null:<i className="icon-pencil"></i>}</a>   
    }

    deliver(precon) {
        return <a className={`btn btn-danger cursor-default d-flex ${true?'justify-content-center':'justify-content-between'} pr-1 align-items-center`} href="#" style={{height:34}}><span>NT</span>{true?null:<i className="icon-pencil"></i>}</a>
    }

    table() {
        return <table className="table table-bordered table-hover table-striped table-liste table-precon" cellSpacing="0"
        id="recipientTable">
            <thead>
				<tr>
					<th colSpan="14" className="border-left-0 border-top-0 p-0">
						<div className="w-50 d-flex">
							<label className="btn btn-primary mx-2" data-name="precon" data-dropzone-action="/upload_precon" data-any-file="true">{trans('Importer un precon')}</label>
							<button className="btn btn-secondary mb-2" type="button" onClick={this.cover}>{trans('Générer les COVER')}</button>
						</div>
					</th>
					<th colSpan="4">FSU</th>
				</tr>
                <tr>
                    <th>{trans('Emis le')}</th>
                    <th>{trans('à')}</th>
                    <th colSpan="2">{trans("N° d'expédition")}</th>
                    <th>{trans('Cat.')}</th>
                    <th>{trans('Clas.')}</th>
                    <th>{trans('Qté')}</th>
                    <th>{trans('Poids')}</th>
                    <th>{trans('Orig.')}</th>
                    <th>{trans('Escale')}</th>
                    <th>{trans('Dest.')}</th>
                    <th>{trans('Nº de vol')}</th>
                    <th>{trans('Départ le')}</th>
                    <th>{trans('à')}</th>
                    <th className="precon100">{trans('RCS')}</th>
					<th className="precon100">{trans('DEP')}</th>
					<th className="precon100">{trans('ARR')}</th>
					<th className="precon100">{trans('DLV')}</th>
                    {this.afterTh()}
                </tr>
            </thead>
            <tbody>
                {this.state.data.groupBy(it=>`${this.cast(it, 'nsetup.transports.0.arrival_location.id')}//${this.cast(it, 'nsetup.transports.0.carrier_code')}${this.cast(it, 'nsetup.transports.0.conveyence_reference')}//${moment(this.cast(it, 'nsetup.transports.0.departure_datetime_lt')).format('YYYY-MM-DD')}//${this.cast(it, 'nsetup.transports.0.departure_location.id')}`).map((group, groupIndex)=>{
					let wreceptacles = 0
					let nreceptacles = 0
					group.map(item=>{
						wreceptacles += parseFloat(item.nsetup.wreceptacles)
						nreceptacles += parseInt(item.nsetup.nreceptacles)
					})
					return group.map((item, index)=><Item bg={`bg${groupIndex%2?1:2}`} wreceptacles={wreceptacles} nreceptacles={nreceptacles} data={item} pindex={index} nrows={group.length} key={`precon-${item.id}`} group={`${this.cast(item, 'nsetup.transports.0.arrival_location.id')}//${this.cast(item, 'nsetup.transports.0.carrier_code')}${this.cast(item, 'nsetup.transports.0.conveyence_reference')}//${moment(this.cast(item, 'nsetup.transports.0.departure_datetime_lt')).format('YYYY-MM-DD')}//${this.cast(item, 'nsetup.transports.0.departure_location.id')}`}/>)
				})}
            </tbody>
            <tfoot className={(this.progressive && this.state.page<this.state.last_page)?'':'d-none'}>
                <tr>
                    <td ref="overscroller" colSpan="14" className={`position-relative py-3`}><i className="spinner"></i></td>
                </tr>
            </tfoot>
        </table>
    }

    render() {
        let years = []
        for(var i=moment().year();i>=2019;i--){
             years.push(i)                                   
        }
        let pagination = <React.Fragment>
            <a href="#" onClick={this.toFirst} className={this.state.page===1?'disabled':''}><i className="fa fa-angle-double-left"></i></a>
            <a href="#" onClick={this.toPrevious} className={this.state.page===1?'disabled':''}><i className="fa fa-angle-left"></i></a>
            <a href="#" onClick={this.toNext} className={this.state.page===this.state.last_page?'disabled':''}><i className="fa fa-angle-right"></i></a>
            <a href="#" onClick={this.toEnd} className={this.state.page===this.state.last_page?'disabled':''}><i className="fa fa-angle-double-right"></i></a>
        </React.Fragment>

        return <div className="precon-container vol-liste col-md-12">
            <div className="row clearfix align-items-stretch position-relative vol-container">
                <div className="col-12">
                    <div className="topContainer mb-2 d-flex justify-content-between align-items-center">
                        <div className="col-md-12">
                            <div className="align-items-baseline row">
                                <div className={`col-md-3 pr-md-0`}>
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <label className="control-label mr-2">{trans('Origine')}</label>
                                        <select className="form-control" value={this.state.filter.handover_origin_location} onChange={e=>this.onFilter(e, 'handover_origin_location')} ref="origin">
                                            <option value="">{trans('Tous')}</option>
                                            {this.props.data.select_origins.map(handover_origin_location=><option key={`select-handover-origin-location-${handover_origin_location.iata}`} value={handover_origin_location.iata}>{handover_origin_location.iata}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className={`col-md-3 pr-md-0`}>
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <label className="control-label mr-2">{trans('Destination')}</label>
                                        <select className="form-control" value={this.state.filter.handover_destination_location} onChange={e=>this.onFilter(e, 'handover_destination_location')} ref="destination">
                                            <option value="">{trans('Tous')}</option>
                                            {this.props.data.select_destinations.map(handover_destination_location=><option key={`select-handover-destination-location-${handover_destination_location.iata}`} value={handover_destination_location.iata}>{handover_destination_location.iata}</option>)}
                                        </select>
                                        <div className="m-auto">
                                            <i className="fa fa-2x mx-2 fa-caret-right"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 border rounded p-2">
                                    <div className="d-flex">
                                        <label className="fancy-radio m-auto custom-color-green">
                                            <input name={`date-filter`} type="radio" value="date" onChange={this.handleDateChecked} checked={this.state.datefilter=='date'}/>
                                            <span><i className="mr-0"></i></span>
                                        </label>
                                        <div ref="datepicker" className="input-group date mx-2">
                                            <input type="text" className="form-control" defaultValue={moment(this.state.filter.prepared_at).format("DD/MM/YYYY")}/>
                                            <div className="input-group-append"> 
                                                <button className="btn-primary btn text-light" type="button"><i className="fa fa-calendar-alt"></i></button>
                                            </div>
                                        </div>
                                        <div className="form-group m-auto">
                                            <label className="control-label mx-2 mb-0">{trans('au')}</label>
                                        </div>
                                        <div ref="datepicker_to" className="input-group date mx-2">
                                            <input type="text" className="form-control" value={moment(this.state.filter.to_prepared_at).format("DD/MM/YYYY")} onChange={this.handleToPreparedAtChange}/>
                                            <div className="input-group-append"> 
                                                <button className="btn-primary btn text-light" type="button"><i className="fa fa-calendar-alt"></i></button>
                                            </div>
                                        </div>
                                        <div className="form-group m-auto">
                                            <label className="control-label ml-5 mr-2 mb-0">{trans('ou')}</label>
                                        </div>
                                        <label className="fancy-radio m-auto custom-color-green mx-2">
                                            <input name={`date-filter`} type="radio" value="year" onChange={this.handleYearChecked} checked={this.state.datefilter=='year'}/>
                                            <span><i className="mr-0"></i></span>
                                        </label>
                                        <select onChange={this.handleYearChange} className="form-control mx-2">
                                            {years.map(year=><option key={year} value={year}>{year}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="align-items-baseline row">
                                <div className="col-md-3">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="document_number" type="search" placeholder={trans("Nº d'expédition")} value={this.state.filter.document_number} className="form-control" onChange={e=>{
                                                const value = e.target.value
                                                this.setState(state=>{
                                                    state.filter.document_number = value
                                                    return state
                                                })
                                            }}/>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button" onClick={this.documentSearch}>{trans('OK')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="receptacle_id" placeholder={trans("Nº de récipient")} type="search" value={this.state.filter.receptacle_id} className="form-control" onChange={e=>{
                                                const value = e.target.value
                                                this.setState(state=>{
                                                    return state.filter.receptacle_id = value
                                                })
                                            }}/>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button" onClick={this.receptacleSearch}>{trans('OK')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            	<div className="col-md-1">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <select className="form-control" value={this.state.filter.airline_id} onChange={e=>this.onFilter(e, 'airline_id')}>
                                            <option value="">{trans('Tous')}</option>
                                            {this.props.data.airlines.map(airline=><option key={`select-airline-${airline.id}`} value={airline.id}>{airline.iata_code}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-2">
									{this.state.airline?<React.Fragment>
										{trans('Il vous reste :n', {n:''})} <strong className="font-18 text-orange">{this.models('state.airline.navailable_ltas')}</strong>
									</React.Fragment>:null}
                                </div>
                                <div className="col-md-3">
                                    <div className="align-items-baseline d-flex form-group ml-2">
                                        <div className="input-group">
                                            <input ref="lta_number" type="search" placeholder={trans("Rechercher un Nº LTA")} value={this.state.filter.lta_number} className={`form-control ${this.state.errors.indexOf('lta_number')>=0?'parsley-error':''}`} onChange={e=>{
                                                const value = e.target.value
                                                this.setState(state=>{
                                                    state.errors = []
                                                    state.filter.lta_number = value
                                                    return state
                                                })
                                            }}/>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button" onClick={this.ltaSearch}>{trans('OK')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="navPager d-flex align-items-center justify-content-end">
                            {this.nopaginate?null:pagination}
                        </div>
                    </div>
                    <div className="card overflowhidden">
                        <div className="body">
                            <div className="row m-0 justify-content-between">
                                <div className="filter d-flex align-items-center flex-wrap">
                                    <div>
                                        <span className="mr-4">{trans('Nombre de Precons')} : <strong>{this.state.total}</strong></span>
                                        <span className="mr-4">{trans('Poids de Precons')} : <strong>{numeral(this.state.total_weight).format('0,0.00')}</strong></span>
                                        <span className="mr-4">{trans('Nombre de récipient')} : <strong>{numeral(this.state.nreceptacles).format('0,0')}</strong></span>
                                    </div>
                                    {this.nopaginate?null:<div className="form-group d-flex align-items-center justify-content-start flex-nowrap" style={{width:220}}>
                                        <label className="control-label">{trans('Voir')}</label>
                                        <select className="form-control" value={this.state.filter.perpage} onChange={e=>this.onFilter(e, 'perpage')}>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                        <label>{trans('par page')}</label>
                                    </div>}
                                </div>
                                {this.beforelist()}
                            </div>
                            <div className="card-bureau no-border p-0">
                                <div className="table-responsive">
                                    {this.table()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="navPager d-flex align-items-center justify-content-end">
                            {this.nopaginate?null:pagination}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

Modelizer(List)

class NavigableList extends List
{
    constructor(props) {
        super(props)
        this.state.data = this.props.data.data.data
        this.state.total = this.props.data.data.total
        let total_weight = 0
        let nreceptacles = 0
        this.state.data.map(item=>{
            nreceptacles += parseInt(item.nsetup.nreceptacles)
            total_weight += parseFloat(item.nsetup.wreceptacles)
        })
        this.state.total_weight = total_weight
        this.state.nreceptacles = nreceptacles
        this.state.last_page = this.props.data.data.last_page
        this.state.page = this.props.data.data.current_page ? this.props.data.data.current_page : 1
    }
}

export default NavigableList;