import React, {Component} from 'react';
import Modelizer from '../../../../vendor/Ry/Core/Modelizer';
import trans from '../../../translations';
import moment from 'moment';
import numeral from 'numeral';
import $ from 'jquery';

class CN66 extends Component
{
  constructor(props) {
    super(props)
    let total_A = 0
    let total_B = 0
    this.models('props.data.cart.route.cardits', []).map(cardit=>{
      if(cardit.nsetup.consignment_category.code=='A')
        total_A += parseFloat(cardit.total_quantity)
      else
        total_B += parseFloat(cardit.total_quantity)
    })
    this.state = {
      cart : this.models('props.data.cart'),
      total_A : total_A,
      total_B : total_B
    }
  }

  render() {
    if(!this.models('state.cart.archived', false)) {
      return <div className="alert alert-warning">{trans('Calcul en cours... Veuillez patienter un instant')}</div>
    }
    return <div className="col-12">
      <div className="border rounded">
      <div className="row">
        <div className="col-2">
          <ul className="nav nav-pills flex-column bg-white h-100 rounded">
            {this.models('state.cart.routes', []).map(route=><li className="nav-item" key={`route-${route.departure.id}-${route.arrival.id}`}><a className={`nav-link ${route.active?'active bg-dark':''}`} href={`/cn66?id=${this.state.cart.id}&from_id=${route.departure.id}&to_id=${route.arrival.id}`}>{route.departure.iata}-{route.arrival.iata}</a></li>)}
          </ul>
        </div>
        <div className="col-10 py-3">
          <form className="m-auto" name="frm_cn66" action={trans('/cn66')} method="post" target="blank" style={{width: 910}}>
          <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
            <div className="card">
                <div className="card-body">
                <div className="row"> 
                  <div className="col-6">  
                      <p>{trans('Opérateur')}</p>
                          <strong>{this.models('state.cart.customer.facturable.name')} - {this.models('state.cart.customer.facturable.type')}</strong>         
                  </div> 

                  <div className="col-6 d-flex justify-content-between">
                    <div>
                      <h5 className="mb-0">{trans('Relevé de poids')}</h5>
                      <h6>{trans('Dépêches-avion et S.A.L.')}</h6>
                      <p><span className="font-weight-normal">{trans('Date')}</span> : <strong>{moment(this.models('state.cart.invoice_date')).format('ll')}</strong></p>
                    </div>
                    <div> 
                      <h5>CN 66</h5>
                    </div> 
                  </div>
              </div>   
              <div className="float-right">
                <div className="form-check">
                  <input className="form-check-input" name="nsetup[cn66][prioritaire_par_avion]" type="checkbox" value="1" id="prioritaire_par_avion" defaultChecked={this.models('state.cart.nsetup.cn66.prioritaire_par_avion', 1)}/>
                  <label className="form-check-label" htmlFor="prioritaire_par_avion">
                    {trans("Prioritaire/Par avion")}
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" name="nsetup[cn66][non_prioritaire_sal]" type="checkbox" value="1" id="non_prioritaire_sal" defaultChecked={this.models('state.cart.nsetup.cn66.non_prioritaire_sal')}/>
                  <label className="form-check-label" htmlFor="non_prioritaire_sal">
                    {trans("Non Prioritaire/S.A.L.")}
                  </label>
                </div>
              </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <td scope="col-6" rowSpan="3" className="align-top border-bottom-0">
                    {trans('Opérateur désigné expéditeur des dépêches')}
                    <br/>
                    <h4>{this.models('props.data.edi.code3')} - {this.models('props.data.edi.organisation_name35')}</h4>
                  </td>
                  <td scope="col-6" className="border-bottom-0" colSpan="3">
                      <h4 className="mb-0">{moment(this.models('state.cart.nsetup.period')+'-01').format('MMMM YYYY')}</h4>
                      {trans('Dépêches acheminées')}
                  </td>               
                </tr>
                <tr>               
                  <td colSpan="3" className="border-bottom-0">
                    <label className="control-label text-right w-25 font-weight-normal mr-3">{trans('de')} : </label><strong>{this.models('state.cart.route.departure.iata')}</strong>
                    </td>
                </tr>
                <tr>               
                  <td colSpan="3" className="border-bottom-0">
                  <label className="control-label text-right w-25 font-weight-normal mr-3">{trans('à')} : </label><strong>{this.models('state.cart.route.arrival.iata')}</strong>
                    </td>
                </tr>
              </thead>                
            </table>

            <table className="border-left-0 border-top-0 table table-bordered table-mini-padding">
                <thead>
                  <tr>
                    <td className="border-left-0 border-top-0" colSpan="5">
                      {trans("Les observations éventuelles peuvent être indiquées au verso de la formule")}
                    </td>
                    <th className="bg-light text-center" colSpan="2">
                      {trans("Poids par catégorie d’envois")}
                    </th>
                  </tr>
                  <tr className="bg-light text-center">
                    <th scope="col-1">{trans('Date CARDIT')}</th>
                    <th scope="col-1">{trans("N° d’expédition")}</th>
                    <th scope="col-1">{trans('Origine')}</th>
                    <th scope="col-1">{trans('Destination')}</th>
                    <th scope="col-2">{trans('N° de vol')}</th>
                    <th scope="col-2">{trans('Prioritaire (A)')}</th>
                    <th scope="col-2">{trans('S.A.L. (B)')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">1</td>
                    <td className="text-center">2</td>
                    <td className="text-center">3</td>
                    <td className="text-center">4</td>
                    <td className="text-center">5</td>
                    <td className="text-center">6</td>
                    <td className="text-center">7</td>
                  </tr>
                  {this.models('state.cart.route.cardits', []).map(cardit=><tr key={cardit.id}>
                    <td className="text-center">{moment(cardit.nsetup.preparation_datetime_lt).format('DD/MM')}</td>
                    <td className="text-center">{cardit.nsetup.document_number}</td>
                    <td className="text-center">{cardit.proto_receptacle_nsetup.receptacle_id.substr(0,6)}</td>
                    <td className="text-center">{cardit.proto_receptacle_nsetup.receptacle_id.substr(6,6)}</td>
                    <td className="text-center">{cardit.nsetup.transports[0].conveyence_reference}</td>
                    <td className="text-right">{cardit.nsetup.consignment_category.code=='A'?numeral(parseFloat(cardit.total_quantity)).format('0,0.0')+'Kg':'--'}</td>
                    <td className="text-right">{cardit.nsetup.consignment_category.code=='B'?numeral(parseFloat(cardit.total_quantity)).format('0,0.0')+'Kg':'--'}</td>
                  </tr>)}
                  </tbody>
                  <tfoot>
                  <tr>
                    <th colSpan="5" className="text-right">{trans("Total général")}</th>
                    <th className="text-right">{parseFloat(this.state.total_A)>0?numeral(parseFloat(this.state.total_A)).format('0,0.0')+'Kg':'--'}</th>
                    <th className="text-right">{parseFloat(this.state.total_B)>0?numeral(parseFloat(this.state.total_B)).format('0,0.0')+'Kg':'--'}</th>
                  </tr>             
                </tfoot>
            </table>
            <div className="text-right">
              <input type="hidden" name="format" value="pdf"/>
              <input type="hidden" name="id" value={this.state.cart.id}/>
              <input type="hidden" name="from_id" value={this.state.cart.from_id}/>
              <input type="hidden" name="to_id" value={this.state.cart.to_id}/>
            <button className="btn btn-orange"><i className="fa fa-file-pdf"></i> {trans('Télécharger')}</button>
            </div>
            </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
    }
}

export default Modelizer(CN66);