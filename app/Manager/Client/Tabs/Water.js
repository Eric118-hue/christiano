import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';

class Water extends Component
{
  render() {
    return <div className={`tab-pane ${this.props.data.tab=='water'?'active':''}`}
        id={`water`} role="tabpanel" aria-labelledby="water-tab">
      Water Tab   
    </div>
  }
}

export default Modelizer(Water);