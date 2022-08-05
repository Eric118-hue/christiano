import React, {Component} from 'react';
import Theme from 'Theme';

class Themes extends Component
{
    render() {
        return <Theme.Option.Tab data={this.props.data}/>
    }
}

export default Themes;