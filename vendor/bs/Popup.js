import React, { Component } from 'react';

export class PopupClose extends Component
{
    render() {
        return <button type="button" {...this.props} data-dismiss="modal">
            {this.props.children}
        </button>
    }
}

export class PopupFooter extends Component
{
    render() {
        return <div className={`modal-footer ${this.props.className?this.props.className:''}`}>
            {this.props.children}
        </div>
    }
}

export class PopupBody extends Component
{
    render() {
        return <div className="modal-body">
            {this.props.children}
        </div>
    }
}

export class PopupHeader extends Component
{
    render() {
        let closeBtn = this.props.closeButton
        if(!closeBtn)
            closeBtn = <span aria-hidden="true">&times;</span>
        return <div className={`modal-header ${this.props.className?this.props.className:''}`}>
            {this.props.children}
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                {closeBtn}
            </button>
        </div>
    }
}

export default class Popup extends Component
{
    render() {
        return <div id={this.props.id} className="modal fade" tabIndex="-1" role="dialog">
            <div className={`modal-dialog ${this.props.className?this.props.className:'modal-lg'}`} role="document">
                <div className="modal-content border-0">
                {this.props.children}
                </div>
            </div>
        </div>
    }
}