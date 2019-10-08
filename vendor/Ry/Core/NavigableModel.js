import React, { Component } from 'react';
import $ from 'jquery';
import qs from 'qs';

class NavigableModel extends Component
{
    constructor(props) {
		super(props);
		this.state = {
            data : this.props.data.data,
            total : this.props.data.total,
			page : this.props.data.current_page ? this.props.data.current_page : 1
		};
		this.toFirst = this.toFirst.bind(this);
		this.toPrevious = this.toPrevious.bind(this);
        this.toNext = this.toNext.bind(this);
        this.toEnd = this.toEnd.bind(this);
        this.remove = this.remove.bind(this);
        this.searchEngine = this.searchEngine.bind(this);
        this.builPaginationFromQuery = this.builPaginationFromQuery.bind(this);
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const state = this.props.store.getState()
            if(state.type===this.model) {
                if(state.row && state.row.id) {
                    let prevState = this.state.data
                    const index = prevState.findIndex(item=> item.id===state.row.id)
                    let total = this.state.total
                    if(index>=0) {
                        prevState[index] = state.row
                    }
                    else {
                        prevState.push(state.row)
                        total++
                    }
                    this.setState({
                        data:prevState,
                        total:total
                    })
                }
                else if(state.data && state.data.data) {
                    this.setState({
                        data:state.data.data,
                        total:state.data.total
                    })
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
                dis.setState({
                    data : data,
                    total : dis.state.total - 1
                });
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
                            data : response.data.data,
                            total : response.data.total
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
                    data : response.data.data,
                    total : response.data.total
				});
			}
        });
        return false;
    }

    toPage(event, numpage) {
        event.preventDefault();
		if(this.xhr)
            this.xhr.abort();
		const dis = this;
		this.xhr = $.ajax({
            isPagination : true,
			url : this.builPaginationFromQuery(numpage),
			success : function(response){
				dis.setState({
					page : numpage,
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
                    data : response.data.data,
                    total : response.data.total
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
                    data : response.data.data,
                    total : response.data.total
				});
			}
        });
        return false;
    }
    
    builPaginationFromQuery(page) {
        let queries = qs.parse(document.location.search.replace(/^\?/, ''))
        queries.page = page
        queries.json = true
        return this.endpoint + '?' + qs.stringify(queries)
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
                    data : response.data.data,
                    total: response.data.total
				});
			}
        });
        return false;
    }

    searchEngine() {

    }
    
    render() {
        let pagination = <ul className={`list-inline m-0 ${this.props.data.per_page>=this.state.total?'d-none':''}`}>
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