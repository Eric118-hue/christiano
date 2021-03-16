import React, {Component} from 'react';
import moment from 'moment';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import $ from 'jquery';
import numeral from 'numeral';

const MPITENDRY = [
    {
        id : 1,
        name : 'Landry'
    }, 
    {
        id : 2,
        name : 'Rudy'
    }, 
    {
        id : 3,
        name : 'Gérard'
    }, 
    {
        id : 4,
        name : 'Jonathan'
    },
    {
        id : 5,
        name : 'Janick'
    },
    {
        id : 6,
        name : 'Mihaja'
    },
    {
        id : 7,
        name : 'Eymeric'
    },
    {
        id : 8,
        name : 'Sissi'
    },
    {
        id : 9,
        name : 'Nathanael'
    },
    {
        id : 10,
        name : 'Dominique',
        disabled : true
    }
]

const DATES = [
    {
        date : '2020-02-09',
        hours : [
            {
                from : '06:30:00',
                to : '08:45:00',
                principal : 1,
                secondaire : 6
            },
            {
                from : '08:30:00',
                to : '10:30:00',
                principal : 2,
                secondaire : 7
            },
            {
                from : '17:00:00',
                to : '19:00:00',
                principal : 3,
                secondaire : 8,
                checked : false
            }
        ]
    },
    {
        date : '2020-02-16',
        hours : [
            {
                from : '06:30:00',
                to : '08:45:00',
                principal : 1,
                principal : 4,
                secondaire : 3
            },
            {
                from : '08:30:00',
                to : '10:30:00',
                principal : 5,
                secondaire : 1,
            },
            {
                from : '17:00:00',
                to : '19:00:00',
                principal : 6,
                secondaire : 2,
                checked : false
            }
        ]
    },
    {
        date : '2020-02-22',
        event : 'Bapteme',
        hours : [{
            from : '08:00:00',
            to : '11:00:00',
            principal : 1
        }]
    },
    {
        date : '2020-02-23',
        hours : [
            {
                from : '06:30:00',
                to : '08:45:00',
                principal : 7,
                secondaire : 3
            },
            {
                from : '08:30:00',
                to : '10:30:00',
                principal : 8,
                secondaire : 4
            },
            {
                from : '17:00:00',
                to : '19:00:00',
                principal : 9,
                secondaire : 5
            }
        ]
    },
    {
        date : '2020-03-01',
        event : 'Karemy 1',
        hours : [
            {
                from : '06:30:00',
                to : '08:45:00',
                secondaire : 3
            },
            {
                from : '08:30:00',
                to : '10:30:00',
                secondaire : 4
            },
            {
                from : '17:00:00',
                to : '19:00:00'
            }
        ]
    },
    {
        date : '2020-03-08',
        event : 'Karemy 2',
        reserve : [5],
        hours : [
            {
                from : '06:30:00',
                to : '08:45:00'
            },
            {
                from : '08:30:00',
                to : '10:30:00',
                secondaire : 5
            },
            {
                from : '17:00:00',
                to : '19:00:00'
            }
        ]
    },
    {
        date : '2020-03-15',
        event : 'Karemy 3',
        exclude : [1],
        hours : [
            {
                from : '06:30:00',
                to : '08:45:00',
                principal : 5
            },
            {
                from : '08:30:00',
                to : '10:30:00',
                principal : 6
            },
            {
                from : '17:00:00',
                to : '19:00:00',
                principal : 1
            }
        ]
    },
    {
        date : '2020-09-12',
        exclude : [2, 4, 5, 8, 10],
        reserve : [9],
        hours : [
            {
                from : '17:00:00',
                to : '19:00:00',
                principal : 9
            }
        ]
    },
    {
        date : '2020-09-13',
        exclude : [2, 4, 5, 8, 10],
        hours : [
            {
                from : '06:00:00',
                to : '08:45:00',
                principal : 1,
                secondaire : 7
            },
            {
                from : '08:30:00',
                to : '10:30:00',
                principal : 3,
                secondaire : 9
            },
            {
                from : '17:00:00',
                to : '19:00:00',
                principal : 6
            }
        ]
    },
    {
        date : '2020-09-19',
        exclude : [2, 4, 5, 8, 10],
        reserve : [9],
        hours : [
            {
                from : '17:00:00',
                to : '19:00:00',
                principal : 9
            }
        ]
    },
    {
        date : '2020-09-20',
        exclude : [2, 4, 5, 8, 10],
        hours : [
            {
                from : '06:00:00',
                to : '08:45:00',
                principal : 3,
                secondaire : 6
            },
            {
                from : '08:30:00',
                to : '10:30:00',
                principal : 3,
                secondaire : 7
            },
            {
                from : '17:00:00',
                to : '19:00:00',
                principal : 1
            }
        ]
    },
    {
        date : '2020-09-24',
        event : "Tridium Fetim-piangonana",
        exclude : [2, 4, 5, 8, 10],
        reserve : [6, 3],
        hours : [
            {
                from : '17:30:00',
                to : '19:00:00',
                principal : 6
            }
        ]
    },
    {
        date : '2020-09-25',
        event : "Tridium Fetim-piangonana",
        exclude : [2, 4, 5, 8, 10],
        reserve : [7, 3],
        hours : [
            {
                from : '17:30:00',
                to : '19:00:00',
                principal : 7
            }
        ]
    },
    {
        date : '2020-09-26',
        event : "Tridium Fetim-piangonana",
        exclude : [2, 4, 5, 8, 10],
        hours : [
            {
                from : '17:00:00',
                to : '19:00:00',
                principal : 3
            }
        ]
    },
    {
        date : '2020-09-27',
        event : "Fetim-piangonana",
        exclude : [2, 4, 5, 8, 10],
        hours : [
            {
                from : '06:00:00',
                to : '08:30:00',
                principal : 3,
                secondaire : 7 
            },
            {
                from : '08:30:00',
                to : '11:00:00',
                principal : 1,
                secondaire : 9 
            },
            {
                from : '06:00:00',
                to : '08:30:00',
                principal : 7
            }
        ]
    },
    {
        date : '2020-10-03',
        event : 'Visite pastorale sady confirmation',
        exclude : [2, 4, 8, 10, 5],
        reserve : [9],
        hours : [
            {
                from : '17:00:00',
                to : '19:00:00'
            }
        ]
    },
    {
        date : '2020-10-04',
        event : 'Visite pastorale sady confirmation',
        exclude : [2, 4, 10],
        reserve : [5],
        hours : [
            {
                from : '06:00:00',
                to : '08:30:00'
            },
            {
                from : '08:30:00',
                to : '11:00:00',
                principal : 5
            },
            {
                from : '17:00:00',
                to : '19:00:00'
            },
        ]
    },
    {
        date : '2020-10-11'
    },
    {
        date : '2020-10-18'
    },
    {
        date : '2020-10-25'
    },
    {
        date : '2020-11-01',
        event : 'Toussaint'
    },
    {
        date : '2020-11-08'
    },
    {
        date : '2020-11-15'
    },
    {
        date : '2020-11-22'
    },
    {
        date : '2020-11-29',
        event : 'Avent 1'
    },
    {
        date : '2020-12-06',
        event : 'Avent 2'
    },
    {
        date : '2020-12-13',
        event : 'Avent 3'
    },
    {
        date : '2020-12-20',
        event : 'Avent 4'
    },
    {
        date : '2020-12-25',
        event : 'Noely'
    },
    {
        date : '2020-12-27'
    }
]

