import React, {Component} from 'react';
import Modelizer from '../../../../vendor/Ry/Core/Modelizer';
import trans from '../../../translations';
import moment from 'moment';
import numeral from 'numeral';
import $ from 'jquery';

class CN51 extends Component
{
  constructor(props) {
    super(props)
    let total = 0
    this.models('props.data.cart.routes', []).map(route=>{
      total += (route.A.total_weight*route.A.rate + route.B.total_weight*route.B.rate)
    })
    total += parseFloat(this.models('props.data.cart.nsetup.cn51.markup', 0))
    this.state = {
      cart : this.models('props.data.cart'),
      total : total
    }
    this.handleMarkupChange = this.handleMarkupChange.bind(this)
    this.reload = this.reload.bind(this)
  }

  reload() {
    $.ajax({
      url : trans('/cn51'),
      type : 'get',
      data : {
        json : true,
        id : this.state.cart.id
      },
      success : response=>{
        if(response.cart) {
          if(!response.cart.closed || response.cart.pending) {
            this.reload()
          }
          else {
            let total = 0
            response.cart.routes.map(route=>{
              total += (route.A.total_weight*route.A.rate + route.B.total_weight*route.B.rate)
            })
            total += parseFloat(this.cast(response.cart.nsetup, 'cn51.markup', 0))
            this.setState({
              cart : response.cart,
              total : total
            })
          }
        }
      }
    })
  }

  componentDidMount() {
    if(!this.models('state.cart.closed', false) || this.models('state.cart.pending', false)) {
      this.reload()
    }
  }

  handleMarkupChange(event) {
    const value = event.target.value
    this.setState(state=>{
      state.cart.nsetup.cn51.markup = value
      state.total = 0
      state.cart.routes.map(route=>{
        state.total += (route.A.total_weight*route.A.rate + route.B.total_weight*route.B.rate)
      })
      state.total += parseFloat(state.cart.nsetup.cn51.markup)
      return state
    })
  }

