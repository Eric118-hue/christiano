import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import qs from 'qs';
import $ from 'jquery';

class PageEditor extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      language : this.models('props.data.language', 'fr')
    }
    this.handleLangChange = this.handleLangChange.bind(this)
  }

  handleLangChange(event) {
    const value = event.target.value
    document.location.href = document.location.pathname + '?' + qs.stringify({language:value})
  }

  componentDidMount() {
    CKEDITOR.replace(this.refs.page_content, {
      language: 'fr',
      height: 640
    });
  }

  render() {
    return <form name="frm_page" method="post" action="" className="col-md-12">
      <input type='hidden' name='_token' value={$('meta[name="csrf-token"]').attr('content')}/>
      <div className="form-group">
        <label className="control-label">{trans('Langue')}</label>
        <select className="form-control" name="language" defaultValue={this.models('props.data.language', 'fr')} onChange={this.handleLangChange}>
          {this.models('props.data.select_langs', []).map(language=><option key={language.code} value={language.code}>{language.french}</option>)}
        </select>
      </div>
      <div className="form-group">
        <textarea ref="page_content" className="form-control"
          defaultValue={this.models("props.data.page_content", '')}
          name="page_content">
        </textarea>
      </div>
      <button className="btn btn-primary">{trans('Enregistrer')}</button>
    </form>
  }
}

export default Modelizer(PageEditor)