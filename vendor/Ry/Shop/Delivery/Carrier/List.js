import React, {Component} from 'react';
import trans,  {nophoto, LOADINGEND, LOADINGSTART} from 'ryapp/translations';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import $ from 'jquery';
import Dropzone from "ryvendor/Ry/Core/dropzone";

class ImgInput extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data : this.models("props.data.data", {})
        }
        this.removePhoto = this.removePhoto.bind(this)
    }

    componentDidMount() {
        const dis = this
        const LOGOdzOpt = {
            url: this.props.url,
            paramName: 'file',
            params: {
                id: this.models('props.data.id')
            },
            dictCancelUpload: trans('Annuler'),
            dictCancelUploadConfirmation: trans("Êtes-vous certain d'annuler le transfert?"),
            acceptedFiles: '.png,.jpg,.jpeg,.gif',
            dictInvalidFileType: trans(`Ce type de fichier n'est pas pris en charge`),
            previewsContainer: ".dropzone-logo-previews",
            previewTemplate: `<div class="dz-preview dz-file-preview">
                <div class="dz-details">
                    <div class="dz-filename">
                        <span data-dz-name></span>
                    </div>
                </div>
                <div class="dz-progress">
                    <span class="dz-upload" data-dz-uploadprogress></span>
                </div>
                <div class="dz-error-message text-danger">
                    <span data-dz-errormessage></span>
                </div>
                <button type="button" class="btn btn-danger btn-circle" data-dz-remove><i class="fa fa-trash"></i></button>
            </div>`,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        };
        const LOGOdz = new Dropzone(dis.refs.logozone, LOGOdzOpt);
        const LOGOadded = (file) => {
            const imgContainer = $(dis.refs.logozone);
            var reader = new FileReader();

            reader.onload = function (e) {
                imgContainer.attr('src', e.target.result);
            };

            reader.readAsDataURL(file);
        };
        const LOGOsaved = (file, response) => {
            if (response.id) {
                dis.setState(state=>{
                  state.data=response
                  return state
                })
            }
        };
        LOGOdz.on('addedfile', LOGOadded);
        LOGOdz.on('success', LOGOsaved);
        LOGOdz.on("sending", ()=>LOADINGSTART("logo"));
        LOGOdz.on("complete", ()=>LOADINGEND("logo"));
        const LOGOdzBtn = new Dropzone(this.refs.logobtn, LOGOdzOpt);
        LOGOdzBtn.on('addedfile', LOGOadded);
        LOGOdzBtn.on('success', LOGOsaved);
        LOGOdzBtn.on("sending", ()=>LOADINGSTART("logo2"));
        LOGOdzBtn.on("complete", ()=>LOADINGEND("logo2"));
    }

    removePhoto() {
        this.refs.logozone.src = nophoto
        $(this.refs.nophoto).attr("checked", true)
    }

    render() {
      return <label ref="logobtn" className="mouse-pointable">
        <input type="hidden" name={this.props.name} value={this.models("state.data.id", '')}/>
        <img src={this.models("props.data.fullpath", nophoto)}
          className="img-fluid img-thumbnail rounded-circle icon-scale-down-54"
                                            ref="logozone"/>
        <div className="dropzone-logo-previews d-none"></div>
      </label>
    }
}

Modelizer(ImgInput)

