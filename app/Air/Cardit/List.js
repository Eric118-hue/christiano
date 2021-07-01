import React from 'react';
import List from 'ryvendor/Ry/Airline/Cardit/List';
import Cardit, {FullDetail, StepView} from 'ryvendor/Ry/Airline/Cardit/Item';
import Ry from 'ryvendor/Ry/Core/Ry';
import moment from 'moment';
import {Popup, PopupHeader, PopupBody} from 'ryvendor/bs/bootstrap';
import trans from 'ryapp/translations';
import $ from 'jquery';
import numeral from 'numeral';

class RoadStepView extends StepView
{
    render() {
        return <div className="recipientContainer">
            <div className="d-flex justify-content-center align-items-center stepContainer">
                <div className="asideList">{this.props.data.nsetup.handover_origin_location.iata}</div>
                <div className={`recipientList d-flex flex-column justify-content-between align-items-center ${this.props.step=='reception'?'red':(this.state.resdits.find(item=>{
                        return (item.reception && item.reception.length>0) || item.event=='reception'
                    })?'text-success':'')}`}>
                    <div className="mouse-pointable w-100" onClick={this.props.reception}>
                        <i className="font-50 l2-receipt"></i>
                        <span className="text-capitalize">{trans('Réception')}</span>
                    </div>
                    <i className="fa fa-circle"></i>
                </div>
                <div className={`recipientList d-flex flex-column justify-content-between align-items-center last ${this.props.step=='delivery'?'red':(this.state.resdits.find(item=>{
                        return item.event == 'delivery'
                    })?'text-success':'')}`}>
                    <div className="mouse-pointable w-100" onClick={this.props.delivery}>
                        <i className="font-50 l2-destination"></i>
                        <span className="text-capitalize">{trans('Livraison')}</span>
                    </div>
                    <i className="fa fa-circle"></i>
                </div>
                <div className="asideList asideList2">{this.models('props.data.nsetup.handover_destination_location.iata',this.models('props.data.nsetup.handover_destination_location.cardit'))}</div>
            </div>
        </div>
    }
}

class RoadFullDetail extends FullDetail
{
    getHeadStep() {
        let headStep = null;
        let transport = this.props.data.transports.find(it=>it.pivot.step==this.state.transport_index);
        switch(this.state.step) {
            case 'reception':
                headStep = <div className="centerText">
                    {trans("Réception : récipients au départ de ")} {this.props.data.nsetup.handover_origin_location.country.nom} - {this.props.data.nsetup.handover_origin_location.iata} - {this.props.data.nsetup.handover_origin_location.name}
                </div>
                break;
            case 'delivery':
                headStep = <div className="centerText">
                    {trans("Livraison des récipients à destination de :country_name - :iata - :airport_name", {
                        country_name : this.models('props.data.nsetup.handover_destination_location.country.nom', this.models('props.data.nsetup.handover_destination_location.adresse.ville.country.nom')),
                        iata : this.models('props.data.nsetup.handover_destination_location.iata', this.models('props.data.nsetup.handover_destination_location.cardit')),
                        airport_name : this.props.data.nsetup.handover_destination_location.name
                    })}
                </div>
                break;
            case 'assignation':
            //todo : choices available transport at same point
                headStep = <div className="centerText">
                    {trans("Assignation : récipients assignés à :vol au départ de :country_name - :iata - :airport_name", {vol:transport.reference, country_name:transport.departure_location.country.nom, iata:transport.departure_location.iata, airport_name:transport.departure_location.name})}
                </div>
                break;
            case 'departure':
                headStep = <div className="centerText">
                    {trans("Départ des récipients sur le convoi Nº:vol au départ de :country_name - :iata - :airport_name", {vol:transport.reference, country_name:transport.departure_location.country.nom, iata:transport.departure_location.iata, airport_name:transport.departure_location.name})}
                </div>
                break;
            case 'arrival':
                headStep = <div className="centerText">
                    {trans("Arrivée des récipients à :airport_name (:iata) - :country_name - Convoi :vol", {vol:transport.reference, airport_name:transport.arrival_location.name, iata:this.cast(transport, 'arrival_location.iata', this.cast(transport, 'arrival_location.cardit')), country_name:this.cast(transport, 'arrival_location.country.nom', this.cast(transport, 'arrival_location.adresse.ville.country.nom'))})}
                </div>
                break;
        }
        return headStep
    }

    getStepView() {
        return <RoadStepView data={this.props.data} step={this.state.step} store={this.props.store} reception={this.reception} assignation={transport_index=>this.assignation(transport_index)} departure={transport_index=>this.departure(transport_index)} arrival={transport_index=>this.arrival(transport_index)} delivery={this.delivery}/>
    }
}