const HOURS = [
    {
        from : '06:30:00',
        to : '08:45:00'
    },
    {
        from : '08:30:00',
        to : '10:30:00'
    },
    {
        from : '17:00:00',
        to : '19:00:00'
    }
]

let iAnjara = 0
let QUOTA_DECREMENTOR = 1

class Anjara
{
    constructor(hour) {
        iAnjara++
        this.index = iAnjara
        this.from = hour.from
        this.to = hour.to
        this.principal = MPITENDRY.find(it=>it.id==hour.principal)
        this.secondaire = MPITENDRY.find(it=>it.id==hour.secondaire)
    }
}

class Mpitendry
{
    constructor(data, quota) {
        this.data = data
        this.quota = quota
        this.mitendry = this.mitendry.bind(this)
        this.cancel_mitendry = this.cancel_mitendry.bind(this)
        this.tourindexes = [-1]
        this.tourindex = this.tourindexes[this.tourindexes.length-1]
        this.disabled = data.disabled
        this.anjaras = [moment('2019-01-01').clone()]
        this.last_anjara = this.anjaras[this.anjaras.length-1]
    }

    mitendry(date, tourindex) {
        this.quota = this.quota - QUOTA_DECREMENTOR
        this.anjaras.push(date)
        this.last_anjara = this.anjaras[this.anjaras.length-1]
        this.tourindexes.push(tourindex)
        this.tourindex = this.tourindexes[this.tourindexes.length-1]
    }

