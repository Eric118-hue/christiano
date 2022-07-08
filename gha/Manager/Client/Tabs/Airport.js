import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import MultiForm from 'ryvendor/Ry/Admin/User/Multiform';
import trans from 'ryapp/translations';
import $ from 'jquery';
import swal from 'sweetalert2';
import Repository from '../Repository';
import {Popup, PopupHeader, PopupBody, PopupFooter} from 'ryvendor/bs/bootstrap';

class NavAirport extends Component
{
  constructor(props) {
    super(props)
    this.id = 0
    this.state = {
      airlines: this.models('props.data.airlines', []),
      airline: this.models('props.selectAirlines.0')
    }
    this.airlines = React.createRef()
    this.add = this.add.bind(this)
    this.validateAdd = this.validateAdd.bind(this)
    this.handleChangeNewAirline = this.handleChangeNewAirline.bind(this)
    this.close = this.close.bind(this)
  }

  handleChangeNewAirline(e) {
    const value = e.target.value
    this.setState(state=>{
      state.airline = this.props.selectAirlines.find(it=>it.id==value)
      return state
    })
  }

  add() {
    $(`#${this.props.data.id}-modal`).modal('show')
  }

  close() {
    $(`#${this.props.data.id}-modal`).modal('hide')
  }

  validateAdd() {
    this.id++
    this.props.store.dispatch({
      type: 'newairline',
      airport_id: this.props.data.id,
      airline: {
        id: `newairline${this.id}`,
        airline: this.state.airline
      }
    })
    setTimeout(()=>{
      this.close()
      $(this.airlines.current).selectpicker('refresh')
    }, 0)
  }

  render() {
    return <div className='mb-3 ramification-airport'>
      <a className={`nav-link text-nowrap nav-link-client mb-1 ${this.props.active?'nav-client-active':''} ${this.props.tab==this.props.data.id?'active':''}`} id={`v-pills-${this.props.data.id}-tab`} data-toggle="pill" href={`#v-pills-${this.props.data.id}`} role="tab" aria-controls={`v-pills-${this.props.data.id}`} aria-selected={this.props.tab==this.props.data.id?"true":"false"}>{this.props.data.airport.iata} {this.props.active?<i className='fa fa-edit float-right mt-1'></i>:null}</a>
      <ul className='list-unstyled mb-1'>
        {this.state.airlines.map(airline=><li className={`border mb-1`} key={`airline-${airline.id}`}>
          <a className={`nav-link nav-link-airline ${this.props.tab==(this.props.data.id+'-'+airline.id)?' active':''}`} id={`v-pills-${this.props.data.id}-${airline.id}-tab`} data-toggle="pill" href={`#v-pills-${this.props.data.id}-${airline.id}`} role="tab" aria-controls={`v-pills-${this.props.data.id}-${airline.id}`} aria-selected={this.props.tab==(this.props.data.id+'-'+airline.id)?"true":"false"}>{airline.airline.name} <i className='fa fa-angle-double-right float-right mt-1'></i></a>
          <input type="hidden" name={`airports[${this.props.data.id}][airlines][${airline.id}][airline][id]`} value={airline.airline.id}/>
        </li>)}
      </ul>
      <button className='btn btn-orange float-right' type="button" onClick={this.add}><i className='fa fa-plus'></i></button>
      <Popup id={`${this.props.data.id}-modal`}>
          <PopupHeader>
              <h4>{trans('Ajouter une compagnie aérienne')}</h4>
          </PopupHeader>
          <PopupBody>
              <div className="col-md-12">
                <select ref={this.airlines} className="form-control" value={this.models('state.airline.id')} onChange={this.handleChangeNewAirline}>
                    {this.props.selectAirlines.filter(it=>!this.state.airlines.find(it2=>it.id==it2.airline.id)).map(airline=><option key={`airline-${airline.id}`} value={airline.id}>{airline.iata_code}</option>)}
                </select>
              </div>
          </PopupBody>
          <PopupFooter className="justify-content-between d-flex">
              <button className='btn btn-primary' type="button" onClick={this.validateAdd}><i className='fa fa-plus'></i> {trans('Ajouter')}</button>
              <button className='btn btn-secondary' type="button" onClick={this.close}>{trans('Fermer')}</button>
          </PopupFooter>
      </Popup>
    </div>
  }
}

Modelizer(NavAirport)

