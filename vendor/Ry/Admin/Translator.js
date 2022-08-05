import React, { Component } from 'react';
import trans from '../../../app/translations';
import $ from 'jquery';
import swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import 'font-awesome-animation/dist/font-awesome-animation.min.css';
import {logo, languages} from '../../../env';
import PropTypes from 'prop-types';
import AwareInput from '../Core/Controls/AwareInput';

export class Languages extends Component
{
	constructor(props) {
		super(props)
		let available_languages = languages.filter(language=>this.props.data.data.languages.indexOf(language.code)<0).sort((a,b)=>a.code.localeCompare(b.code))
		this.state = {
			tick : 0,
			selection : available_languages[0].code,
			languages : this.props.data.data.languages,
			available_languages : available_languages
		}
		this.addLanguage = this.addLanguage.bind(this)
		this.selectHandler = this.selectHandler.bind(this)
		this.removeLanguage = this.removeLanguage.bind(this)
	}

	addLanguage() {
		this.setState(state=>{
			let ar = languages.filter(language=>language.code==state.selection)
			if(ar.length>0) {
				state.tick++;
				state.languages.push(ar[0])
				let codes = []
				state.languages.map(item=>{
					codes.push(item.code)
				})
				state.available_languages = languages.filter(item=>codes.indexOf(item.code)<0).sort((a,b)=>a.code.localeCompare(b.code))
				state.selection = state.available_languages[0].code
				$.ajax({
					type : 'post',
					url : '/languages',
					data : {
						languages : state.languages
					}
				})
			}
			return state
		})
		window.setTimeout(()=>{
			$(this.refs.selectlang).selectpicker("refresh")
		}, 1)
	}

	removeLanguage(language) {
		this.setState(state=>{
			state.languages = state.languages.filter(item=>item.id!=language.id)
			$.ajax({
				type : 'post',
				url : '/languages',
				data : {
					languages : state.languages
				}
			})
			return state
		})
	}

	selectHandler(event) {
		this.setState({
			selection : event.target.value
		})
	}

	render() {
		return <div className="col-md-12">
				<div className="card">
					<div className="card-header">
						{trans('Langues')}
					</div>
					<div className="card-body">
						<table className="table">
							<thead>
								<tr>
									<th></th>
									<th>{trans("Langues")}</th>
									<th className="text-center">{trans("Supprimer")}</th>
								</tr>
							</thead>
							<tbody>
								{this.state.languages.map(language=><tr key={`language-${language.id}`}>
									<td className="text-center"><span className={`mr-3 flag-icon flag-icon-${language.code=='en'?'gb':language.code}`}></span></td>
									<td className="text-uppercase">{language.french}</td>
									<td className="text-center"><button type="button" className="btn btn-outline-danger" onClick={()=>this.removeLanguage(language)}><i className="fa fa-trash-alt"></i></button></td>
								</tr>)}
							</tbody>
							<tfoot>
								<tr>
									<td></td>
									<td></td>
									<td>
										<select ref="selectlang" className="form-control" value={this.state.selection} onChange={this.selectHandler}>
											{this.state.available_languages.map(language=><option key={`language-inputs-${language.id}`} value={language.code} data-icon={`flag-icon flag-icon-${language.code=='en'?'gb':language.code} mr-4`}>
												{language.french.toUpperCase()}
											</option>)}
										</select>
									</td>
									<td className="text-center"><button type="button" className="btn btn-outline-success" onClick={this.addLanguage}><i className="fa fa-plus"></i> {trans('Ajouter')}</button></td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>
	}
}

