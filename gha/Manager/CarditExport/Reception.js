import React, {Component} from 'react';
import moment from 'moment';
import Ry from 'ryvendor/Ry/Core/Ry';
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
        this.isMld = this.models('props.data.nsetup.poc.value')
        this.scan = this.scan.bind(this)
    }

    scan(consignment_event) {
        const disableMrd = (this.isMld && !this.props.data.nsetup.reference_receptacle_id) ? {disabled:true} : {}
        let resdit = null
        if(this.isMld && (consignment_event.code==74 || consignment_event.code==43)) {
            resdit = <div className="btn btn-xs btn-rose">MLD {moment(this.models('props.data.nsetup.poc.updated_at')).format('DD/MM')}</div>
        }
        else {
            resdit = <label className="fancy-radio m-auto custom-color-green">
                <input name={`receptacles[${this.props.data.id}][nsetup][poc][value]`} type="radio" {...disableMrd} value={consignment_event.code} checked={this.models('props.data.nsetup.poc.value')==consignment_event.code} onChange={()=>this.props.handleReceptacleStatusChange(consignment_event.code)}/>
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
        <td>{this.props.data.nsetup.nesting}</td>
        <td>{this.models('props.data.nsetup.type.interpretation', '--')}</td>
        <td>{this.props.messageFunction==1?0:this.props.data.nsetup.weight}</td>
        {this.props.consignmentEvents.map(consignment_event=><td key={`consignment_event-check-${this.props.data.id}-${consignment_event.code}`} className="text-center">
        {this.scan(consignment_event)}
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
            dialogs : [{}],
            dirty: false
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
            if(storeState.type=='scan' && storeState.reception && storeState.reception.length>0 && storeState.reception[0].cardit_id==this.props.data.id) {
                this.setState(state => {
                    state.dialogs.push({})
                    return state
                })
            }
            if(storeState.type==='mld_sent') {
                setTimeout(()=>{
                    document.location.reload()
                }, 1000)
            }
        })
    }

    handleReceptacleStatusChange(receptacle, status) {
        this.setState(state=>{
            const _receptacle = state.receptacles.find(it=>it.id == receptacle.id)
            state.dirty = true
            _receptacle.nsetup.poc = {
                value : status
            }
            return state
        })
    }

    handleAllReceptacleStatusChange(status) {
        this.setState(state=>{
            state.dirty = true
            state.receptacles.map(it=>{
                it.nsetup.poc = {
                    value : status
                }
            })
            return state
        })
    }

    render() {
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
                        
                    </div>
                </div>
            </div>
            <div className="col-xl-3 d-md-none d-xl-block">
                <div className="blockTemps">
                    <ul className="info">
                        <li>
                            {this.models('props.data.nsetup.consignment_category.code')=='A'?<a href={trans('/cn38?id=:id', {id:this.props.data.id})} target="_blank" className="btn btn-beige w-25 text-light">CN 38</a>
                            :(this.models('props.data.nsetup.consignment_category.code')=='B' && mailclass_concat!='T')?<a href={trans('/cn41?id=:id', {id:this.props.data.id})} target="_blank" className="btn btn-beige w-25 text-light">CN 41</a>
                            :(this.models('props.data.nsetup.consignment_category.code')=='B' && mailclass_concat=='T')?<button href={trans('/cn41?id=:id', {id:this.props.data.id})} type="button" className="btn btn-danger w-25 text-light">CN 47</button>
                            :null}
                            {this.models('props.data.nsetup.csd', []).length>0?<a href={`#dialog/csd?cardit_id=${this.models('props.data.id')}`} target="_blank" className="btn btn-beige w-25 text-light ml-2">CSD</a>:null}
                            {this.models('props.data.receptacles', []).filter(it=>this.cast(it, 'nsetup.poc.mld_type')=='CV' && this.cast(it, 'nsetup.poc.filename')).length>0?<a href={`#dialog/mlds?filename=${this.models('props.data.receptacles', []).find(it=>this.cast(it, 'nsetup.poc.mld_type')=='CV').nsetup.poc.filename}`} target="_blank" className="btn btn-beige w-25 text-light ml-2">MLD</a>:null}
                        </li>
                        
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
                                    <th rowSpan="2" colSpan="6"
                                        className="colorVert noBor pl-0 text-left text-wrap">
                                            
                                    </th>
                                    <th colSpan={this.props.consignmentEvents.length} className="thTop">{trans('POC')}</th>
                                </tr>
                                <tr className="thLeft">
                                    {this.props.consignmentEvents.map(consignment_event=><th key={`consignment_event-${consignment_event.code}`}>{trans(consignment_event.trans_interpretation)}</th>)}
                                </tr>
                                <tr>
                                    <th width="300">{trans('Numéro du récipient')}</th>
                                    <th>{trans('Type')}</th>
                                    <th width="250">{trans('ULD IN')}</th>
                                    <th width="250">{trans('ULD OUT')}</th>
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
                                    <td colSpan="6" className="border-right-0 noBg"></td>
                                    <td colSpan={this.props.consignmentEvents.length} className="border-left-0 border-right-0 p-0">
                                        {this.state.dirty?<button className="btn btn-orange rounded-0">{trans('Valider')}</button>:null}
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