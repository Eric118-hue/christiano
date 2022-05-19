import React, {Component} from 'react';
import $ from 'jquery';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';

class Autocomplete extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            search : '',
            show : false,
            items : [],
            selection : this.props.value
        }
        this.handleSelection = this.handleSelection.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState({
            show : !this.state.show
        })
    }

    handleSelection(event, item) {
        event.preventDefault()
        this.setState({
            search : '',
            show : false,
            selection : item
        })
        if(this.props.onChange) {
            this.props.onChange(item)
        }
        return false
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.props.readOnly)
            this.refs.input.focus()
        if(this.models('props.value.id', false) && this.cast(prevProps, 'value.id')!=this.models('props.value.id')) {
            this.setState({
                selection : this.props.value
            })
        }
    }

    handleSearch(event) {
        const value = event.target.value
        this.setState({
            search : value
        })

        if(value.length>1) {
            if(this.ax) {
                this.ax.abort()
            }
            let data = {
                json : true
            }
            data[this.props.param?this.props.param:'q'] = value
            this.ax = $.ajax({
                url : this.props.endpoint,
                data : data,
                success : response=>{
                    if(response.data && 'data' in response.data) {
                        this.setState({
                            show : true,
                            items : response.data.data
                        })
                    }
                    else {
                        this.setState({
                            show : true,
                            items : response
                        })
                    }
                }
            })
        }
    }

    render() {
        return <React.Fragment>
            {this.state.selection?this.props.selection(this.state.selection):<span onClick={this.toggle} className="mouse-pointable">{this.props.placeholder}<input type="hidden" value="" required/></span>}
            {this.props.readOnly?null:<React.Fragment>
                <button className={`btn ${this.props.buttonClass} ${this.state.show?'btn-outline-dark':''}`} type="button" onClick={this.toggle}><i className="fa fa-pencil-alt text-body"></i></button>
                <div className={`dropdown-menu w-100 ${this.state.show?'show':''}`}>
                    <div className="form-group pl-2 pr-2">
                        <input type="text" ref="input" className="form-control" placeholder={this.props.placeholder} value={this.state.search} onChange={this.handleSearch}/>
                    </div>
                    <div className="overflow-auto" style={{maxHeight:200}}>
                        {this.state.items.map(item=><a key={`${this.id}-${item.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelection(e, item)}>{this.props.line(item)}</a>)}
                    </div>
                </div>
            </React.Fragment>}
        </React.Fragment>
    }
}

export default Modelizer(Autocomplete)