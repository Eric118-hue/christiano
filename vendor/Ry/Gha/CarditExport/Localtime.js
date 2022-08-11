import React, {Component} from 'react';
import moment from 'moment-timezone';

class Localtime extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            t : moment()
        }
    }

    componentDidMount() {
        this.timer = window.setInterval(()=>{
            this.setState({
                t : moment()
            })
        }, 1000)
    }

    componentWillUnmount() {
        window.clearInterval(this.timer)
    }

    render() {
        return <React.Fragment>
            <input type="hidden" name="localtime" value={this.state.t.local().format("YYYY-MM-DD HH:mm:ss")}/>
            <input type="hidden" name="timezone" value={moment.tz.guess()}/>
        </React.Fragment>
    }
}

export default Localtime;