class LanguagesFilterDialog extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			preset : trans('Préreglage plateforme'),
			presets : this.props.presets
		}
		this.savePreset = this.savePreset.bind(this)
		this.updatePreset = this.updatePreset.bind(this)
	}

	updatePreset(preset) {
		this.setState({preset:preset.name})
		this.props.onPreset(preset)
	}

	savePreset(e) {
        e.preventDefault()
        swal({
            title : trans('Nommer le préreglage'),
            type : 'question',
            input : 'text',
            showCancelButton: true,
            inputValidator: (value) => {
                return !value && trans('Vous devez nommer le préréglage')
            }
        }).then((response)=>{
            if(response.value) {
                $(this.refs.preset).val(response.value)
                this.setState({preset:response.value})
            }
        })
        return false;
    }

	render() {
		let preset = null
		if(this.props.presets) {
			preset = <li key="traductions-actions" className="nav-item dropdown"><a className="nav-link dropdown-toggle"
				href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
				aria-haspopup="true" aria-expanded="false">{this.state.preset}</a>
				<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					{this.props.presets.map((preset, key)=><a key={`languages-preset-${key}`} className="dropdown-item" href="#" onClick={()=>this.updatePreset(preset)}>{preset.name}</a>)}
					<div className="dropdown-divider"></div>
					<a className="dropdown-item" href="#" onClick={this.savePreset}>{trans("Enregistrer le préreglage")}</a>
					<input type="hidden" name={this.props.presetName} ref="preset"/>
				</div>
			</li>
		}
		return <nav className="navbar navbar-expand-lg navbar-light bg-light">
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarFilterContent" aria-controls="navbarFilterContent" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>

			<div className="collapse navbar-collapse" id="navbarFilterContent">
				{this.props.prelinks}
				<ul className="navbar-nav mr-auto">
					{preset}
					{this.props.links}
				</ul>
				<div className="form-inline my-2 my-lg-0">
					<i className="fa fa-filter mr-3"></i>
					<input className="form-control mr-sm-2" type="search" value={this.props.searchstring} placeholder={trans('Filtre rapide')} aria-label={trans('Filtre rapide')} onChange={this.props.onSearchChange}/>
					<button type="button" className="btn btn-primary my-2 my-sm-0" onClick={this.props.onSearchClick}><i className="fa fa-search"></i></button>
					<button type="button" className="btn btn-default my-2 my-sm-0" onClick={this.props.showAll}>{trans('Tout afficher')}</button>
				</div>
			</div>
		</nav>
	}
}

export class TraductionsDialog extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			searchstring : '',
			languages : languages
		}
		this.onSearchClick = this.onSearchClick.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
		this.showAll = this.showAll.bind(this)
		this.onPreset = this.onPreset.bind(this)
	}

	onSearchChange(event) {
        let languageState = languages.filter(item=>{
			let regex = new RegExp(event.target.value)
			item.excluded = !(regex.test(item.french) || regex.test(item.english))
			return true
        })
        this.setState({searchstring:event.target.value, languages:languageState})
	}
	
	onPreset(preset) {
		let languageState = languages.filter(item=>{
			item.excluded = !(preset.languages.indexOf(item.code)>=0)
			return true
		})
		this.setState({languages:languageState,preset:preset.name})
	}

    onSearchClick(event) {
        let languageState = languages.filter(item=>{
            let regex = new RegExp(this.state.searchstring)
			item.excluded = !(regex.test(item.french) || regex.test(item.english))
			return true
        })
        this.setState({languages:languageState})
    }

    showAll(event) {
		let languageState = languages.filter(item=>{
			item.excluded = false
			return true
        })
        this.setState({languages:languageState})
	}

	render() {
		let prelinks = [<div key="traduction-fr" className="form-inline my-2 my-lg-0">
			<label><span className={`mr-3 flag-icon flag-icon-${this.props.data.locale=='en'?'gb':this.props.data.locale}`}></span></label>
			<input type="text" required className="form-control flex-fill" name={`lang[${this.props.data.locale}]`}/>
		</div>]
		return <form action="/translations_insert" method="post" name="frm_languages">
			<div className="modal-header">
				<h5 className="modal-title">
					<i className="fa fa-language"></i> {trans("Ajouter une traduction")}
				</h5>
				<button type="button" className="close" data-dismiss="modal"
					aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			{!this.props.data.languages?<LanguagesFilterDialog searchstring={this.state.searchstring} onSearchChange={this.onSearchChange} onSearchClick={this.onSearchClick} showAll={this.showAll} onPreset={this.onPreset} presets={this.props.data.presets} presetName="preset"/>:null}
			<div className="modal-body">
				<div className="row">
					{this.state.languages.filter(it=>{
						let ret = true;
						if(this.props.data.languages) {
							ret = this.props.data.languages.find(it2=>it2==it.code)
						}
						return ret
					}).map(language=><div key={`language-inputs-${language.id}`} className={`form-inline my-2 mb-3 col-4 ${(language.excluded && $(`[name="lang[${language.code}]"]`).val()=='')?'d-none':''}`}>
						<label><span className={`mr-3 flag-icon flag-icon-${language.code=='en'?'gb':language.code}`}></span></label>
						<input type="text" className="form-control flex-fill" defaultValue="" placeholder={language.french} name={`lang[${language.code}]`}/>
					</div>)}	
				</div>
			</div>
			<div className="modal-footer">
				<button type="button" className="btn btn-secondary" data-dismiss="modal">{trans("Fermer")}</button>
				<button type="submit" className="btn btn-primary">{trans("Enregistrer")}</button>
			</div>
		</form>
	}
}

