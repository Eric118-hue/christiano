import React, {Component} from 'react';

class Page extends Component
{
    render() {
        return <div className='col-md-12' style={{minHeight:'calc(100vh - 250px)'}} dangerouslySetInnerHTML={{__html:this.props.data.page_content}}>
            
        </div>
    }
}

export default Page;