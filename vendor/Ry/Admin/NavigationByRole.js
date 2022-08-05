import React, {Component} from 'react';
import $ from 'jquery';
import Sortable from './Sortable';
import swal from 'sweetalert2';

class LayoutCard extends Component {
    constructor(props) {
        super(props)
        this.insertId = 0
        this.state = {
            allowed: this.props.allowed,
            tabs : this.props.content.sections
        }
        this.addTab = this.addTab.bind(this)
    }

    async addTab() {
        const {value : section} = await swal.fire({
            input: 'text',
            inputPlaceholder: 'Nom de la section',
            showCancelButton: true
        })
        if(section) {
            this.insertId--;
            this.setState(state=>{
                state.tabs.push({
                    active : true,
                    id : this.insertId,
                    layout_id : this.props.content.id,
                    name : section,
                    setup : []
                })
                return state
            })
        }
    }

    componentDidMount() {
        const collapse = this.refs.container;
        $(this.refs.toggler).on("click", function () {
            if ($(this).is(":checked"))
                $(collapse).collapse('show');
            else
                $(collapse).collapse('hide');
        });
    }

    render() {
        return <div className="card">
            <div className="card-header mouse-pointable" onClick={() => $(this.refs.container).collapse('toggle')}>
                <div className="form-check">
                    <input id={this.props.pkey} checked={this.state.allowed}
                           onChange={() => this.setState(state => ({allowed: !state.allowed}))} type="checkbox"
                           ref="toggler" className="form-check-input mt-0"
                    /> <label className="form-check-label"
                              htmlFor={this.props.pkey}>{this.props.content.name}</label>
                </div>
            </div>
            <div ref="container" className="collapse"
                 aria-labelledby="headingThree" data-parent="#menusetup">
                <div className="body">
                    <ul className="nav nav-tabs" role="tablist">
                        {this.state.tabs.map((section, key) => <li key={`${this.props.pkey}-section-${key}`}
                                                                               pkey={`${this.props.pkey}-section-${key}`}
                                                                               className="nav-item"><a
                            className={`nav-link ${key==0?'active':''}`}
                            data-toggle="tab" href={`#${this.props.pkey}-section-${key}`} role="tab"
                            aria-controls="home"
                            aria-selected="true">{section.name}</a></li>)}
                        <li className="nav-item"><button type="button" className="nav-link" onClick={this.addTab}>+</button></li>
                    </ul>

                    <div className="tab-content">
                        {this.props.content.sections.map((section, key) => <div
                            key={`${this.props.pkey}-sectioncontent-${key}`}
                            className={`tab-pane border-bottom border-left border-right mb-4 p-4 ${key==0?'active':''}`}
                            id={`${this.props.pkey}-section-${key}`} role="tabpanel" aria-labelledby="home-tab">
                            <Sortable roles={this.props.content.roles} pkey={`${this.props.pkey}-sortable-${key}`}
                                      store={this.props.store} section={section} context={this.props.page}
                                      onUpdateNavigation={(sortableState) => this.props.onUpdateLayout(sortableState, key)}/>
                        </div>)}
                    </div>

                </div>
            </div>
        </div>
    }
}

class NavigationByRole extends Component {
    constructor(props) {
        super(props);
        this.updateContent = this.updateContent.bind(this);
        this.getRaw = this.getRaw.bind(this);
        this.state = {
            layouts: this.props.data.layouts
        }
    }

    componentDidMount() {
        this.refs.input.ry = this
    }

    getRaw() {
        return this.state
    }

    updateContent(sortableState, section_index, layout_index) {
        this.setState((state) => {
            let layouts = state.layouts;
            if (sortableState.current < 0) {
                layouts[layout_index].sections[section_index].setup = sortableState.treeData;
                layouts[layout_index].sections[section_index].updated = true
            }
            else if (layouts[layout_index].roles && layouts[layout_index].roles.length > sortableState.current) {
                if (!layouts[layout_index].roles[sortableState.current].layout_overrides[0].setup)
                    layouts[layout_index].roles[sortableState.current].layout_overrides[0].setup = {};
                layouts[layout_index].roles[sortableState.current].layout_overrides[0].setup[section_index] = sortableState.treeData;
                layouts[layout_index].roles[sortableState.current].updated = true
            }
            return {layouts}
        })
    }

    render() {
        return <div className="accordion mb-4" id="menusetup">
            {this.state.layouts.map((layout, key) => <LayoutCard key={`layout-${key}`} pkey={`layout-${key}`}
                                                                 store={this.props.store} content={layout}
                                                                 allowed={this.props.data.allowed.indexOf(layout.id) >= 0}
                                                                 page={this.props.data.page}
                                                                 onUpdateLayout={(sortableState, section_index) => this.updateContent(sortableState, section_index, key)}/>)}
            <input type="hidden" name="ry" ref="input"/>
        </div>
    }
}

export default NavigationByRole;