class StringRow extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			strings: this.props.item.strings,
			removing: false
		};
		this.remove = this.remove.bind(this);
		this.copy = this.copy.bind(this)
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.props.item.id!==prevProps.item.id) {
			let strings = this.props.item.strings;
			this.setState({strings});
		}
	}

	copy(event) {
		event.preventDefault();
		this.refs.code.focus()
		this.refs.code.select()
		document.execCommand('copy')
		this.props.store.dispatch({
			type : 'toast',
			payload : {
				sender : {
					name : 'Centrale',
					thumb : logo
				},
				message : `${trans('Copié')} !`,
				updated_at : 'now'
			}
		})
		return false;
	}
	
	remove(event) {
		event.preventDefault();
		const dis = this;
		swal({
			  title: trans('Confirmez-vous la suppression?'),
			  text: trans('Cet enregistrement sera supprimé définitivement'),
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonText: trans('Oui je confirme')
		}).then((result) => {
			  if (result.value) {
				  dis.setState({
						removing: true
					});
					$.ajax({
						url : trans('/translations'),
						type: 'delete',
						data : {
							translation_id : this.props.item.id
						},
						success : function(){
							dis.props.parent.remove(dis.props.index);
							swal(
						      trans('Supprimé'),
						      trans("L'enregistrement a été supprimé"),
						      'success'
						    )
						},
						error : function(){
							dis.setState({
								removing: false
							});
						}
					});
			  }
		})
		return false;
	}
	
	render() {
		return <div className={`col-md-6 pt-4 mb-3 ${this.state.removing?'alpha-10':''}`}>
			<div className='form-group'>
				<input ref="code" type="text" defaultValue={this.props.item.code} readOnly className="form-control"/>
			</div>
			{this.props.languages.map((language, key)=><AwareInput key={`${this.props.pkey}-${key}`} translation_id={this.props.item.id} value={this.state.strings[language]?this.state.strings[language]:''} language={language}/>)}
			<div className='d-flex border-bottom d-flex justify-content-end pb-3'>
				<div className="btn-group">
					<a href="#" onClick={this.remove} className={`btn btn-orange ${this.state.removing?'disabled':''}`}><i className={`fa fa-times-circle`}></i> {trans('Supprimer')}</a>
				</div>
			</div>
		</div>
	}
}

