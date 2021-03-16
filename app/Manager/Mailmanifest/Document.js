import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import './Document.scss';
import numeral from 'numeral';
import qs from 'qs';
import moment from 'moment';

class CN38 extends Component
{
  render() {
    return <div className="m-auto" style={{width: 910}}>
      <div className="card">
        <div className="card-body">
          <div className="tableFirst my-5">
            <div className="row mb-5">
              <div className="col">
                &nbsp;
              </div>
              <div className="col text-center">
                <h3 className="text-uppercase">{trans('Mail Manifest')}</h3>
                <h5>{trans('Net Weights')}</h5>
              </div>
              <div className="col text-right">
                {trans('Issuing station')} :
                <h3>{this.models('props.data.data.data.mailmanifest.departure_location.iata')}</h3>
              </div>
            </div>
              <table className="table table-bordered table-mini-padding">
                <tbody>
                  <tr>
                      <td rowSpan="4">{trans('Operator')} :<br/>
                        <span className="d-block font-24 text-uppercase">{this.models('props.data.data.data.airline.name')}</span>
                      </td>
                      <td className="pl-4">{trans('Flight')} : <strong>{this.models('props.data.data.data.mailmanifest.reference')}</strong></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="row m-0">
                        <div className="col">
                          {trans('Date')} : <strong>{moment(this.models('props.data.data.data.mailmanifest.departure_datetime_lt')).format('DD/MM/YY')}</strong>
                        </div>
                        <div className="col">
                        {trans('Time')} : <strong>{moment(this.models('props.data.data.data.mailmanifest.departure_datetime_lt')).format('H[h]mm')}</strong>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{height:35}}>

                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="row m-0">
                        <div className="col">
                          {trans('From')} : <strong>{this.models('props.data.data.data.mailmanifest.departure_location.iata')}</strong>
                        </div>
                        <div className="col">
                          {trans('To')} : <strong>{this.models('props.data.data.data.mailmanifest.arrival_location.iata')}</strong>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>

          <div className="my-4">
              <table className="table table-bordered table-mini-padding border-0 table-centerall">
          {this.models('props.data.data.data.mailmanifest.document', []).map(item=><React.Fragment key={`uld-${item.uld}`} >
                  <thead style={{textAlign: 'left'}} className="bg-light">
                      <tr>
                          <th colSpan="6" className="font-20 px-4 text-left">{item.uld}</th>
                      </tr>
                      <tr>
                        <th>{trans('Dispatch')}</th>
                        <th>{trans('Origine')}</th>
                        <th>{trans('Destination')}</th>
                        <th>{trans('Bags')}</th>
                        <th>{trans('Net Weight')}</th>
                        <th>{trans('RMK')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {item.children.map((child, index)=>{
                      return <tr key={`uld-${item.uld}-${index}`}>
                          <td className="text-center">{child.id}</td>
                          <td className="text-center">{child.origin}</td>
                          <td className="text-center">{child.destination}</td>
                          <td className="text-center">{child.bags}</td>
                          <td className="text-center">{child.weight} Kg</td>
                          <td className="text-center">{child.rmk}</td>
                      </tr>})}
                      <tr className="bg-light">
                        <th colSpan="3" className="text-right">{trans('Total')} :</th>
                        <th>{item.total_bags}</th>
                        <th>{numeral(item.total_weight).format('0,0.0')} Kg</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td colSpan="6" style={{height:35}} className="border-0"></td>
                      </tr>
                  </tbody>
                  </React.Fragment>)}
              <tfoot className="bg-light">
                  <tr>
                      <th colSpan="3" className="text-right">{trans('Grand total')} : </th>
                      <th>{this.models('props.data.data.data.mailmanifest.total_bags')}</th>
                      <th>{numeral(this.models('props.data.data.data.mailmanifest.total_weight')).format('0,0.0')} Kg</th>
                      <th></th>
                  </tr>
              </tfoot>
            </table>
          </div>
          <div className="text-right">
            <a className="btn btn-orange" href={`/mailmanifest?${qs.stringify({id:this.models('props.data.data.data.mailmanifest.id'),format:'pdf'})}`} target="_blank"><i className="fa fa-file-pdf"></i> {trans('Télécharger')}</a>
          </div>
        </div>
      </div>
    </div>
  }
}

export default Modelizer(CN38)