class CarditRow extends Cardit
{
  render() {
    let mailclasses = this.models('props.data.nsetup.mail_class.code')
    let mailclass_concat = Object.keys(this.models('props.data.nsetup.mail_classes', {})).join(' ')
    if(mailclass_concat)
        mailclasses = mailclass_concat
    return <React.Fragment>
        <Ry/>
        <tr>
            <td className="green">{moment(this.props.data.nsetup.preparation_datetime_lt).format('DD/MM/YYYY')}</td>
            <td className="green">{moment(this.props.data.nsetup.preparation_datetime_lt).format('HH:mm')}</td>
            <td>
                <div className="d-flex align-items-center justify-content-center">
                    {this.models('props.data.nsetup.exceptions.bgms')?<i className="fa fa-2x fa-exclamation-triangle ml-2 text-danger"></i>:null}
                    {this.props.readOnly?<a href={`#dialog/cardit_file?id=${this.props.data.id}`} className="mr-2"><i className="icon-info"></i></a>:null} {this.props.data.nsetup.document_number}
                    {this.models('props.data.nsetup.exceptions.bgms')?null:<a href="#" onClick={this.detail} className="btnAccord"><i className={`fa ${this.state.open?'fa-sort-up':'fa-sort-down'}`}></i></a>}
                </div>
            </td>
            <td>{this.models('props.data.nsetup.consignment_category.code')}</td>
            <td>{mailclasses}</td>
            <td>{this.props.data.nsetup.nreceptacles}</td>
            <td>{numeral(parseFloat(this.props.data.nsetup.wreceptacles)).format('0,0.[00]')}</td>
            <td className="w-info">{this.props.data.nsetup.handover_origin_location.iata} <a href="#" onClick={e=>{
                e.preventDefault()
                $(`#origin-${this.props.data.id}`).modal('show')
            }}><i className="icon-info"></i></a>
                <Popup id={`origin-${this.props.data.id}`} className="airport-modal">
                    <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                        <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans("Station de départ")}</span></h5>
                    </PopupHeader>
                    <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                    <PopupBody>
                        <div className="row">
                            <div className="col-5 text-right text-grey">
                                {trans("Pays")} :
                            </div>
                            <div className="col-7 text-left">
                                {this.props.data.nsetup.handover_origin_location.country.nom}
                            </div>
                            <div className="col-5 text-right text-grey">
                                {trans("Code")} :
                            </div>
                            <div className="col-7 text-left">
                                {this.props.data.nsetup.handover_origin_location.iata}
                            </div>
                            <div className="col-5 text-right text-grey">
                                {trans("Départ")} :
                            </div>
                            <div className="col-7 text-left text-wrap">
                                {this.props.data.nsetup.handover_origin_location.name}
                            </div>
                        </div>
                    </PopupBody>
                </Popup></td>
            <td>{this.models('props.data.nsetup.handover_destination_location.iata', this.models('props.data.nsetup.handover_destination_location.cardit'))} <a href="#" onClick={e=>{
                e.preventDefault()
                $(`#destination-${this.props.data.id}`).modal('show')
            }}><i className="fa fa-info-circle text-turquoise"></i></a>
                <Popup id={`destination-${this.props.data.id}`} className="airport-modal">
                    <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                        <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans('Station de destination')}</span></h5>
                    </PopupHeader>
                    <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                    <PopupBody>
                        <div className="row">
                            <div className="col-5 text-right text-grey">
                                {trans('Pays')} :
                            </div>
                            <div className="col-7 text-left">
                                {this.models('props.data.nsetup.handover_destination_location.adresse.ville.country.nom')}
                            </div>
                            <div className="col-5 text-right text-grey">
                                {trans('Code')} :
                            </div>
                            <div className="col-7 text-left">
                                {this.models('props.data.nsetup.handover_destination_location.cardit')}
                            </div>
                            <div className="col-5 text-right text-grey">
                                {trans('Arrivée')} :
                            </div>
                            <div className="col-7 text-left text-wrap">
                                {this.props.data.nsetup.handover_destination_location.name}
                            </div>
                        </div>
                    </PopupBody>
                </Popup></td>
            <td>{this.cast(this.props.data.transports.find(it=>it.pivot.step==0), 'reference')}</td>
            <td className="p-2">{this.props.reception(this.props.data)}</td>
            <td className="p-2">{this.props.completed(this.props.data)}</td>
        </tr>
        {(this.state.data && this.state.open)?<RoadFullDetail data={this.state.data} consignmentEvents={this.state.consignment_events} deliveryConsignmentEvents={this.state.delivery_consignment_events} store={this.props.store} readOnly={this.props.readOnly}/>:null}
    </React.Fragment>
  }
}

class CarditList extends List
{
  table() {
    if(this.props.data.customer_type!='road')
        return super.table()
    return <table className="table table-bordered table-hover table-striped table-liste" cellSpacing="0" cellPadding="0" id="recipientTable">
        <thead>
            <tr>
                <th>{trans('Emis le')}</th>
                <th>{trans('à')}</th>
                <th>{trans("N° d'expédition")}</th>
                <th>{trans('Cat.')}</th>
                <th>{trans('Clas.')}</th>
                <th>{trans('Qté')}</th>
                <th>{trans('Poids')}</th>
                <th>{trans('Orig.')}</th>
                <th>{trans('Dest.')}</th>
                <th>{trans('Route')}</th>
                <th>{trans('Réception')}</th>
                <th>{trans('Trip completed')}</th>
            </tr>
        </thead>
        <tbody>
            {this.state.data.map(item=><CarditRow readOnly={this.readOnly} key={`cardit-${item.id}`} escales={this.escales} data={item} reception={this.reception} assignation={this.assignation} completed={this.completed} consignmentEvents={this.props.data.consignment_events} deliveryConsignmentEvents={this.props.data.delivery_consignment_events} store={this.props.store}/>)}
        </tbody>
        <tfoot className={(this.progressive && this.state.page<this.state.last_page)?'':'d-none'}>
            <tr>
                <td ref="overscroller" colSpan="14" className={`position-relative py-3`}><i className="spinner"></i></td>
            </tr>
        </tfoot>
    </table>
  }
}

export default CarditList;