export class LanguagesFilter extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			preset : trans('Préreglage plateforme'),
			presets : this.props.presets
		}
		this.savePreset = this.savePreset.bind(this)
		this.updatePreset = this.updatePreset.bind(this)
	}

	updatePreset(preset) {
		this.setState({preset:preset.name})
		this.props.onPreset(preset)
	}

	savePreset(e) {
        e.preventDefault()
        swal({
            title : trans('Nommer le préreglage'),
            type : 'question',
            input : 'text',
            showCancelButton: true,
            inputValidator: (value) => {
                return !value && trans('Vous devez nommer le préréglage')
            }
        }).then((response)=>{
            if(response.value) {
                $(this.refs.preset).val(response.value)
                this.setState({preset:response.value})
            }
        })
        return false;
    }

	render() {
		let preset = null
		if(this.props.presets) {
			preset = <ul key="traductions-actions" className="nav">
				<li className="nav-item dropdown"><a className="nav-link dropdown-toggle"
					href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
					aria-haspopup="true" aria-expanded="false">{this.state.preset}</a>
					<div className="dropdown-menu" aria-labelledby="navbarDropdown">
						{this.props.presets.map((preset, key)=><a key={`languages-preset-${key}`} className="dropdown-item" href="#" onClick={()=>this.updatePreset(preset)}>{preset.name}</a>)}
						<div className="dropdown-divider"></div>
						<a className="dropdown-item" href="#" onClick={this.savePreset}>{trans("Enregistrer le préreglage")}</a>
						<input type="hidden" name={this.props.presetName} ref="preset"/>
					</div>
				</li>
			</ul>
		}
		return <div>
			{this.props.prelinks}
			{preset}
			<div key="navigation-links" className="row m-0 justify-content-between mb-3 mt-3">
				<a className="btn btn-primary" href="#dialog/translations_add">{trans("Ajouter une traduction")} <i className="fa fa-plus"></i></a>
				<div className="input-group w-50">
					<input className="form-control" type="search" value={this.props.searchstring} onChange={this.props.onSearchChange}/>
					<div className="input-group-append">
						<button type="button" className="btn btn-primary" onClick={this.props.onSearchClick}>{trans('Rechercher')} <i className='fa fa-search'></i></button>
					</div>
				</div>	
				<div>
					<a className="btn btn-outline-primary" href="#" onClick={this.props.toFirst}><i className="fa fa-angle-double-left"></i></a>
					<a className="btn btn-outline-primary ml-2" href="#" onClick={this.props.toPrevious}><i className="fa fa-angle-left"></i></a>
					<a className="btn btn-outline-primary ml-2" href="#" onClick={this.props.toNext}><i className="fa fa-angle-right"></i></a>
					<a className="btn btn-outline-primary ml-2" href="#" onClick={this.props.toLast}><i className="fa fa-angle-double-right"></i></a>
				</div>
			</div>
		</div>
	}
}

LanguagesFilter.propTypes = {
	toFirst:PropTypes.func,
	toNext:PropTypes.func,
	toPrevious:PropTypes.func,
	toLast:PropTypes.func,
	searchstring:PropTypes.string,
	onSearchClick:PropTypes.func.isRequired,
	onSearchChange:PropTypes.func.isRequired,
	showAll:PropTypes.func.isRequired
}