class List extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      data : this.models('props.data.data', []),
      add : false
    }
    this.addCarrier = this.addCarrier.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }

  handleRemove(id) {
    $.ajax({
      url : trans('/shop/delivery/carrier'),
      type : 'delete',
      data : {
        id
      },
      success : response=>{
        this.setState(state=>{
          state.data = response.data
          return state
        })
      }
    })
  }

  componentDidMount() {
    this.props.store.subscribe(()=>{
      const storeState = this.props.store.getState()
      if(storeState.type=='carriers') {
        this.setState(state=>{
          state.data = storeState.data
          state.add = false
          return state
        })
      }
    })
  }

  addCarrier() {
    this.setState({
      add : true
    })
  }

  render() {
    return <div className="col-md-12">
      <div className="card">
        <form name="frm_carrier" method="post" action={trans('/shop/delivery/carrier')}>
          <div className="card-header">
            {trans('Transporteurs')}
          </div>
          <div className="card-body">
            <input name="ry" type="hidden"/>
            <table className="table">
              <thead>
                <tr>
                  <th style={{width:400}}>{trans('Nom')}</th>
                  <th style={{width:200}}>{trans('TVA')}</th>
                  <th style={{width:200}}>{trans('Délai')}</th>
                  <th>{trans('URL suivi')}</th>
                  <th style={{width:100}}>{trans('Icone')}</th>
                  <th style={{width:100}}>{trans('Position')}</th>
                  <th style={{width:100}}></th>
                </tr>
              </thead>
              <tbody>
                {this.models('state.data', []).map(item=><tr key={item.id}>
                  <td>
                    <input type="text" className="form-control" name={`carriers[${item.id}][name]`} required defaultValue={this.cast(item, 'name')}/>
                  </td>
                  <td>
                    <div className="input-group">
                      <input type="number" className="form-control" name={`carriers[${item.id}][nsetup][vat]`} defaultValue={this.cast(item.nsetup, 'vat')}/>
                      <div className="input-group-append">
                        <span className="input-group-text">
                          %
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="input-group">
                      <input type="number" className="form-control" name={`carriers[${item.id}][nsetup][delay][value]`} defaultValue={this.cast(item.nsetup, 'delay.value')}/>
                      <div className="input-group-append">
                        <span className="input-group-text">
                          {trans('jours')}
                        </span>
                      </div>
                      <input type="hidden" name={`carriers[${item.id}][nsetup][delay][unit]`} value="day"/>
                    </div>
                  </td>
                  <td>
                    <input type="url" className="form-control" name={`carriers[${item.id}][nsetup][tracking][url]`} defaultValue={this.cast(item.nsetup, 'tracking.url')}/>
                  </td>
                  <td>
                    <ImgInput data={this.cast(item, 'medias.0')} name={`carriers[${item.id}][medias][0][id]`} url={trans('/shop/delivery/carrier_upload')}/>
                  </td>
                  <td>
                    <input type="number" className="form-control" name={`carriers[${item.id}][nsetup][rank]`} defaultValue={this.cast(item.nsetup, 'rank')}/>
                  </td>
                  <td>
                    <button className="btn" type="button" onClick={()=>this.handleRemove(item.id)}>
                      <i className="fa fa-2x text-danger fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>)}
                {this.state.add?<tr>
                  <td>
                    <input type="text" className="form-control" name="carriers[0][name]" required/>
                  </td>
                  <td>
                    <div className="input-group">
                      <input type="number" className="form-control" name="carriers[0][nsetup][vat]"/>
                      <div className="input-group-append">
                        <span className="input-group-text">
                          %
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="input-group">
                      <input type="number" className="form-control" name="carriers[0][nsetup][delay][value]"/>
                      <div className="input-group-append">
                        <span className="input-group-text">
                          {trans('jours')}
                        </span>
                      </div>
                      <input type="hidden" name="carriers[0][nsetup][delay][unit]" value="day"/>
                    </div>
                  </td>
                  <td>
                    <input type="url" className="form-control" name="carriers[0][nsetup][tracking][url]"/>
                  </td>
                  <td>
                    <ImgInput url={trans('/shop/delivery/carrier_upload')} name={`carriers[0][medias][0][id]`}/>
                  </td>
                  <td>
                    <input type="number" className="form-control" name="carriers[0][nsetup][rank]"/>
                  </td>
                  <td>
                    <button className="btn">
                        <i className="fa fa-2x fa-check text-success"></i>
                    </button>
                  </td>
                </tr>:null}
              </tbody>
            </table>
          </div>
          <div className="card-footer">
            <div className="row justify-content-between">
              <button className="btn btn-primary" type="button" onClick={this.addCarrier}><i className="fa fa-plus"></i> {trans('Ajouter un transporteur')}</button>
              <button className="btn btn-primary">
                {trans('Enregistrer les modifications')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  }
}

export default Modelizer(List)