class Airport extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      tab : '' + this.cast(this.models('props.data.row.facturable.airports', []), '0.id', 0),
      airports : this.models('props.data.row.facturable.airports', []),
      errors : [],
      errorMessages : [],
      oncevalidate : false,
      name_search : '',
      select_station : false,
      stations : []
    }
    this.removeContact = this.removeContact.bind(this)
    this.handleSelectStation = this.handleSelectStation.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.offClick = this.offClick.bind(this)
    this.validate = this.validate.bind(this)
	  this.remove = this.remove.bind(this)
    this.removeAirline = this.removeAirline.bind(this)
  }

  componentDidMount() {
    this.props.store.subscribe(()=>{
      const storeState = this.props.store.getState()
      if(storeState.type==='newairline') {
        this.setState(state=>{
          const _airport = state.airports.find(it=>it.id===storeState.airport_id)
          _airport.airlines.push(storeState.airline)
          return state
        }, ()=>{
          setTimeout(()=>{
            $('[data-toggle="pill"]').tab()
            $('[data-toggle="pill"]').off('shown.bs.tab').on('shown.bs.tab', e=>{
              this.setState({
                  tab : '' + $(e.target).attr('href').replace('#v-pills-', '')
              })
            })
          }, 0)
        })
      }
    })
    $('[data-toggle="pill"]').on('shown.bs.tab', e=>{
      this.setState({
          tab : '' + $(e.target).attr('href').replace('#v-pills-', '')
      })
    })
  }

  remove(airport) {
	swal({
        title: trans('Confirmez-vous la suppression de cette station?'),
        text: trans('Cette station sera supprimée définitivement'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: trans('Oui je confirme')
    }).then((result) => {
        if (result.value) {
            if(airport.id>0) {
                $.ajax({
                    url : trans('/customer_airport'),
                    type : 'delete',
                    data : {
                        id : airport.id
                    },
                    success : ()=>{
						this.setState(state=>{
							state.airports = state.airports.filter(it=>it.id!=airport.id)
							return state
						})
					}
                })
            }
        }
    })
  }

  removeAirline(airport, airline) {
    swal({
          title: trans('Confirmez-vous la suppression de cette compagnie aérienne?'),
          text: trans('Cette compagnie aérienne sera supprimée définitivement'),
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: trans('Oui je confirme')
      }).then((result) => {
          if (result.value) {
              if(airport.id>0) {
                  $.ajax({
                      url : trans('/customer_airport_airline'),
                      type : 'delete',
                      data : {
                        id : airline.id
                      },
                      success : ()=>{
                        this.setState(state=>{
                          let _airport = state.airports.find(it=>it.id==airport.id)
                          _airport.airlines = _airport.airlines.filter(it=>it.id!=airline.id)
                          return state
                        }, ()=>{
                          setTimeout(()=>{
                            document.location.reload()
                          }, 2000)
                        })
            }
                  })
              }
          }
      })
    }

  offClick() {
    this.setState({
        select_station : false
    })
    $('body').off('click', this.offClick)
  }

  handleNameChange(event) {
    this.setState({
        name_search : event.target.value
    })
  }

  handleSearch(event) {
    const value = event.target.value
    this.setState({
        name_search : value,
        airport : value!=this.state.name_search ? {
            id : 0
        } : this.state.airport,
        select_station : this.state.stations.length>0
    })

    if(value.length<2)
        return

    if(this.searchx)
        this.searchx.abort()

    this.searchx = $.ajax({
        url : '/airports',
        data : {
            json : true,
            s : {
              iata : value
            }
        },
        success : response=>{
            if(response.data.data.length>0)
                $('body').on('click', this.offClick)
            this.setState({
                stations : response.data.data,
                select_station : response.data.data.length>0
            })
        }
    })
  }

  handleSelectStation(event, station) {
      event.preventDefault()
      this.setState({
          name_search : station.iata,
          airport : station,
          select_station : false
      })
  }

  removeContact(contact, done) {
    const dis = this
    swal({
        title: trans('Confirmez-vous la suppression?'),
        text: trans('Cet enregistrement sera supprimé définitivement'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: trans('Oui je confirme')
    }).then((result) => {
        if (result.value) {
            if(contact.id>0) {
                $.ajax({
                    url : trans('/client_contacts'),
                    type : 'delete',
                    data : {
                        user_id : contact.id,
                        customer_id : dis.props.data.row.id,
                        gha_id: dis.props.data.row.facturable_id,
                    },
                    success : done
                })
            }
            else
                done()
        }
    })
  }

  validate() {
    let errors = []
    let fsfields = $(".airports-pane input").parsley()
    for(let i=0; i<fsfields.length; i++) {
        if(!fsfields[i].isValid({force:true}))
            errors = errors.concat(fsfields[i].getErrorsMessages())
    }
    if(this.models('state.name_search') && !this.models('state.airport.id', false)) {
      errors.push('no_station_match')
    }
    return errors
  }

  render() {
    return <div className={`tab-pane airports-pane ${this.props.data.tab=='airports'?'active':''}`}
        id={`airports`} role="tabpanel" aria-labelledby="airports-tab">
          <div className="d-flex">
            <div className="border tab-nav-airline flex-column nav nav-pills p-1 rounded" id="v-pills-tab-client" role="tablist" aria-orientation="vertical">
              <a className="nav-link text-light bg-primary text-nowrap mb-1" id={`v-pills-newairport-tab`} data-toggle="pill" href={`#v-pills-newairport`} role="tab" aria-controls={`v-pills-newairport`} aria-selected={this.state.tab=='newairport'?"true":"false"}>{trans('Ajouter une station')}</a>
              {this.state.airports.map(airport=><NavAirport key={`pill-airport-${airport.id}`} store={this.props.store} active={airport.id==this.state.tab.split('-')[0]} tab={this.state.tab} data={airport} selectAirlines={this.props.data.select_airlines}/>)}
            </div>
            <div className="tab-content tab-content-airline pt-0" id="v-pills-tabContent">
            <div className="tab-pane fade" id="v-pills-newairport" role="tabpanel" aria-labelledby="v-pills-newairport-tab">
                <div className="form-group form-inline position-relative col-md-2">
                    <label className="control-label">{trans('Code IATA Station')}</label>
                    <input type="text" value={this.state.name_search} onChange={this.handleSearch} onClick={this.handleSearch} name="airports[newairport][airport][name]" autoComplete="bistrict" className={`form-control ${this.state.errors.indexOf('no_station_match')>=0?'error':''}`}/>
                    <div className={`dropdown-menu overflow-auto ${this.state.select_station?'show':''}`} style={{maxHeight:200}}>
                        {this.state.stations.map(station=><a key={`station-${station.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectStation(e, station)}>{station.iata} {station.name}</a>)}
                    </div>
                </div>
                <input type="hidden" name={`airports[newairport][customer_id]`} value={this.models('props.data.row.id')}/>
                <input type="hidden" name={`airports[newairport][airport_id]`} value={this.models('state.airport.id')}/>
                <MultiForm data={{select_charges:this.props.data.select_charges}} namespace={`airports[newairport]`} remove={this.removeContact} optional={true}/>
              </div>
              {this.state.airports.map(airport=><React.Fragment key={`tab-airport-${airport.id}`}>
                <div className={`tab-pane fade show ${airport.id==this.state.tab?'active':''}`} id={`v-pills-${airport.id}`} role="tabpanel" aria-labelledby={`v-pills-${airport.id}-tab`}>
                <input type="hidden" name={`airports[${airport.id}][customer_id]`} value={this.models('props.data.row.id')}/>
                <input type="hidden" name={`airports[${airport.id}][airport_id]`} value={this.cast(airport, 'airport_id')}/>
                <div className={`justify-content-between align-items-center d-flex`}>
	                <div className="font-16 my-3">
	                  {trans('Station')} {this.cast(airport, 'airport.iata')} - {this.cast(airport, 'airport.name')} - {trans('IMPC Par défaut')} : {this.cast(airport, 'airport.default_impc')}
	                </div>
	                <div>
	                	<button type="button" onClick={()=>this.remove(airport)} className="btn btn-danger text-light"><i className="fa fa-times-circle"></i> {trans("Supprimer la station")}</button>
	                </div>
	            </div>
                <MultiForm data={airport} namespace={`airports[${airport.id}]`} fwbCancelledNotifyUsersFieldName={`airports[${airport.id}][nsetup][fwb_cancelled_notify_users][]`} remove={this.removeContact} optional={true}/>
              </div>
                {airport.airlines.map(airline=><div key={`airport-${airport.id}-airline-${airline.id}`} className={`tab-pane fade show ${airport.id+'-'+airline.id==this.state.tab?'active':''}`} id={`v-pills-${airport.id}-${airline.id}`} role="tabpanel" aria-labelledby={`v-pills-${airport.id}-${airline.id}-tab`}>
                <div className={`justify-content-between align-items-center d-flex`}>
                    <div className="font-16 my-3">
                      {this.cast(airline, 'airline.name')} - {this.cast(airline, 'airline.iata_code')}
                    </div>
                    <div>
                      <button type="button" onClick={()=>this.removeAirline(airport, airline)} className="btn btn-danger text-light"><i className="fa fa-times-circle"></i> {trans("Supprimer la cie aérienne")}</button>
                    </div>
                </div>
                <div className='form-inline my-2 align-items-center'>
                  <label className="control-label mr-2">
                      {trans('Cover')} : 
                  </label>
                  <div className="custom-control custom-radio mr-2">
                      <input type="radio" id={`airports-${airport.id}-airlines-${airline.id}-nsetup-cover-1`} name={`airports[${airport.id}][airlines][${airline.id}][nsetup][cover]`} className="custom-control-input" defaultChecked={this.cast(airline, 'nsetup.cover', 1)==1} value="1"/>
                      <label className="custom-control-label" htmlFor={`airports-${airport.id}-airlines-${airline.id}-nsetup-cover-1`}>{trans('Oui')}</label>
                  </div>
                  <div className="custom-control custom-radio">
                      <input type="radio" id={`airports-${airport.id}-airlines-${airline.id}-nsetup-cover-0`} name={`airports[${airport.id}][airlines][${airline.id}][nsetup][cover]`} className="custom-control-input" defaultChecked={this.cast(airline, 'nsetup.cover', 0)==0} value="0"/>
                      <label className="custom-control-label" htmlFor={`airports-${airport.id}-airlines-${airline.id}-nsetup-cover-0`}>{trans('Non')}</label>
                  </div>
                </div>
                <input type="hidden" name={`airports[${airport.id}][airlines][${airline.id}][id]`} value={airline.id}/>
                  <Repository data={airline} prefix={`airports[${airport.id}][airlines][${airline.id}]`} selectEdis={this.props.data.select_edis}/>
                </div>)}
              </React.Fragment>)}
            </div>
          </div>
    </div>
  }
}

export default Modelizer(Airport);