class Translator extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			data : this.props.data.data,
			searchstring : '',
			page : 1
		};
		this.onSearchChange = this.onSearchChange.bind(this);
		this.toFirst = this.toFirst.bind(this);
		this.toPrevious = this.toPrevious.bind(this);
		this.toNext = this.toNext.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
		this.showAll = this.showAll.bind(this);
		this.remove = this.remove.bind(this);
		this.toLast = this.toLast.bind(this);
	}
	
	remove(index) {
		let data = this.state.data;
		data.splice(index, 1);
		this.setState({data});
	}
	
	onSearchChange(event) {
		this.setState({
			searchstring : event.target.value
		});
		if(event.target.value.length>3) {
			if(this.xhr)
				this.xhr.abort();
			const dis = this;
			this.xhr = $.ajax({
				url : `${trans('/translations')}?json&s=${event.target.value}`,
				success : function(response){
					dis.setState({
						data : response.data.data
					});
				}
			});
		}
	}
	
	onSearchClick() {
		if(this.xhr)
			this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
			url : `${trans('/translations')}?json&s=${this.state.searchstring}`,
			success : function(response){
				dis.setState({
					data : response.data.data
				});
			}
		});
	}

	showAll() {
		this.setState({
			searchstring : ''
		});
		if(this.xhr)
			this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
			isPagination:true,
			url : `${trans('/translations')}?json&page=1`,
			success : function(response){
				dis.setState({
					page : 1,
					data : response.data.data
				});
			}
		});
	}
	
	toFirst(event) {
		event.preventDefault()
		if(this.xhr)
			this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
			isPagination:true,
			url : `${trans('/translations')}?json&page=1&s=${this.state.searchstring}`,
			success : function(response){
				dis.setState({
					page : 1,
					data : response.data.data
				});
			}
		});
	}
	
	toPrevious(event) {
		event.preventDefault()
		if(this.xhr)
			this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
			isPagination: true,
			url : `${trans('/translations')}?json&page=${this.state.page-1}&s=${this.state.searchstring}`,
			success : function(response){
				dis.setState({
					page : dis.state.page - 1,
					data : response.data.data
				});
			}
		});
		return false
	}
	
	toNext(event) {
		event.preventDefault()
		if(this.xhr)
			this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
			isPagination : true,
			url: `${trans('/translations')}?json&page=${this.state.page+1}&s=${this.state.searchstring}`,
			success : function(response){
				dis.setState({
					page : dis.state.page + 1,
					data : response.data.data
				});
			}
		});
		return false
	}

	toLast(event) {
		event.preventDefault()
		if(this.xhr)
			this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
			isPagination : true,
			url: `${trans('/translations')}?json&page=${this.props.data.last_page}&s=${this.state.searchstring}`,
			success : function(response){
				dis.setState({
					page : dis.state.page + 1,
					data : response.data.data
				});
			}
		});
		return false;
	}

	render() {
		let herited = {
			toFirst:this.toFirst,
			toNext:this.toNext,
			toPrevious:this.toPrevious,
			toLast:this.toLast,
			searchstring:this.state.searchstring,
			onSearchClick:this.onSearchClick,
			onSearchChange:this.onSearchChange,
			showAll:this.showAll,
			links:[
				<div key="navigation-links" className="row m-0 justify-content-between mb-3 mt-3">
					<a className="btn btn-primary" href="#dialog/translations_add">{trans("Ajouter une traduction")} <i className="fa fa-plus"></i></a>
					<div>
						<a className="btn btn-outline-primary" href="#" onClick={this.toFirst}><i className="fa fa-angle-double-left"></i></a>
						<a className="btn btn-outline-primary ml-2" href="#" onClick={this.toPrevious}><i className="fa fa-angle-left"></i></a>
						<a className="btn btn-outline-primary ml-2" href="#" onClick={this.toNext}><i className="fa fa-angle-right"></i></a>
						<a className="btn btn-outline-primary ml-2" href="#" onClick={this.toLast}><i className="fa fa-angle-double-right"></i></a>
					</div>
				</div>
			]
		}
		return <div className="col-12">
			<div className='card'>
				<div className='card-header'>
					<div className='row'>
						<div className='col text-uppercase'>
							{trans('Traductions')}
						</div>
					</div>
				</div>
				<div className='card-body'>
					<LanguagesFilter {...herited}/>
					<div className='row mt-3'>
						{this.state.data.map((item, key)=><StringRow key={`trans-${item.id}`} pkey={`trans-${key}`} index={key} parent={this} item={item} languages={this.props.languages} store={this.props.store}/>)}
					</div>
				</div>
			</div>
		</div>
	}
}

class List extends Component
{
	render() {
		return <Translator store={this.props.store} data={this.props.data.data} languages={this.props.data.languages}/>
	}
}

export default List;