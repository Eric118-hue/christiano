import React, {Component} from 'react';
import moment from 'moment-timezone';
import Ry from '../../Core/Ry';
import Countdown from './Countdown';
import trans from '../../../../app/translations';
import Modelizer from '../../Core/Modelizer';
import Localtime from './Localtime';
import {Route} from './Status';
import {Popup, PopupBody, PopupHeader, PopupFooter, Datepicker} from '../../../bs/bootstrap';
import $ from 'jquery';

class DeliveryDate extends Component
{
    constructor(props) {
        super(props)
        const now = moment()
        this.state = {
            datetime : now.format('YYYY-MM-DD'),
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
        this.checkbtn = this.checkbtn.bind(this)
    }

    checkbtn(consignment_event) {
        let mrd = null
        const isDisabled = this.cast(this.props.data, 'statuses.reception', 82)!=74 && this.cast(this.props.data, 'statuses.reception', 82)!=43
        const disabled = (isDisabled && !this.models('props.data.statuses.mrd'))?{disabled:true}:{}
        if(this.models('props.data.statuses.damd', false) && this.models('props.data.statuses.delivery', false) && consignment_event.code==21 && this.cast(this.models('props.data.resdits', []).find(it=>it.consignment_event_code==21), 'nsetup.mrd', 1)==this.models('props.data.statuses.damd', 2)) {
            mrd = <div className="btn btn-xs btn-theme text-white">AMD{this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mrd')==this.models('props.data.statuses.damd', 2))?<React.Fragment> {moment(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mrd')==this.models('props.data.statuses.damd', 2)).resdit.nsetup.mrd.handover_date_time, 'YYYYMMDDTHH:mm+-HH:mm').format('DD/MM')}</React.Fragment>:null}</div>
        }
        else if(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.fsu') && it.consignment_event_code==21 && consignment_event.code==21)) {
            mrd = <div className="btn btn-xs btn-blue text-white">FSU {moment(this.cast(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.fsu')), 'created_at')).format('DD/MM')}</div>
        }
        else if(this.models('props.data.statuses.mrd', false) && this.models('props.data.statuses.delivery', false) && consignment_event.code==21 && this.cast(this.models('props.data.resdits', []).find(it=>it.consignment_event_code==21), 'nsetup.mrd', 1)==this.models('props.data.statuses.mrd', 2)) {
            mrd = <div className="btn btn-xs btn-primary">MRD{this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mrd')==this.models('props.data.statuses.mrd', 2))?<React.Fragment> {moment(this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.mrd')==this.models('props.data.statuses.mrd', 2)).resdit.nsetup.mrd.handover_date_time, 'YYYYMMDDTHH:mm+-HH:mm').format('DD/MM')}</React.Fragment>:null}</div>
        }
        else if(this.models('props.data.statuses.iftsta', false) && this.models('props.data.statuses.delivery', false) && consignment_event.code==21 && this.cast(this.models('props.data.resdits', []).find(it=>it.consignment_event_code==21), 'nsetup.iftsta', 1)==this.models('props.data.statuses.iftsta', 2)) {
            mrd = <div className="btn btn-xs btn-army">IFTSTA{this.models('props.data.resdits', []).find(it=>this.cast(it, 'nsetup.iftsta')==this.models('props.data.statuses.iftsta', 2))?<React.Fragment> {moment(this.models('props.data.resdits', []).find(it=>it.nsetup.iftsta==this.models('props.data.statuses.iftsta', 2)).resdit.nsetup.localtime).format('DD/MM')}</React.Fragment>:null}</div>
        }
        else {
            mrd = <label className="fancy-radio m-auto custom-color-green">
                <input {...disabled} name={`receptacles[${this.props.data.id}][delivery_status]`} type="radio" value={consignment_event.code} checked={!disabled.disabled && this.models('props.data.statuses.delivery', -100)==consignment_event.code} onChange={()=>this.props.handleReceptacleStatusChange(consignment_event)}/>
                <span><i className="mr-0"></i></span>
            </label>
        }
        return mrd
    }

    render() {
        let classNames = []
        const isDisabled = this.cast(this.props.data, 'statuses.reception', 82)!=74 && this.cast(this.props.data, 'statuses.reception', 82)!=43
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
        {this.props.consignmentEvents.map(consignment_event=><td key={`consignment_event-check-${this.props.data.id}-${consignment_event.code}`} className="text-center">
            {this.checkbtn(consignment_event)}
        </td>)}
    </tr>
    }
}

Modelizer(ReceptacleLine)

