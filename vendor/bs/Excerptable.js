import React, {Component} from 'react';
import $ from 'jquery';
import trans from 'ryapp/translations';
import './Excerptable.scss';

class Excerptable extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            need_excerpt : true,
            excerpt : true,
            strlen : 140
        }
        this.toggleExcerpt = this.toggleExcerpt.bind(this)
    }

    toggleExcerpt(e) {
        e.preventDefault()
        this.setState(state=>{
            state.excerpt = !state.excerpt
            return state
        })
    }

    componentDidMount() {
        const content = $(this.refs.longtext).text()
        if(content.length>this.state.strlen)
            $(this.refs.excerpt).text(content.substr(0, this.state.strlen))
        else
            this.setState({
                need_excerpt: false
            })
    }

    render() {
        if(!this.state.need_excerpt) {
            return <div dangerouslySetInnerHTML={{__html:this.props.children}}>     
            </div>
        }
        return <div className={`excerptable ${this.state.excerpt?'':'longtext'}`}>
            <div className="excerpt">
                <span ref="excerpt"></span>... <a className="text-orange" href="#" onClick={this.toggleExcerpt}>{trans('Lire la suite')} <i className="fa fa-caret-down"></i></a>
            </div>
            <div className="longtext" onClick={this.toggleExcerpt} ref="longtext" dangerouslySetInnerHTML={{__html:this.props.children}}>     
            </div>
        </div>
    }
}

export default Excerptable;