  render() {
    return <form className="m-auto" name="frm_cn51" action={trans('/cn51')} method="post" target="blank" style={{width: 910}}>
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
                  <h5 className="mb-0">{trans('Compte particulier')}</h5>
                  <h6>{trans('Courrier-avion')}</h6>
                  <p><span className="font-weight-normal">{trans('Date')}</span> : <strong>{moment(this.models('state.cart.invoice_date')).format('ll')}</strong></p>
                </div>
                <div> 
                  <h5>CN 51</h5>
                </div> 
              </div>
          </div>   

         <table className="table table-bordered">
           <thead>
             <tr>
               <td scope="col-6" rowSpan="2" className="align-top">
                 {trans('Opérateur désigné débiteur')}
                 <br/>
                <h4>{this.models('props.data.edi.code3')} - {this.models('props.data.edi.organisation_name35')}</h4>
               </td>
               <th scope="col-6" colSpan="3">
                  {moment(this.models('state.cart.nsetup.period')+'-01').format('MMMM YYYY')}
               </th>               
             </tr>
             <tr>               
               <td colSpan="3"><div className="form-check">
                  <input className="form-check-input" name="nsetup[cn51][depeches_avion_en_transit]" type="checkbox" value="1" id="defaultCheck1" defaultChecked={this.models('state.cart.nsetup.cn51.depeches_avion_en_transit', 1)}/>
                  <label className="form-check-label" htmlFor="defaultCheck1">
                    {trans("Dépêches-avion")}
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" name="nsetup[cn51][envois_prioritaires_avion_en_transit_a_decouvert]" type="checkbox" value="1" id="envois_prioritaires_avion_en_transit_a_decouvert" defaultChecked={this.models('state.cart.nsetup.cn51.envois_prioritaires_avion_en_transit_a_decouvert')}/>
                  <label className="form-check-label" htmlFor="envois_prioritaires_avion_en_transit_a_decouvert">
                    {trans("Envois prioritaires/avion en transit à découvert")}
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" name="nsetup[cn51][envois_mal_dirige]" type="checkbox" value="1" id="envois_mal_dirige" defaultChecked={this.models('state.cart.nsetup.cn51.envois_mal_dirige')}/>
                  <label className="form-check-label" htmlFor="envois_mal_dirige">
                    {trans("Envois mal dirigé")}
                  </label>
                </div>
              <div className="form-check">
                  <input className="form-check-input" name="nsetup[cn51][tai]" type="checkbox" value="1" id="tai" defaultChecked={this.models('state.cart.nsetup.cn51.tai')}/>
                  <label className="form-check-label" htmlFor="tai">
                    {trans("TAI")}
                  </label>
                </div></td>
             </tr>
             <tr>
               <th scope="row">{trans("Mode de règlement")} 
                <div className="ml-3 form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="nsetup[cn51][payment_mode]" id="exampleRadios1" value="direct" defaultChecked={this.models('state.cart.nsetup.cn51.payment_mode', 'direct')=='direct'}/>
                  <label className="form-check-label" htmlFor="exampleRadios1">
                    {trans("Direct")}
                  </label>
                </div>
                <div className="ml-3 form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="nsetup[cn51][payment_mode]" id="exampleRadios2" value="upu_clearing" defaultChecked={this.models('state.cart.nsetup.cn51.payment_mode')=='upu_clearing'}/>
                  <label className="form-check-label" htmlFor="exampleRadios2">
                    {trans("Via UPU*Clearing")}
                  </label>
                </div>
              </th>                                           
                <th colSpan="3"></th>
             </tr>
           </thead>                
         </table>

        <table className="table table-bordered table-mini-padding">
            <thead className="table-bordered">
              <tr className="bg-light text-center">
                <th scope="col-1">{trans('Origine - Destination')}</th>
                <th scope="col-1">{trans("Catégories d'envois")}</th>
                <th scope="col-1">{trans('Poids transporté')}</th>
                <th scope="col-1">{trans('Frais de transit/Kg')}</th>
                <th scope="col-2">{trans('Transport à payer')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">1</td>
                <td className="text-center">2</td>
                <td className="text-center">3</td>
                <td className="text-center">4</td>
                <td className="text-center">5=3x4</td>
              </tr>
              {this.models('state.cart.routes', []).map(route=><React.Fragment key={`route-${route.departure.iata}-${route.arrival.iata}`}>
                <tr>
                  <th rowSpan="2" className="text-center">
                    {this.cast(route, 'departure.iata')}-{this.cast(route, 'arrival.iata')}
                  </th>
                  <td>
                    <label className="text-right col-10 control-label font-weight-normal">{trans('Prioritaire')} : </label><strong>{route.A.consignment_category.code}</strong>
                  </td>
                  <td className="text-center">{route.A.total_weight>0?numeral(route.A.total_weight).format('0,0.00'):'--'}</td>
                  <td className="text-center">{route.A.total_weight>0?numeral(route.A.rate).format('0,0.00$'):'--'}</td>
                  <th className="text-right">{route.A.total_weight>0?numeral(route.A.total_weight*route.A.rate).format('0,0.00$'):'--'}</th>
                </tr>
                <tr>
                  <td>
                    <label className="text-right col-10 control-label font-weight-normal">{trans('Économique')} : </label><strong>{route.B.consignment_category.code}</strong>
                  </td>
                  <td className="text-center">{route.B.total_weight>0?numeral(route.B.total_weight).format('0,0.00'):'--'}</td>
                  <td className="text-center">{route.B.total_weight>0?numeral(route.B.rate).format('0,0.00$'):'--'}</td>
                  <th className="text-right">{route.B.total_weight>0?numeral(route.B.total_weight*route.B.rate).format('0,0.00$'):'--'}</th>
                </tr>
                </React.Fragment>)}
              </tbody>
              <tfoot>
              <tr>
                <th colSpan="4" className="text-right">{trans("Total général")}</th>
                <th className="text-right">{numeral(parseFloat(this.state.total)).format('0,0.00$')}</th>
              </tr>             
            </tfoot>
        </table>
        <div className="row">
          <p className="col-6">{trans("L'opérateur créancier")}<br/>{trans("Signature")}</p>
          <p className="col-6">{trans("Vu et accepté par l'opérateur désigné débiteur")}<br/>{trans("Lieu, date et signature")}</p>
        </div>
        <div className="text-right">
          <input type="hidden" name="format" value="pdf"/>
          <input type="hidden" name="id" value={this.state.cart.id}/>
        <button className="btn btn-orange"><i className="fa fa-file-pdf"></i> {trans('Télécharger')}</button>
        </div>
        </div>
        </div>
      </form>
    }
}

export default Modelizer(CN51);