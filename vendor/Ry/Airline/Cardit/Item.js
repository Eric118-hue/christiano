import React, {Component} from 'react';
import moment from 'moment';
import {Popup, PopupHeader, PopupBody} from '../../../bs/bootstrap';
import $ from 'jquery';
import Reception from './Reception';
import Assignation from './Assignation';

class StepView extends Component
{
    render() {
        return <div className="recipientContainer">
            <div className="d-flex justify-content-center align-items-center">
                <div className="asideList">{this.props.data.nsetup.handover_origin_location.iata}</div>
                <div className="recipientList d-flex flex-column justify-content-between align-items-center red">
                    <div className="mouse-pointable w-100" onClick={this.props.reception}>
                        <i className="ico-reception"></i>
                        <span>Réception</span>
                    </div>
                </div>
                {this.props.data.nsetup.transports.map((transport, index)=><React.Fragment key={`cardit-${this.props.data.id}-transport-${index}`}>
                    <div className="recipientList d-flex flex-column justify-content-between align-items-center">
                        <div className="mouse-pointable w-100" onClick={()=>this.props.assignation(index)}>
                            <i className="ico-entrepot"></i>
                            <span>Assignation</span>
                        </div>
                    </div>
                    <div className="recipientList d-flex flex-column justify-content-between align-items-center">
                        <div className="mouse-pointable w-100">
                            <i className="ico-depart"></i>
                            <span>Départ</span>
                        </div>
                    </div>
                    <div className="recipientList d-flex flex-column justify-content-between align-items-center">
                        <div className="mouse-pointable w-100">
                            <i className="ico-arrive"></i>
                            <span>Arrivé</span>
                        </div>
                    </div>
                </React.Fragment>)}
                <div className="recipientList d-flex flex-column justify-content-between align-items-center">
                    <div className="mouse-pointable w-100">
                        <i className="ico-entrepot"></i>
                        <span>Entrepôt</span>
                    </div>
                </div>
                <div className="recipientList d-flex flex-column justify-content-between align-items-center last">
                    <div className="mouse-pointable w-100">
                        <i className="ico-livraison"></i>
                        <span>Livraison</span>
                    </div>
                </div>
                <div className="asideList asideList2">{this.props.data.nsetup.handover_destination_location.iata}</div>
            </div>
        </div>
    }
}

