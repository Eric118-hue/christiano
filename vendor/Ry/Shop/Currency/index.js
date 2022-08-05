import React, { Component } from 'react';
import trans from '../../../../app/translations';
import $ from 'jquery';

class AwareInput extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			value : this.props.value,
			changed : false,
			initialValue : this.props.value
		};
		this.update = this.update.bind(this);
		this.save = this.save.bind(this);
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.props.value!==prevProps.value) {
			this.setState({value:this.props.value});
		}
	}
	
	update(event) {
		this.setState({value: event.target.value, changed:!this.props.frozen&&event.target.value!==this.state.initialValue});
	}
	
	save(event) {
		const dis = this;
		$.ajax({
			url : this.props.action,
			type : 'post',
			data : {
				id : this.props.id,
				value : this.state.value,
				name : this.props.name
			},
			success : function(){
				dis.setState({changed: false, initialValue: dis.state.value});
			}
		});
	}
	
	render() {
		return <div className="form-group form-inline">
			<label><span className={`mr-3 flag-icon flag-icon-${this.props.language==='en'?'gb':this.props.language}`}></span></label>
			<input type="text" name={this.props.name} className="form-control flex-fill" value={this.state.value} onChange={this.update}/>
			<button className={`btn btn-sm ${this.state.changed?'visible':'invisible'}`} onClick={this.save}><i className="fa fa-save fa-2x faa-flash animated"></i></button>
		</div>
	}
}

class Item extends Component
{
    constructor(props) {
        super(props)
        this.state = this.props.data
        this.save = this.save.bind(this)
    }

    save() {
        const dis = this
        $.ajax({
            url : 'currencies',
            type : 'post',
            data : {
                iso_code : this.refs.iso_code.state.value,
                name : this.refs.name.state.value
            },
            success : data => {
                dis.setState(state=>{
                    state.id = data.id
                    return state
                })
            }
        })
    }

    render() {
        const item = this.state
        return <tr>
            <td>
                <AwareInput ref="name" id={item.id} name="name" action="/currency_update" value={item.name} frozen={item.id==0}/>
            </td>
            <td>
                <AwareInput ref="iso_code" id={item.id} name="iso_code" action="/currency_update" value={item.iso_code}frozen={item.id==0}/>
            </td>
                <td>{item.id>0?<button className="btn" type="button" onClick={this.props.remove}><i className="fa fa-2x fa-trash-alt text-blue"></i></button>:<button className="btn" type="button" onClick={this.save}><i className="fa fa-2x fa-save fa-2x faa-flash animated text-blue"></i></button>}
                <input type="hidden" name="ry"/>
            </td>
        </tr>
    }
}

class List extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data : this.props.data.data.data
        }
        this.remove = this.remove.bind(this)
        this.add = this.add.bind(this)
    }

    remove(item) {
        const dis = this
        $.ajax({
            type : 'delete',
            url : '/currencies',
            data : {
                id : item.id
            },
            success : () => {
                dis.setState(state=>{
                    state.data = state.data.filter(it=>it.id!=item.id)
                    return state
                })
            }
        })
    }

    add() {
        this.setState(state=>{
            state.data.push(JSON.parse(JSON.stringify({id:0,name:'',iso_code:''})))
            return state
        })
    }

    render() {
        return <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    <h5>{trans('Codes devises')}</h5>
                </div>
                <div className="card-body">
                    <table className="table table-borderless">
                        <tbody>
                            <tr>
                                <th className="text-center">{trans('Nom')}</th>
                                <th className="text-center">{trans('Code')}</th>
                                <th></th>
                            </tr>
                            {this.state.data.map((item, key)=><Item key={`currency-${item.id}-${key}`} data={item} remove={()=>this.remove(item)}/>)}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer">
                    <button type="button" className="btn btn-primary" onClick={this.add}>{trans('Ajouter')} <i className="fa fa-plus"></i></button>
                </div>
            </div>
        </div>
    }
}

export default List;