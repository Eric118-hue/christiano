import React, {Component} from 'react';
import moment from 'moment';
import {Popup, PopupHeader, PopupBody} from '../../../vendor/bs/bootstrap';
import $ from 'jquery';
import trans from '../../translations';

class Item extends Component
{
    escales(cardit) {
        let k = cardit.nsetup.transports.length
        switch(k) {
            case 1:
                return <div>Direct</div>
            case 2:
                return <a className="btn btn-turquoise d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${cardit.id}`).modal('show')
                }}><span className="font-12">1 escale</span><i className="icon-pencil"></i></a>
            case 3:
                return <a className="btn btn-turquoise d-flex justify-content-between pr-1 align-items-center" href="#" onClick={e=>{
                    e.preventDefault()
                    $(`#escales-${cardit.id}`).modal('show')
                }}><span className="font-12">2 escales</span><i className="icon-pencil"></i></a>
            
        }
    }

    render() {
        return <tr>
        <td className="green">{moment.utc(this.props.data.cardit.nsetup.preparation_datetime).local().format('DD/MM/YYYY')}</td>
        <td className="green">{moment(this.props.data.cardit.nsetup.preparation_datetime_lt).format('HH:mm')}</td>
        <td>
            {this.props.data.cardit.nsetup.document_number}
        </td>
        <td>{this.props.data.cardit.nsetup.consignment_category.code}</td>
        <td>{this.props.data.cardit.nsetup.mail_class.code}</td>
        <td>{this.props.data.cardit.nsetup.nreceptacles}</td>
        <td>{this.props.data.cardit.nsetup.wreceptacles}</td>
        <td className="w-info">{this.props.data.cardit.nsetup.handover_origin_location.iata} <a href="#" onClick={e=>{
            e.preventDefault()
            $(`#origin-${this.props.data.cardit.id}`).modal('show')
        }}><i className="icon-info"></i></a>
            <Popup id={`origin-${this.props.data.cardit.id}`} className="airport-modal">
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
                            {this.props.data.cardit.nsetup.handover_origin_location.country.nom}
                        </div>
                        <div className="col-5 text-right text-grey">
                            Code :
                        </div>
                        <div className="col-7 text-left">
                            {this.props.data.cardit.nsetup.handover_origin_location.iata}
                        </div>
                        <div className="col-5 text-right text-grey">
                            Aéroport :
                        </div>
                        <div className="col-7 text-left text-wrap">
                            {this.props.data.cardit.nsetup.handover_origin_location.name}
                        </div>
                    </div>
                </PopupBody>
            </Popup></td>
        <td className="p-2">{this.escales(this.props.data.cardit)}
            <Popup id={`escales-${this.props.data.cardit.id}`}>
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
                            {this.props.data.cardit.nsetup.transports.slice(0, -1).map((transport, index)=><tr key={`escale-${this.props.data.cardit.id}-${index}`}>
                                <td>{transport.arrival_location.iata} - {transport.arrival_location.name} - {transport.arrival_location.country.nom}</td>
                                <td>{moment(transport.arrival_datetime_lt).format('DD/MM/YYYY HH:mm')}</td>
                                <td>{moment(this.props.data.cardit.nsetup.transports[index+1].departure_datetime_lt).format('DD/MM/YYYY HH:mm')}</td>
                                <td>{this.props.data.cardit.nsetup.transports[index+1].conveyence_reference}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </PopupBody>
            </Popup></td>
        <td>{this.props.data.cardit.nsetup.handover_destination_location.iata} <a href="#" onClick={e=>{
            e.preventDefault()
            $(`#destination-${this.props.data.cardit.id}`).modal('show')
        }}><i className="fa fa-info-circle text-turquoise"></i></a>
            <Popup id={`destination-${this.props.data.cardit.id}`} className="airport-modal">
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
                            {this.props.data.cardit.nsetup.handover_destination_location.country.nom}
                        </div>
                        <div className="col-5 text-right text-grey">
                            {trans('Code')} :
                        </div>
                        <div className="col-7 text-left">
                            {this.props.data.cardit.nsetup.handover_destination_location.iata}
                        </div>
                        <div className="col-5 text-right text-grey">
                            {trans('Aéroport')} :
                        </div>
                        <div className="col-7 text-left text-wrap">
                            {this.props.data.cardit.nsetup.handover_destination_location.name}
                        </div>
                    </div>
                </PopupBody>
            </Popup></td>
        <td>
            {this.props.data.cardit.nsetup.transports[0].conveyence_reference} <a href="#" onClick={e=>{
            e.preventDefault()
            $(`#conveyence-${this.props.data.cardit.id}`).modal('show')
        }}><i className="fa fa-info-circle text-turquoise"></i></a>
            <Popup id={`conveyence-${this.props.data.cardit.id}`} className="airport-modal">
                <PopupHeader className="pl-3 pb-2" closeButton={<span aria-hidden="true"  className="pb-1 pl-2 pr-2 rounded text-white" style={{background:'#170000'}}>&times;</span>}>
                    <h5><img src="/medias/images/ico-airport.png" className="position-absolute"/> <span className="pl-5 text-body">{trans('Premier vol')}</span></h5>
                </PopupHeader>
                <hr className="border m-0 m-auto" style={{width:'calc(100% - 10px)', height:3}}/>
                <PopupBody>
                    {this.props.data.cardit.nsetup.transports[0].airlines.join('<br/>')}
                </PopupBody>
            </Popup>
        </td>
        <td className="p-2">
            <ul>
                {this.props.data.files.map(file=><li key={`resdit-${this.props.data.id}-file-${file}`}><a href={`/export/resdit-${file}-${this.props.data.id}.txt`} target="_blank">{`resdit-${file}`}</a></li>)}
            </ul>
        </td>
    </tr>
    }
}

export default Item;