class Item extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            step : 'reception',
            transport_index : 0
        }
        this.reception = this.reception.bind(this)
        this.assignation = this.assignation.bind(this)
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

    render() {
        let step = null;
        switch(this.state.step) {
            case 'reception':
                step = <Reception data={this.props.data}/>
                break;
            case 'assignation':
            //todo : choices available transport at same point
                let selectTransports = [this.props.data.nsetup.transports[this.state.transport_index]]
                step = <Assignation data={this.props.data} transportIndex={this.state.transport_index} selectTransports={selectTransports}/>
                break;
        }
        return <React.Fragment><tr>
        <td className="green">{moment.utc(this.props.data.nsetup.preparation_datetime).format('DD/MM/YYYY')}</td>
        <td className="green">{moment.utc(this.props.data.nsetup.preparation_datetime).format('HH:mm')}</td>
        <td>
            <div className="d-flex align-items-center justify-content-center">
                {this.props.data.nsetup.document_number}
                <a href="#" className="btnAccord" data-toggle="collapse" href={`#collapsible${this.props.data.id}`} role="button" aria-expanded="false" aria-controls={`collapsible${this.props.data.id}`}><i className="fa fa-sort-down"></i></a>
            </div>
        </td>
        <td>{this.props.data.nsetup.consignment_category.code}</td>
        <td>{this.props.data.nsetup.mail_class.code}</td>
        <td>{this.props.data.nsetup.nreceptacles}</td>
        <td>{this.props.data.nsetup.wreceptacles}</td>
        <td className="w-info">{this.props.data.nsetup.handover_origin_location.iata} <a href="#" onClick={e=>{
            e.preventDefault()
            $(`#origin-${this.props.data.id}`).modal('show')
        }}><i className="icon-info"></i></a>
            <Popup id={`origin-${this.props.data.id}`} className="airport-modal">
                <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                    <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">Aéroport d'origine</span></h5>
                </PopupHeader>
                <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                <PopupBody>
                    <div className="row">
                        <div className="col-5 text-right text-grey">
                            Pays :
                        </div>
                        <div className="col-7 text-left">
                            {this.props.data.nsetup.handover_origin_location.country.nom}
                        </div>
                        <div className="col-5 text-right text-grey">
                            Code :
                        </div>
                        <div className="col-7 text-left">
                            {this.props.data.nsetup.handover_origin_location.iata}
                        </div>
                        <div className="col-5 text-right text-grey">
                            Aéroport :
                        </div>
                        <div className="col-7 text-left text-wrap">
                            {this.props.data.nsetup.handover_origin_location.name}
                        </div>
                    </div>
                </PopupBody>
            </Popup></td>
        <td>{this.props.escales(this.props.data)}
            <Popup id={`escales-${this.props.data.id}`}>
                <PopupHeader>
                    Escales
                </PopupHeader>
                <PopupBody>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Aéroport</th>
                                <th>Arrivée</th>
                                <th>Départ</th>
                                <th>Vol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.nsetup.transports.slice(0, -1).map((transport, index)=><tr key={`escale-${this.props.data.id}-${index}`}>
                                <td>{transport.arrival_location.iata} - {transport.arrival_location.name} - {transport.arrival_location.country.nom}</td>
                                <td>{moment.utc(transport.arrival_datetime).format('DD/MM/YYYY HH:mm')}</td>
                                <td>{moment.utc(this.props.data.nsetup.transports[index+1].departure_datetime).format('DD/MM/YYYY HH:mm')}</td>
                                <td>{this.props.data.nsetup.transports[index+1].conveyence_reference}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </PopupBody>
            </Popup></td>
        <td>{this.props.data.nsetup.handover_destination_location.iata} <a href="#" onClick={e=>{
            e.preventDefault()
            $(`#destination-${this.props.data.id}`).modal('show')
        }}><i className="fa fa-info-circle text-turquoise"></i></a>
            <Popup id={`destination-${this.props.data.id}`} className="airport-modal">
                <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                    <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">Aéroport de destination</span></h5>
                </PopupHeader>
                <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                <PopupBody>
                    <div className="row">
                        <div className="col-5 text-right text-grey">
                            Pays :
                        </div>
                        <div className="col-7 text-left">
                            {this.props.data.nsetup.handover_destination_location.country.nom}
                        </div>
                        <div className="col-5 text-right text-grey">
                            Code :
                        </div>
                        <div className="col-7 text-left">
                            {this.props.data.nsetup.handover_destination_location.iata}
                        </div>
                        <div className="col-5 text-right text-grey">
                            Aéroport :
                        </div>
                        <div className="col-7 text-left text-wrap">
                            {this.props.data.nsetup.handover_destination_location.name}
                        </div>
                    </div>
                </PopupBody>
            </Popup></td>
        <td>
            {this.props.data.nsetup.transports[0].conveyence_reference} <a href="#" onClick={e=>{
            e.preventDefault()
            $(`#conveyence-${this.props.data.id}`).modal('show')
        }}><i className="fa fa-info-circle text-turquoise"></i></a>
            <Popup id={`conveyence-${this.props.data.id}`} className="airport-modal">
                <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                    <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">Premier vol</span></h5>
                </PopupHeader>
                <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                <PopupBody>
                    {this.props.data.nsetup.transports[0].airlines.join('<br/>')}
                </PopupBody>
            </Popup>
        </td>
        <td className="p-2">{this.props.irregularites()}</td>
        <td className="p-2">{this.props.performances()}</td>
        <td className="p-2">{this.props.completed()}</td>
    </tr>
    <tr className={`detail collapse`} id={`collapsible${this.props.data.id}`}>
        <td colSpan="14" className="no-padding">
            <div className="bandeau">
                <span className="title-bandeau">Liste des récipients </span>
                <div className="centerText">
                    Réception : récipients au départ de l’aéroport
                    d’origine : {this.props.data.nsetup.handover_origin_location.country.nom} - {this.props.data.nsetup.handover_origin_location.iata} - {this.props.data.nsetup.handover_origin_location.name}
                </div>
            </div>
            <StepView data={this.props.data} store={this.props.store} reception={this.reception} assignation={transport_index=>this.assignation(transport_index)}/>
            <div className="tableBottom">
                {step}
            </div>
        </td>
    </tr>
    </React.Fragment>
    }
}

export default Item;