import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';

class Land extends Component
{
  render() {
    return <div className={`tab-pane ${this.props.data.tab=='land'?'active':''}`}
        id={`land`} role="tabpanel" aria-labelledby="land-tab">
      Land Tab   
    </div>
  }
}

export default Modelizer(Land);