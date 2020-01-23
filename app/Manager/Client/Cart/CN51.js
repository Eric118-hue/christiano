import React, {Component} from 'react';
import Modelizer from '../../../../vendor/Ry/Core/Modelizer';
import trans from '../../../translations';
import moment from 'moment';
import numeral from 'numeral';

class CN51 extends Component
{
    render() {
      let total = 0
      this.models('props.data.cart.routes', []).map(route=>{
        total += route.total_weight*route.rate
      })
        return <div className="col-12">
        <div className="card">
            <div className="card-body">
            <div className="form-inline"> 
        <div className="col-6">  
     		    <p>{trans('Opérateur désigné créancier')}</p>
                <strong>{this.models('props.data.cart.customer.facturable.name')} - {this.models('props.data.cart.customer.facturable.type')}</strong>         
        </div> 

        <div className="col-3">  
           <h5>{trans('COMPTE PARTICULIER')}<br/>
           {trans('Courrier-avion')}</h5>
           <p><span className="font-weight-normal">{trans('Date')}</span><br/>
           <strong>{moment(this.models('props.data.cart.invoice_date')).format('ll')}</strong></p>
        </div>   

        <div className="col-3"> 
          <h5 className="float-right">CN 51</h5>
        </div> 

      </div>   

         <table className="table table-bordered">
           <thead>
             <tr>
               <th scope="col-6" rowSpan="2" className="align-top">{trans('Opérateur désigné débiteur')}<br/>
                    <h5>{this.models('props.data.edi.code3')} - {this.models('props.data.edi.organisation_name35')}</h5>
               </th>
    <th scope="col-2">{trans('Mois')} : <span className="font-weight-normal">{this.models('props.data.cart.month')}</span></th>
    <th scope="col-2">{trans('Trimestre')} : <span className="font-weight-normal">{this.models('props.data.cart.term')}</span></th>               
    <th scope="col-2">{trans('Année')} : <span className="font-weight-normal">{this.models('props.data.cart.year')}</span></th>               
             </tr>
             <tr>               
               <td colSpan="3"><div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                  <label className="form-check-label" htmlFor="defaultCheck1">
                    {trans("Dépêches-avion en transit")}
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="defaultCheck2"/>
                  <label className="form-check-label" htmlFor="defaultCheck2">
                    {trans("Envois prioritaires/avion en transit à découvert")}
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="defaultCheck2"/>
                  <label className="form-check-label" htmlFor="defaultCheck2">
                    {trans("Envois mal dirigé")}
                  </label>
                </div>
              <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="defaultCheck2"/>
                  <label className="form-check-label" htmlFor="defaultCheck2">
                    {trans("TAI")}
                  </label>
                </div></td>
             </tr>
             <tr>
               <th scope="row">{trans("Mode de règlement")} 
                <div className="ml-3 form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1"/>
                  <label className="form-check-label" htmlFor="exampleRadios1">
                    {trans("Direct")}
                  </label>
                </div>
                <div className="ml-3 form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2"/>
                  <label className="form-check-label" htmlFor="exampleRadios2">
                    {trans("Via UPU*Clearing")}
                  </label>
                </div>
              </th>                                           
                
             </tr>
           </thead>                
         </table>

        <table className="table table-bordered">
            <thead className="table-bordered">
              <tr>
                <th scope="col-1">{trans('Parcours')} <br/> {trans('Pays de destination ou groupes de pays')}</th>
                <th scope="col-1">{trans("Catégories d'envois")}</th>
                <th scope="col-1" colSpan="6">{trans('Poids transporté au cours du ou des mois de :month', {month:moment(this.models('props.data.cart.nsetup.period')+'-01').format('MMMM')})}</th>
                <th scope="col-1" colSpan="2">{trans('Poids total')}</th>
                <th scope="col-2" colSpan="2">{trans('Frais de transit/transport par kg')}</th>
                <th scope="col-6" colSpan="2">{trans('Total des frais de transit/transport à payer')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">1</td>
                <td className="text-center">2</td>
                <td className="text-center" colSpan="2">3</td>
                <td className="text-center" colSpan="2">4</td>
                <td className="text-center" colSpan="2">5</td>
                <td className="text-center" colSpan="2">6</td>
                <td className="text-center" colSpan="2">7</td>
                <td className="text-center" colSpan="2">8 = 6*7</td>
              </tr>
              {this.models('props.data.cart.routes', []).map(route=><tr key={`route-${route.route}`}>
    <td className="text-center">{route.route}</td>
    <td className="text-center">{route.consignment_category.code}</td>
    <td className="text-center" colSpan="2">{numeral(route.total_weight).format('0,0.00')}</td>
                <td className="text-center" colSpan="2"></td>
                <td className="text-center" colSpan="2"></td>
                <td className="text-center" colSpan="2">{numeral(route.total_weight).format('0,0.00')}</td>
    <td className="text-center" colSpan="2">{numeral(route.rate).format('0,0.00$')}</td>
    <td className="text-center" colSpan="2">{numeral(route.total_weight*route.rate).format('0,0.00$')}</td>
              </tr>)}
              <tr>
                <td scope="col" rowSpan="3"></td>
                <td scope="col" rowSpan="3">{trans("Prioritaire¹")}<br/>CP</td>
                <td>kg</td>
                <td>g</td>                
                <td>kg</td>
                <td>g</td>
                <td>kg</td>
                <td>g</td>
                <td>kg</td>
                <td>g</td>                        
                <td colSpan="2">DTS</td>
                <td colSpan="2">DTS</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>                
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>             
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>                
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>               
              </tr>
              <tr>
                <td scope="col" rowSpan="3"></td>
                <td scope="col" rowSpan="3">{trans("Prioritaire¹")}<br/>CP</td>
                <td></td>
                <td></td>                
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>                          
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>                
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>            
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>                
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>             
              </tr>                      
              </tbody>
              <tbody>
              <tr>
                <td colSpan="12">{trans("Majoration de 5% sur le montant total du transit à découvert et des envois mal dirigés")}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="12">{trans("Total général")}</td>
    <td>{numeral(total).format('0,0.00$')}</td>
                <td className="text-center h1" width="5%">-</td>
              </tr>             
            </tbody>
        </table>

        <div><p>{trans("¹ Le cas échéant, LC/AO")}</p></div>
        <div className="form-inline">
          <p className="col-6">{trans("L'opérateur désigné créancier")}<br/>{trans("Signature")}</p>
          <p className="col-6">{trans("Vu et accepté par l'opérateur désigné débiteur")}<br/>{trans("Lieu, date et signature")}</p>
        </div>
        <div className="mt-3 form-inline">
          <div className="col-6"><hr className="float-left" width="65%"/></div>
          <div className="col-6"><hr className="float-left" width="65%"/></div>
        </div>
        <div className="text-right">
    <a href={`/cn51?id=${this.props.data.cart.id}&format=pdf`} target="_blank" className="btn btn-orange"><i className="fa fa-file-pdf"></i> {trans('Télécharger')}</a>
        </div>
        </div>
        </div>
        </div>
    }
}

export default Modelizer(CN51);