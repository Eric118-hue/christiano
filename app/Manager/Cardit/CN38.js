import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import './CN38.scss';
import $ from 'jquery';
import numeral from 'numeral';

class CN38 extends Component
{
  constructor(props) {
    super(props)
    this.document_type = this.models('props.data.document_type', 'cn38')
    this.state = this.models(`props.data.data.${this.document_type}`)
    this.name = this.models(`state.type`)
    this.format = React.createRef()
    this.form = React.createRef()
    this.export = this.export.bind(this)
  }

  export(format) {
    $(this.format.current).val(format)
    $(this.form.current).submit()
  }

  render() {
    let total4 = 0
    let total5 = 0
    let total6 = 0
    let total7 = 0
    let total8 = 0
    let total9 = 0
    return <form className="cn38-wrap m-auto" name="frm_cn38" action={`/${this.document_type}`} method="post" target="blank" style={{width: 910}} ref={this.form}>
      <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
      <div className="card">
        <div className="card-body">
          <div className="tableFirst">
              <table>
                <tbody>
                  <tr>
                      <td colSpan="2" style={{border:'none'}}>
                        {trans('Designated operator of origin')}<br/> 
                        <strong>{this.models('state.origin.operator')}</strong>
                      </td>
                      <td style={{border:'none'}}>
                          <h2>{trans('DELIVERY BILL')}</h2>
                          <h3>{trans('Airmail')}</h3>
                      </td>
                      <td style={{border:'none', textAlign: 'right'}}>
                          <h2>{this.name}</h2>
                      </td>
                  </tr>
                  <tr>
                      <td colSpan="2" style={{border:'none'}}>{trans('Office of origin of the bill')}<br/> 
                        <strong>{this.models('state.origin.office')}</strong>
                      </td>
                      <td style={{border:'none'}}>{trans('Date')}<br/>
                        <strong>{this.models('state.date', '').toUpperCase()}</strong>
                      </td>
                      <td style={{border:'none'}}>{trans('Serial No.')}<br/>
                        <strong>{this.models('props.data.data.nsetup.document_number')}</strong>
                      </td>
                  </tr>
                  <tr>
                      <td colSpan="4" style={{border:'none'}}>{trans('Office of destination of the bill')}<br/>
                      <strong>{this.models('state.destination.office')}</strong>
                      </td>
                  </tr>
                  <tr>
                      <td colSpan="2" style={{border:'none'}}></td>
                      <td style={{border:'none'}}>
                        <div className="custom-control custom-checkbox">
                          <input id="proritaire" type="checkbox" defaultChecked={this.models('props.data.data.nsetup.consignment_category.code')=='A'} className="custom-control-input"/>
                          <label className="custom-control-label" htmlFor="proritaire">{trans('Priority')}</label>
                        </div>
                      </td>
                      <td style={{border:'none'}}>
                        <div className="custom-control custom-checkbox">
                          <input id="avion" type="checkbox" defaultChecked={this.models('props.data.data.nsetup.consignment_category.code')=='A' || this.models('props.data.data.nsetup.consignment_category.code')=='B'} className="custom-control-input"/>
                          <label className="custom-control-label" htmlFor="avion">{trans('By airmail')}</label>
                        </div>
                      </td>
                  </tr>
                  <tr>
                      <td colSpan="2">{trans('Flight No.')}<br/>
                        <strong>{this.models('state.flights')}</strong>
                      </td>
                      <td>{trans('Date of departure')}<br/>
                        <strong>{this.models('state.departure.date', '').toUpperCase()}</strong>
                      </td>
                      <td>{trans('Time')}<br/>
                        <strong>{this.models('state.departure.time')}</strong>
                      </td>
                  </tr>
                  <tr>
                      <td colSpan="2">{trans('Airport of direct transhipment')}<br/>
                      <strong>{this.models('state.transhipments.0.iata')} - {this.models('state.transhipments.0.name')} - {this.models('state.transhipments.0.country.nom')}</strong></td>
                      <td colSpan="2">{trans('Airport of unloading')}<br/>
                        <strong>{this.models('props.data.data.nsetup.handover_destination_location.iata')} - {this.models('props.data.data.nsetup.handover_destination_location.name')} - {this.models('props.data.data.nsetup.handover_destination_location.country.nom')}</strong>
                      </td>
                  </tr>
                  <tr>
                      <td colSpan="4" style={{border:'1px solid', borderBottom: 'none'}}>{trans('If a container is used')}</td>
                  </tr>
                  <tr>
                    <td style={{borderTop:'none'}}>{trans('No. of container')}<br/>
                        <strong>{this.models('props.data.data.nsetup.equipment')=='UL'?this.models('props.data.data.nsetup.container_id'):''}</strong>
                      </td>
                      <td style={{borderTop:'none'}}>
                        {trans('No. of seal')}<br/>
                        <strong>{this.models('props.data.data.nsetup.seal')}</strong>
                      </td>
                      <td style={{borderTop:'none'}}>{trans('No. of container')}</td>
                      <td style={{borderTop:'none'}}>{trans('No. of seal')}</td>
                  </tr>
                  <tr>
                      <td>{trans('No. of container')}</td>
                      <td>{trans('No. of seal')}</td>
                      <td>{trans('No. of container')}</td>
                      <td>{trans('No. of seal')}</td>
                  </tr> 
                </tbody>
              </table>
          </div>

          <div className="tableCenter">
              <h3 style={{fontSize: 16}}>{trans('Entry')}</h3>
              <table>
                  <thead style={{textAlign: 'left'}}>
                      <tr>
                          <th rowSpan="2" style={{border:'1px solid'}}>{trans('Mail No.')}</th>
                          <th rowSpan="2" style={{border:'1px solid'}}>{trans('Office of origin')}</th>
                          <th rowSpan="2" style={{border:'1px solid'}}>{trans('Office of destination')}</th>
                          <th colSpan="3" width="30%" style={{border:'1px solid', borderBottom: 'none'}}>{trans('Number of')}</th>
                          <th colSpan="3" width="30%" style={{border:'1px solid', borderBottom: 'none'}}>{trans('Gross weight of receptacles')}</th>
                          <th rowSpan="2" width="15%" style={{border:'1px solid'}}>{trans('Observations(including the number of M bags and/or loose parcels)')}</th>
                      </tr>
                      <tr>
                          <th style={{border:'1px solid', borderTop: 'none'}}>{trans('Letter Post receptacles')}</th>
                          <th style={{border:'1px solid', borderTop: 'none'}}>{trans('CP receptacles and loose parcels')}</th>
                          <th style={{border:'1px solid', borderTop: 'none'}}>{trans('EMS receptacles')}</th>
                          <th style={{border:'1px solid', borderTop: 'none'}}>{trans('Letter post')}</th>
                          <th style={{border:'1px solid', borderTop: 'none'}}>{trans('CP')}</th>
                          <th style={{border:'1px solid', borderTop: 'none'}}>{trans('EMS')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {this.models('props.data.data.nsetup.receptacles', []).map(receptacle=>{
                      total4 += receptacle.receptacle_id.substr(13,1)=='U'?1:0
                      total5 += receptacle.receptacle_id.substr(13,1)=='C'?1:0
                      total6 += receptacle.receptacle_id.substr(13,1)=='E'?1:0
                      total7 += receptacle.receptacle_id.substr(13,1)=='U'?parseFloat(receptacle.receptacle_id.substr(-4))/10:0
                      total8 += receptacle.receptacle_id.substr(13,1)=='C'?parseFloat(receptacle.receptacle_id.substr(-4))/10:0
                      total9 += receptacle.receptacle_id.substr(13,1)=='E'?parseFloat(receptacle.receptacle_id.substr(-4))/10:0
                      return <tr key={receptacle.receptacle_id} height="35px">
                          <td className="text-nowrap">{receptacle.receptacle_id.substr(16,4)} / {receptacle.receptacle_id.substr(20,3)}</td>
                          <td>{receptacle.receptacle_id.substr(0,6)}</td>
                          <td className="text-center">{receptacle.receptacle_id.substr(6,6)}</td>
                          <td className="text-center">{receptacle.receptacle_id.substr(13,1)=='U'?1:''}</td>
                          <td className="text-center">{receptacle.receptacle_id.substr(13,1)=='C'?1:''}</td>
                          <td className="text-center">{receptacle.receptacle_id.substr(13,1)=='E'?1:''}</td>
                          <td className="text-center">{receptacle.receptacle_id.substr(13,1)=='U'?numeral(parseFloat(receptacle.receptacle_id.substr(-4))/10).format('0.0'):''}</td>
                          <td className="text-center">{receptacle.receptacle_id.substr(13,1)=='C'?numeral(parseFloat(receptacle.receptacle_id.substr(-4))/10).format('0.0'):''}</td>
                          <td className="text-center">{receptacle.receptacle_id.substr(13,1)=='E'?numeral(parseFloat(receptacle.receptacle_id.substr(-4))/10).format('0.0'):''}</td>
                          <td className="text-center">{this.cast(receptacle, 'type.code')}</td>
                      </tr>})}
                      <tr height="35px">
                          <td colSpan="3" style={{textAlign: 'right'}}>{trans('Totals')}</td>
                          <td className="text-center font-weight-bold">{numeral(total4).format('0')}</td>
                          <td className="text-center font-weight-bold">{numeral(total5).format('0')}</td>
                          <td className="text-center font-weight-bold">{numeral(total6).format('0')}</td>
                          <td className="text-center font-weight-bold">{numeral(total7).format('0.0')}</td>
                          <td className="text-center font-weight-bold">{numeral(total8).format('0.0')}</td>
                          <td className="text-center font-weight-bold">{numeral(total9).format('0.0')}</td>
                          <td></td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div className="lastTable">
              <table style={{textAlign: 'left'}}>
                  <thead>
                      <tr>
                          <th style={{padding: '0 50px 0 0'}}>{trans('Dispatching office of exchange')}<br/>{trans('Signature')}</th>
                          <th style={{padding: '0 50px 0 0'}}>{trans('The official of the carrier or airport')}<br/>{trans('Date and signature')}</th>
                          <th style={{padding: '0 50px 0 0'}}>{trans('Office of exchange of destination')}<br/>{trans('Date and signature')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td style={{padding: '0 50px 0 0'}}>
                              <span style={{display: 'block', borderBottom: '1px solid', height: 50}}></span>
                          </td>
                          <td style={{padding: '0 50px 0 0'}}>
                              <span style={{display: 'block', borderBottom: '1px solid', height: 50}}></span>
                          </td>
                          <td style={{padding: 0}}>
                              <span style={{display: 'block', borderBottom: '1px solid', height: 50}}></span>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <div className="d-flex justify-content-between align-items-baseline">
            <div>
              {(this.models('props.data.data.nsetup.CSD1', false) && this.models('props.data.data.nsetup.RFF.AIA', false) && this.models('props.data.data.nsetup.RFF.AGE', false))?`${this.models('props.data.data.nsetup.CSD1', false)} - ${this.models('props.data.data.nsetup.RFF.AIA.country_iso')}/${this.models('props.data.data.nsetup.RFF.AIA.regulated_agent')}/${this.models('props.data.data.nsetup.RFF.AIA.regulated_agent_no')} - ${this.models('props.data.data.nsetup.RFF.AGE', false)}`:null}
            </div>
            <div className="text-right">
              <input type="hidden" ref={this.format} name="format" value="pdf"/>
              <input type="hidden" name="id" value={this.props.data.data.id}/>
              <button className="btn btn-turquoise" type="button" onClick={()=>this.export('xlsx')}><i className="fa fa-file-excel"></i> {trans('Télécharger')} XLSX</button>
              <button className="btn btn-orange ml-2" type="button" onClick={()=>this.export('pdf')}><i className="fa fa-file-pdf"></i> {trans('Télécharger')} PDF</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  }
}

export default Modelizer(CN38)