import React, { Component } from 'react';
import $ from 'jquery';
import querystring from 'querystring';

class NavigableModel extends Component
{
    endpoint
    model

    constructor(props) {
		super(props);
		this.state = {
			data : this.props.data.data,
			page : this.props.data.current_page ? this.props.data.current_page : 1
		};
		this.toFirst = this.toFirst.bind(this);
		this.toPrevious = this.toPrevious.bind(this);
        this.toNext = this.toNext.bind(this);
        this.toEnd = this.toEnd.bind(this);
        this.remove = this.remove.bind(this);
        this.searchEngine = this.searchEngine.bind(this);
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const state = this.props.store.getState()
            if(state.type===this.model) {
                if(state.row && state.row.id) {
                    let prevState = this.state.data
                    const index = prevState.findIndex(item=> item.id===state.row.id)
                    if(index>=0) {
                        prevState[index] = state.row
                    }
                    else {
                        prevState.push(state.row)
                    }
                    this.setState({data:prevState})
                }
                else if(state.data && state.data.data) {
                    this.setState({data:state.data.data})
                }
            }
        })
    }

    item(item, key) {}

    beforelist() {}

    afterlist() {}
    
    remove(index, id, callbacks) {
        const dis = this
        if(this.xhr)
            this.xhr.abort();
        
        this.xhr = $.ajax({
            url : this.endpoint,
            type: 'delete',
            data : {
                id : id
            },
            success : ()=>{
                let data = dis.state.data;
                data.splice(index, 1);
                dis.setState({data});
                callbacks.success()
                //refresh
                if(dis.xhr)
                    dis.xhr.abort();
                let endpoint
                if(/\?/.test(dis.endpoint))
                    endpoint = `${dis.endpoint}&json&page=${dis.state.page}`
                else
                    endpoint = `${dis.endpoint}?json&page=${dis.state.page}`
                dis.xhr = $.ajax({
                    url : endpoint,
                    success : function(response){
                        dis.setState({
                            data : response.data.data
                        });
                    }
                });
            },
            error : callbacks.error
        });
	}

    toFirst(event) {
        event.preventDefault();
		if(this.xhr)
            this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
            isPagination : true,
			url : this.builPaginationFromQuery(1),
			success : function(response){
				dis.setState({
					page : 1,
					data : response.data.data
				});
			}
        });
        return false;
    }
    
    toEnd(event) {
        event.preventDefault();
		if(this.xhr)
            this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
            isPagination : true,
			url : this.builPaginationFromQuery(this.props.data.last_page),
			success : function(response){
				dis.setState({
					page : dis.props.data.last_page,
					data : response.data.data
				});
			}
        });
        return false;
	}
	
	toPrevious(event) {
        event.preventDefault();
		if(this.xhr)
            this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
            isPagination : true,
			url : this.builPaginationFromQuery(this.state.page-1),
			success : function(response){
				dis.setState({
					page : dis.state.page - 1,
					data : response.data.data
				});
			}
        });
        return false;
    }
    
    builPaginationFromQuery(page) {
        let queries = querystring.parse(document.location.search.replace(/^\?/, ''))
        queries.page = page
        queries.json = true
        return this.endpoint + '?' + querystring.stringify(queries)
    }
	
	toNext(event) {
        event.preventDefault();
		if(this.xhr)
            this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
            isPagination : true,
			url: this.builPaginationFromQuery(this.state.page+1),
			success : function(response){
				dis.setState({
					page : dis.state.page + 1,
					data : response.data.data
				});
			}
        });
        return false;
    }

    searchEngine() {

    }
    
    render() {
        let pagination = <ul className={`list-inline m-0 ${this.props.data.per_page>=this.props.data.total?'d-none':''}`}>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toFirst}><i className="fa fa-angle-double-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toPrevious}><i className="fa fa-angle-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toNext}><i className="fa fa-angle-right"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toEnd}><i className="fa fa-angle-double-right"></i></a>
            </li>
        </ul>

        return <div className="col-12">            
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {this.nopaginate?null:pagination}
            </div>
            {this.searchEngine()}
            {this.state.data.map((item, key)=>this.item(item, key))}
            <div className="justify-content-between m-0 row">
                {this.afterlist()}
                {this.nopaginate?null:pagination}
            </div>
        </div>
    }
}

export default NavigableModel;