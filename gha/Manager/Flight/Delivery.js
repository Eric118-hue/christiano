import React, {Component} from 'react';
import moment from 'moment-timezone';
import Ry from 'ryvendor/Ry/Core/Ry';
import trans from 'ryapp/translations';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import Localtime from 'ryvendor/Ry/Airline/Cardit/Localtime';
import {Popup, PopupBody, PopupHeader, PopupFooter, Datepicker} from 'ryvendor/bs/bootstrap';
import $ from 'jquery';
import numeral from 'numeral';

class DeliveryDate extends Component
{
    constructor(props) {
        super(props)
        const now = moment(this.props.defaultValue)
        this.state = {
            datetime :  now.format('YYYY-MM-DD'),
            hour : now.format('HHmm')
        }
        this.handleChangeDate = this.handleChangeDate.bind(this)
        this.handleChangeHour = this.handleChangeHour.bind(this)
    }

    handleChangeDate(value) {
        this.setState(state=>{
            let t = moment(value)
            t.hour(state.hour.substr(0,2))
            t.minute(state.hour.substr(2,2))
            state.datetime = t.format('YYYY-MM-DD HH:mm:ss')
            return state
        }, ()=>this.props.onChange())
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
        }, ()=>this.props.onChange())
    }

    render() {
        return <div className="row">
            <div className="form-group col-md-8">
                <label className="control-label">{trans('Date')}</label>
                <Datepicker name="tmp_delivery_date" defaultValue={this.state.datetime} className="transport-datepicker" inputProps={{required:true}} onChange={this.handleChangeDate}/>
            </div>
            <div className="form-group col-md-4">
                <label className="control-label">{trans("Heure")}</label>
                <input type="text" name="tmp_delivery_hour" className="form-control bs-default" value={this.state.hour} onChange={this.handleChangeHour} required/>
            </div>
            <input type="hidden" name="delivery_date" value={this.state.datetime}/>
            <input type="hidden" name="delivery_hour" value={this.state.hour}/>
        </div>
    }
}

class ReceptacleLine extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            assignation_conveyence_id : this.models('props.defaultConveyence.id'),
            resdits : this.models('props.data.resdits', []),
			statuses : this.models('props.data.statuses', {})
        }
        this.deliveryControl = this.deliveryControl.bind(this)
        this.handleDeliveryChange = this.handleDeliveryChange.bind(this)
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

	handleDeliveryChange(event) {
		const checked = event.target.checked
        this.setState(state=>{
			if(checked) {
				state.statuses.delivery = 21
			}
			else {
				delete state.statuses.delivery
			}
			return state
        })
	}

    componentDidMount() {
        this.unsubscribe = this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='resdit' && storeState.event=='delivery' && storeState.cardit_id==this.props.pkey) {
                this.setState(state=>{
                    state.resdits.push(storeState)
                    return state
                })
            }
        })
    }

    deliveryControl() {
        if(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mld'))) {
            return <div className="fancy-checkbox">
                <label><input type="checkbox" name={`delivery_receptacles[${this.props.data.id}]`} value={true} checked={(this.models('state.statuses.delivery') || this.models('props.data.statuses.delivery'))?true:false} onChange={this.handleDeliveryChange}/><span></span></label>
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
        <td key={`select-delivery`} className="text-center">
            {this.deliveryControl()}
        </td>
    </tr>
    }
}

Modelizer(ReceptacleLine)

