import React, { Component } from 'react';
import {store} from 'ryvendor/Ry/Core/Ry';

const Hooks = {}

export function hook(block, component_callback){
    if(!(block in Hooks)) {
        Hooks[block] = []
    }
    Hooks[block].push(component_callback)
    setTimeout(() => {
        store.dispatch({
            type : 'hooked',
            block: block
        })
    }, 0)
};

class Pg extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            t : new Date()
        }
        this.fire = this.fire.bind(this)
    }

    fire(block) {
        var ar = []
        if(block in Hooks) {
            for(var i=0; i<Hooks[block].length; i++) {
                let cb = Hooks[block][i]
                ar.push(cb(this.props))
            }
        }
        return ar
    }

    componentDidMount() {
        store.subscribe(()=>{
            const storeState = store.getState()
            if(storeState.type=='hooked') {
                this.setState({
                    t : new Date()
                })
            }
        })
    }

    render() {
        const current = this.props.breadcrumbs.itemListElement.pop()
        return <React.Fragment>
            <div className="row justify-content-between align-items-center m-0">
                <ul className="breadcrumbs-alt">
                    {this.props.breadcrumbs.itemListElement.map((breadcrumb, key)=><li key={`breadcrumb-${key}`}><a href={breadcrumb.href}>{breadcrumb.title}</a></li>)}
                    <li><a className="current">{current.title}</a></li>
                </ul>
                <div key={this.state.t}>
                    {this.fire('rightbreadcrumbs')}
                </div>
            </div>
            <div className="row mt-3">
                {this.props.children}
            </div>
        </React.Fragment>
    }
}

export default Pg;