    cancel_mitendry(from_date) {
        let n = this.anjaras.filter(it=>it.isSameOrAfter(from_date)).length
        this.quota = this.quota + n*QUOTA_DECREMENTOR
        this.anjaras.splice(-n, n)
        this.last_anjara = this.anjaras[this.anjaras.length-1]
        this.tourindexes.splice(-n, n)
        this.tourindex = this.tourindexes[this.tourindexes.length-1]
    }
}

let hours = []
DATES.map(date=>{
    let date_hours = []
    if(date.hours) {
        hours = hours.concat(date.hours)
        date.hours.map(hour=>{
            date_hours.push(new Anjara(hour))
        })
        date.hours = date_hours
    }
    else {
        hours = hours.concat(HOURS)
        HOURS.map(hour=>{
            date_hours.push(new Anjara(hour))
        })
    }
    date.hours = date_hours
})

let Ompitendry = []
MPITENDRY.map(mpitendry=>{
    Ompitendry.push(new Mpitendry(mpitendry, hours.length/MPITENDRY.length*2))
})
QUOTA_DECREMENTOR = 0.9

class OrganisteHour extends Component
{
    constructor(props) {
        super(props)
        let sum = 0
        this.principalImposed = false
        this.secondaireImposed = false
        Ompitendry.map(mpitendry=>{
            sum += mpitendry.quota
        })
        this.resolveSelect = this.resolveSelect.bind(this)
        this.updateMpitendry = this.updateMpitendry.bind(this)
        
        let average = sum / Ompitendry.filter(it=>!it.disabled && this.models('props.exclude', []).indexOf(it.id)<0).length
        let select_principal = this.resolveSelect(Math.floor(average))
        let principal = Ompitendry.find(it=>it.data.id==this.models('props.data.principal.id'))
        if(!principal)
            principal = select_principal[0]
        else
            this.principalImposed = true
        if(principal)
            principal.mitendry(this.props.date.clone(), this.props.tourindex)
        let select_secondaire = this.resolveSelect(Math.floor(average))
        let secondaire = Ompitendry.find(it=>it.data.id==this.models('props.data.secondaire.id'))
        if(!secondaire)
            secondaire = select_secondaire[0]
        else
            this.secondaireImposed = true
        if(secondaire)
            secondaire.mitendry(this.props.date.clone(), this.props.tourindex)
        this.state = {
            principal,
            secondaire,
            select_principal,
            select_secondaire,
            debug : {
                average,
                Ompitendry
            }
        }
        this.principalChange = this.principalChange.bind(this)
        this.secondaireChange = this.secondaireChange.bind(this)
    }

    updateMpitendry() {
        let sum = 0
        Ompitendry.map(mpitendry=>{
            sum += mpitendry.quota
        })
        let average = sum / Ompitendry.length
        if(!this.principalImposed) {
            if(this.state.principal)
                this.state.principal.cancel_mitendry(this.props.date)
            if(this.state.secondaire)
                this.state.secondaire.cancel_mitendry(this.props.date)
            let select_principal = this.resolveSelect(Math.floor(average))
            let principal = Ompitendry.find(it=>it.data.id==this.models('props.data.principal.id'))
            if(!principal)
                principal = select_principal[0]
            if(principal)
                principal.mitendry(this.props.date.clone(), this.props.tourindex)
            this.setState({
                principal,
                select_principal
            })
        }
        if(!this.secondaireImposed) {
            let select_secondaire = this.resolveSelect(Math.floor(average))
            let secondaire = Ompitendry.find(it=>it.data.id==this.models('props.data.secondaire.id'))
            if(!secondaire)
                secondaire = select_secondaire[0]
            if(secondaire)
                secondaire.mitendry(this.props.date.clone(), this.props.tourindex)
            this.setState({
                secondaire,
                select_secondaire
            })
        }
        window.setTimeout(()=>{
            $(this.refs.principal).selectpicker('refresh')
            $(this.refs.secondaire).selectpicker('refresh')
        }, 0)
    }