class Delivery extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            files : [],
			allChecked : false,
            receptacles : this.props.data.receptacles,
            updated_resdits : this.props.data.updated_resdits,
			resdits : this.props.data.resdits,
            dialogs : [{}],
            dtchanged : false
        }
        this.handleReceptacleStatusChange = this.handleReceptacleStatusChange.bind(this)
        this.handleAllReceptacleStatusChange = this.handleAllReceptacleStatusChange.bind(this)
        this.hrefs = this.hrefs.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.mrdhrefs = this.mrdhrefs.bind(this)
        this.confirm = this.confirm.bind(this)
    }

    confirm() {
        $(this.refs.frm_cardit).submit()
        $(`#schedule-delivery-${this.props.data.id}`).modal('hide')
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

    handleReceptacleStatusChange(receptacle, status) {
        this.setState(state=>{
            state.updated_resdits.delivery = []
            let found_receptacle = state.receptacles.find(item=>item.id==receptacle.id)
            if(found_receptacle) {
                if(!found_receptacle.statuses) {
                    found_receptacle.statuses = {}
                }
                found_receptacle.statuses.delivery = status
            } 
            return state
        })
    }

    handleAllReceptacleStatusChange(event) {
		const checked = event.target.checked
        this.setState(state=>{
			state.allChecked = !state.allChecked
            state.receptacles.map(item=>{
                if(!item.statuses) {
                    item.statuses = {}
                }
				if(checked)
                	item.statuses.delivery = 21
				else
					delete item.statuses.delivery
            })
            return state
        })
    }

    handleSubmit() {
        this.setState({
            dtchanged : false
        }, ()=>$(`#schedule-delivery-${this.props.data.id}`).modal('show'))
    }

    render() {
        const isDisabled = false
		let isDone = this.models('state.updated_resdits.delivery')
        let files = null
        let files_tablet = null
        let resdit_codes = []
		let done = null
        let done_head = ''
		if(isDone && this.state.resdit_files.length>0) {
            switch(this.props.consignmentEvent) {
                case 'delivery':
                    done_head = trans('Livraison validée le :date à :time par :author', {
                        date : moment.utc(isDone.localtime).format('DD/MM/YYYY'),
                        time : moment.utc(isDone.localtime).format('HH:mm'),
                        author : `${this.cast(isDone, 'author.profile.gender_label')} ${this.cast(isDone, 'author.profile.official')}`
                    })
                    done_resdits = []
                    this.state.flights.map((flight, index)=>{
                        let transport = this.props.data.conveyence
                        if(this.models('props.data.conveyence.arrival_datetime_lt', false) && this.models('props.data.conveyence.arrival_datetime_lt', false)!=transport.arrival_datetime_lt) {
                            done_resdits.push(trans('<br/>RESDIT :resdit_files envoyé - Vol :flights :original_flight_datetime - <span class="text-danger">Horaire modifié : :flight_datetime</span>', {
                                resdit_files : this.state.resdit_files[index],
                                flights : flight,
                                original_flight_datetime : moment(transport.arrival_datetime_lt).format('DD/MM/YYYY [à] HH:mm'),
                                flight_datetime : moment(this.models('props.data.conveyence.arrival_datetime_lt', transport.arrival_datetime_lt)).format('DD/MM/YYYY [à] HH:mm')
                            }))
                        }
                        else {
                            done_resdits.push(trans('<br/>RESDIT :resdit_files envoyé - Vol :flights :flight_datetime', {
                                resdit_files : this.state.resdit_files[index],
                                flights : flight,
                                flight_datetime : moment(this.models('props.data.conveyence.arrival_datetime_lt', transport.arrival_datetime_lt)).format('DD/MM/YYYY [à] HH:mm')
                            }))
                        }
                    })
                    done = done_head + done_resdits.join('') + '<br/>' + trans('Départ :airport (:iata)', {
                        airport : this.models('props.data.conveyence.arrival_location.name'),
                        iata : this.models('props.data.conveyence.arrival_location.iata')
                    })
                    break;
            }
        }
        this.models('state.updated_resdits.delivery', []).map(delivery=>resdit_codes.push(delivery.files.join(', ')))
        resdit_codes = resdit_codes.join(', ')
        if(this.models("state.updated_resdits.delivery")) {
            files = <div>
                {this.state.updated_resdits.delivery.map(delivery=>delivery.files.filter(it=>it.split('-')[0]).map(file=><div key={`download-${this.props.data.id}-resdit-${file}`}>
                    {this.cast(delivery.nsetup, 'mrd.handover_id')?<React.Fragment>
                        <p className="font-weight-bold mb-0">
                        {this.cast(delivery.nsetup, 'mrd.source')=='appscan'?'AMD':'MRD'} HANDOVER ID : {delivery.nsetup.mrd.handover_id}<br/>
                        {trans('Du :date', {date:delivery.nsetup.mrd.handover_date_time})}
                        </p>
                        <a className="btn btn-info col-md-3 font-10 pt-2 m-2 text-white" {...this.mrdhrefs(delivery.nsetup.mrd)}>{this.cast(delivery.nsetup, 'mrd.source')=='appscan'?'AMD':'MRD'} XML<span className="bg-light d-block font-14 m-2 rounded text-primary" style={{lineHeight:'40px'}}>{delivery.nsetup.mrd.handover_id}</span></a>
                    </React.Fragment>:null}
                    <p className="font-weight-bold mb-0">
                        {trans('RESDIT :consignment_event_code du :date à :hour', {consignment_event_code:file.split('-')[0], date:moment.utc(delivery.localtime).format('DD/MM/YYYY'), hour:moment.utc(delivery.localtime).format('HH[h]mm')})}</p>
                    <a className="btn btn-info font-10 pt-2 m-2 text-white col-md-3" {...this.hrefs(file, delivery.id)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}</span></a>
                </div>))}
            </div>
            files_tablet = <div>
                <div className="row">
                    {this.state.updated_resdits.delivery.map(delivery=>delivery.files.filter(it=>it.split('-')[0]).map(file=><React.Fragment key={`download-${this.props.data.id}-resdit-${file}`}>{this.cast(delivery.nsetup, 'mrd.handover_id')?<a className="btn btn-info col-md-4 font-10 pt-2 m-2 text-white" {...this.mrdhrefs(delivery.nsetup.mrd)}>{this.cast(delivery.nsetup, 'mrd.source')=='appscan'?'AMD':'MRD'} XML<span className="bg-light d-block font-14 m-2 rounded text-primary" style={{lineHeight:'40px'}}>{delivery.nsetup.mrd.handover_id}</span></a>
                    :null}<a key={`download-${this.props.data.id}-resdit-${file}`} className="btn btn-info col-md-4 font-10 pt-2 text-white m-2" {...this.hrefs(file, delivery.id)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}</span></a></React.Fragment>))}
                </div>
            </div> 
        }
        const btndisabled = this.state.receptacles.filter(it=>this.cast(it, 'statuses.delivery')).length>0?{}:{disabled:true}
        let mailclass_concat = Object.keys(this.models('props.data.nsetup.mail_classes', {})).join('')
        if(!mailclass_concat)
            mailclass_concat = this.models('props.data.nsetup.mail_class.code')
        return <div className="row">
            <div className="col-md-12 d-md-block d-xl-none">
                <div className="row text-left text-body">
                    <div className="col-md-4">
                        {files_tablet}
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
	                {this.state.resdits.unique(it=>it.id).groupBy(it=>it.conveyence_id).map((resdits, index)=><div className="row border-bottom" key={`resdit-files-download-${index}`}>{resdits.filter(it=>it.event=='delivery').map(resdit=>resdit.files.map(file=><a key={`download-${resdit.id}-resdit-${file}-${resdit.files.length}`} className="btn btn-info text-white col-md-3 font-10 pt-2 m-2" {...this.hrefs(file, resdit)}>RESDIT<span className="bg-light d-block font-25 m-2 rounded text-primary">{file.split('-')[0]}<br/><small className="font-10 d-block">{file.split('-')[1]}</small><small className="d-block text-dark subfile">{this.cast(resdit, 'cardit.nsetup.document_number')}</small></span><Ry/></a>))}</div>)}
	            </div>
            </div>
            <div className="col-xl-9">
                <div className="table-responsive">
                    <form ref={`frm_cardit`} name={`frm_cardit${this.props.data.id}`} action={`/flight_resdit`} method="post">
                        {this.state.dialogs.map((v,k)=><Ry key={`ajaxform-${k}`} title="ajaxform"/>)}
                        <input type="hidden" name="ry"/>
                        <input type="hidden" name="id" value={this.props.data.id}/>
                        <input type="hidden" name="consignment_event" value="delivery"/>
                        <table className="table tableRecap">
                            <thead>
                                <tr>
                                    <th rowSpan="2" colSpan="3"
                                        className="colorVert noBor pl-0 text-left text-wrap">
                                        {trans('Nombre de récipients')} : {this.state.receptacles.length}
                                    </th>
                                    <th className="thTop">{trans('Livraison')}</th>
                                </tr>
                                <tr className="thLeft">
                                    <th>{trans('Délivré')}</th>
                                </tr>
                                <tr>
                                    <th>{trans('Numéro du récipient')}</th>
                                    <th>{trans('Cardit')}</th>
                                    <th>{trans('AWB')}</th>
                                    <th>
										<div className="fancy-checkbox">
		                                    <label><input type="checkbox" onChange={this.handleAllReceptacleStatusChange} checked={this.state.allChecked}/><span></span></label>
		                                </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.receptacles.map((receptacle, index)=><ReceptacleLine  defaultConveyence={this.props.data.conveyence} store={this.props.store} key={`content-delivery-${receptacle.id}`} handleReceptacleStatusChange={consignment_event=>this.handleReceptacleStatusChange(receptacle, consignment_event.code)} data={receptacle}/>)}
                                <tr>
                                    <td colSpan="3" className="border-bottom-0 border-right-0 noBg"></td>
                                    <td className="border-left-0 border-right-0 p-0">
                                        {(isDisabled || (isDone && !this.state.changed) || (this.props.readOnly && !this.state.changed))?null:<button type="button" onClick={this.handleSubmit} className="btn btn-orange rounded-0" {...btndisabled}>
                                            {trans('Valider')}</button>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Localtime/>
                        <Popup id={`schedule-delivery-${this.props.data.id}`} className="popup-consignment-datetime">
                            <PopupHeader>
                                {trans("Confirmation dates/heures de livraison")}
                            </PopupHeader>
                            <PopupBody>
                                <DeliveryDate defaultValue={this.models('props.data.conveyence.arrival_datetime_lt')} ref={`schedule-${this.props.consignmentEvent}`} key={`schedule-${this.props.consignmentEvent}`} onChange={()=>this.setState({dtchanged:true})} consignmentEvent={this.props.consignmentEvent}/>
                            </PopupBody>
                            <PopupFooter>
                                <button className="btn btn-primary p-2 font-18 text-uppercase" type="button" onClick={this.confirm}>
                                    {trans('Valider')}
                                </button>
                            </PopupFooter>
                        </Popup>
                        <input type="hidden" name="dtchanged" value={this.state.dtchanged?1:0}/>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Delivery);