import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import MultiForm from 'ryvendor/Ry/Admin/User/Multiform';
import trans from 'ryapp/translations';
import $ from 'jquery';
import swal from 'sweetalert2';

class Air extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      tab : this.models('props.data.row.facturable.airlines.0.id', 0),
      transports : this.models('props.data.row.facturable.airlines', [])
    }
    this.removeContact = this.removeContact.bind(this)
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
                        customer_id : dis.props.data.row.id
                    },
                    success : done
                })
            }
            else
                done()
        }
    })
  }

  render() {
    return <div className={`tab-pane ${this.props.data.tab=='air'?'active':''}`}
        id={`air`} role="tabpanel" aria-labelledby="air-tab">
          <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className="nav-link nav-primary" id={`v-pills-new-tab`} data-toggle="pill" href={`#v-pills-new`} role="tab" aria-controls={`v-pills-new`} aria-selected={this.state.tab=='new'?"true":"false"}>{trans('Ajouter une compagnie aérienne')}</a>
            {this.state.transports.map(transport=><a key={`pill-transport-${transport.id}`} class={`nav-link ${transport.id==this.state.tab?'active':''}`} id={`v-pills-${transport.id}-tab`} data-toggle="pill" href={`#v-pills-${transport.id}`} role="tab" aria-controls={`v-pills-${transport.id}`} aria-selected={transport.id==this.state.tab?"true":"false"}>{transport.name}</a>)}
          </div>
          <div class="tab-content" id="v-pills-tabContent">
            <div class="tab-pane fade" id="v-pills-new" role="tabpanel" aria-labelledby="v-pills-new-tab">
              <div className="form-group">
                <label className="control-label">{trans('Préfixe compagnie')}</label>
                  <input type="number" className="form-control" name="nsetup[lta][prefix]" defaultValue={this.models('props.data.row.nsetup.lta.prefix')}/>
              </div>
              <MultiForm data={this.props.data} remove={this.removeContact}/>
            </div>
            {this.state.transports.map(transport=><div key={`tab-transport-${transport.id}`} class={`tab-pane fade show ${transport.id==this.state.tab?'active':''}`} id={`v-pills-${transport.id}`} role="tabpanel" aria-labelledby={`v-pills-${transport.id}-tab`}>
              <div className="form-group">
                <label className="control-label">{trans('Préfixe compagnie')}</label>
                  <input type="number" className="form-control" name="nsetup[lta][prefix]" defaultValue={this.models('props.data.row.nsetup.lta.prefix')}/>
              </div>
              <MultiForm data={this.props.data} remove={this.removeContact}/>
            </div>)}
          </div>
    </div>
  }
}

export default Modelizer(Air);