class Delivery extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            receptacles : this.props.data.receptacles,
            updated_resdits : this.props.data.updated_resdits,
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
            if(storeState.type=='resdit' && storeState.delivery && storeState.delivery.length>0 && storeState.delivery[0].cardit_id==this.props.data.id) {
                this.setState(state => {
                    state.updated_resdits.delivery = storeState.delivery
                    state.dialogs.push({})
                    return state
                })
            }
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

    handleAllReceptacleStatusChange(status) {
        this.setState(state=>{
            state.receptacles.map(item=>{
                if(!item.statuses) {
                    item.statuses = {}
                }
                item.statuses.delivery = status
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
        const isDisabled = this.models('state.updated_resdits.reception', []).filter(it=>it.event=='reception').length==0
        let files = null
        let files_tablet = null
        let resdit_codes = []
        this.models('state.updated_resdits.delivery', []).map(delivery=>resdit_codes.push(delivery.files.join(', ')))
        resdit_codes = resdit_codes.join(', ')
        if(this.state.updated_resdits.delivery) {
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
                    {this.models('state.updated_resdits.delivery', []).length>0?null:<div className="col-md-4">
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
                    {this.models('state.updated_resdits.delivery', []).length>0?null:<React.Fragment>
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
                    <form ref={`frm_cardit`} name={`frm_cardit${this.props.data.id}`} action={`/delivery`} method="post">
                        {this.state.dialogs.map((v,k)=><Ry key={`ajaxform-${k}`} title="ajaxform"/>)}
                        <input type="hidden" name="ry"/>
                        <input type="hidden" name="id" value={this.props.data.id}/>
                        <input type="hidden" name="consignment_event" value="delivery"/>
                        <table className="table tableRecap">
                            <thead>
                                <tr>
                                    <th rowSpan="2" colSpan="5"
                                        className="colorVert noBor pl-0 text-left text-wrap">
                                        {(this.models('state.updated_resdits.delivery', []).length>0)?<React.Fragment>
                                            {trans('Livraison validée le :date à :time par :author - RESDIT :resdits envoyé(s)', {
                                                resdits : resdit_codes,
                                                date : moment.utc(this.cast(this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1], 'nsetup.real_localtime', this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1].localtime)).format('DD/MM/YYYY'),
                                                time : moment.utc(this.cast(this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1], 'nsetup.real_localtime', this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1].localtime)).format('HH:mm'),
                                                author : `${this.cast(this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1], 'author.profile.gender_label')} ${this.cast(this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1], 'author.profile.official', 'AIRMAILDATA')}`
                                            })}{moment.utc(this.cast(this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1], 'nsetup.localtime', this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1].localtime)).format('YYYY-MM-DD HH:mm')!=moment.utc(this.cast(this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1], 'nsetup.real_localtime', this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1].localtime)).format('YYYY-MM-DD HH:mm')?<React.Fragment> - <span className="text-danger">{trans('Horaire de livraison modifié : :datetime', {datetime:moment.utc(this.state.updated_resdits.delivery[this.state.updated_resdits.delivery.length-1].nsetup.localtime).format('DD/MM/YYYY HH:mm')})}</span></React.Fragment>:null}
                                        </React.Fragment>:null}    
                                    </th>
                                    <th colSpan={this.props.consignmentEvents.length} className="thTop">{trans('Livraison')}</th>
                                </tr>
                                <tr className="thLeft">
                                    {this.props.consignmentEvents.map(consignment_event=><th key={`consignment_event-${consignment_event.code}`}>{trans(consignment_event.interpretation)}</th>)}
                                </tr>
                                <tr>
                                    <th>{trans('Numéro du récipient')}</th>
                                    <th>{trans('Flag')} <i className="icon-info"></i></th>
                                    <th>{trans('Container Journey ID')}</th>
                                    <th>{trans('Type de récipient')}</th>
                                    <th>{trans('Poids (Kg)')}</th>
                                    {this.props.consignmentEvents.map(consignment_event=><th key={`consignment_event-checkall-${consignment_event.code}`}>
                                        <label className="fancy-radio custom-color-green m-auto">
                                            <input type="radio" name="checkall[delivery_status]" onChange={()=>this.handleAllReceptacleStatusChange(consignment_event.code)}/>
                                            <span><i className="m-0"></i></span>
                                        </label>
                                    </th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.receptacles.map((receptacle, index)=><ReceptacleLine key={`content-delivery-${receptacle.id}`} messageFunction={this.models('props.data.nsetup.message_function')} handleReceptacleStatusChange={consignment_event=>this.handleReceptacleStatusChange(receptacle, consignment_event.code)} data={receptacle} consignmentEvents={this.props.consignmentEvents}/>)}
                                <tr>
                                    <td colSpan="5" className="border-right-0 noBg"></td>
                                    <td colSpan={this.props.consignmentEvents.length} className="border-left-0 border-right-0 p-0">
                                        {(isDisabled || this.models('state.updated_resdits.delivery', []).length>0 || this.props.readOnly)?null:<button type="button" onClick={this.handleSubmit} className="btn btn-orange rounded-0" {...btndisabled}>{trans('STEP')} {this.props.data.nsetup.transports.length*3+2} :
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
                                <DeliveryDate ref={`schedule-${this.props.consignmentEvent}`} key={`schedule-${this.props.consignmentEvent}`} onChange={()=>this.setState({dtchanged:true})} consignmentEvent={this.props.consignmentEvent}/>
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