    componentDidMount() {
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='update' && moment(this.props.date).isAfter(storeState.date)) {
                this.updateMpitendry()
            }
        })
    }

    resolveSelect(minquota) {
        let tourindex = this.props.tourindex == 0 ? 2 : (this.props.tourindex==1?0:1)
        const CriticalHourInterval = 16
        let selection = Ompitendry.filter(mpitendry=>{
            let talou = moment(this.props.date)
            return !mpitendry.disabled && moment(mpitendry.last_anjara).isBefore(talou.subtract(CriticalHourInterval, 'hour')) && mpitendry.quota>=minquota && (this.models('props.reserve', []).length>0?this.models('props.reserve', []).indexOf(mpitendry.data.id)>=0:this.models('props.exclude', []).indexOf(mpitendry.data.id)<0)
        })
        if(selection.length==0 && minquota>0)
            return this.resolveSelect(minquota-1)
        return selection
    }

    principalChange(event) {
        const value = event.target.value
        this.setState(state=>{
            if(state.principal)
                state.principal.cancel_mitendry(this.props.date)
            state.principal = Ompitendry.find(it=>it.data.id==value)
            state.principal.mitendry(this.props.date.clone(), this.props.tourindex)
            return state
        })
        window.setTimeout(()=>{
            this.props.store.dispatch({type:'update',date:this.props.date})
        }, 0)
    }

    secondaireChange(event) {
        const value = event.target.value
        this.setState(state=>{
            if(state.secondaire)
                state.secondaire.cancel_mitendry(this.props.date)
            state.secondaire = Ompitendry.find(it=>it.data.id==value)
            state.secondaire.mitendry(this.props.date.clone(), this.props.tourindex)
            return state
        })
        window.setTimeout(()=>{
            this.props.store.dispatch({type:'update',date:this.props.date})
        }, 0)
    }

    render() {
        return <div className="col-md-4">
        <div><strong>{this.props.data.index}</strong> : {this.props.data.from} - {this.props.data.to}</div>
        {(this.props.date.isAfter(moment()) && !this.principalImposed)?<div className="form-group">
            <select ref="principal" className="form-control" value={this.models('state.principal.id')} onChange={this.principalChange}>
                {this.state.select_principal.map(mpitendry=><option value={mpitendry.data.id} key={mpitendry.data.id}>{mpitendry.data.name} ({numeral(mpitendry.quota).format('0.00')} restants)</option>)}
            </select>
        </div>:<div className="border mb-2 bg-light">{this.models('state.principal.data.name')} ({this.models('state.principal.quota', 0)} restants)</div>}
        {(this.props.date.isAfter(moment()) && !this.secondaireImposed)?<div className="form-group">
            <select ref="secondaire" className="form-control" value={this.models('state.secondaire.id')} onChange={this.secondaireChange}>
                {this.state.select_secondaire.map(mpitendry=><option key={mpitendry.data.id} value={mpitendry.data.id}>{mpitendry.data.name} ({numeral(mpitendry.quota).format('0.00')} restants)</option>)}
            </select>
        </div>:<div className="border mb-2 bg-light">{this.models('state.secondaire.data.name')} ({this.models('state.secondaire.quota', 0)} restants)</div>}
    </div>
    }
}

Modelizer(OrganisteHour)

class OrganisteDate extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            data : this.props.data
        }
    }

    render() {
        return <div className="pb-4 border-bottom mb-4">
            <h5>{moment(this.props.data.date).format('dddd D MMMM YYYY')}</h5>
            {this.props.data.event?<h6 className="text-secondary">{this.props.data.event}</h6>:null}
            <div className="row">
                {this.state.data.hours.map((hour, index)=><OrganisteHour store={this.props.store} key={index} data={hour} date={moment(this.props.data.date+' '+hour.from)} tourindex={index} exclude={this.models('props.data.exclude', [])} reserve={this.models('props.data.reserve', [])} places={this.models('props.data.places', 2)}/>)}
            </div>
        </div>
    }
}

Modelizer(OrganisteDate)

class App extends Component
{
    render() {
        return <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    {DATES.map((date, index)=><OrganisteDate store={this.props.store} key={index} data={date}/>)}
                </div>
            </div>
        </div>
    }
}

export default App;