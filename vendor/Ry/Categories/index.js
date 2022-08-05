import React, { Component } from 'react';
import SortableTree, { addNodeUnderParent, changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';
import PropTypes from 'prop-types';
import { isDescendant, insertNode } from '../Core/react-sortable-tree-source/src/utils/tree-data-utils';
import classnames from '../Core/react-sortable-tree-source/src/utils/classnames';
import trans from '../../../app/translations';
import $ from 'jquery';

const bgcodes = ['bg-success', 'bg-blue', 'bg-rose']

const prototypeNode = {
    group: {
        id : 1
    },
    term: {
        name : ''
    },
    tempid: 0,
    active: 1
}

const propagate = (nodes, active, field='selected') => {
    if(nodes) {
        for(let i=0; i<nodes.length; i++) {
            let node = nodes[i]
            node[field] = active
            if(field!='selected')
                node.dirty = true
            if(node.children)
                propagate(node.children, active, field)
        }
    }
}

const propagateToSelected = (nodes, active, field='selected') => {
    if(nodes) {
        for(let i=0; i<nodes.length; i++) {
            let node = nodes[i]
            if(node.selected) {
                node[field] = active
                node.dirty = true
            }
            if(node.children)
                propagateToSelected(node.children, active, field)
        }
    }
}

class NavigationNodeRenderer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			node : this.props.node
		}
	}
	
	render() {		
		const {
            scaffoldBlockPxWidth,
            toggleChildrenVisibility,
            connectDragPreview,
            connectDragSource,
            isDragging,
            canDrop,
            canDrag,
            node,
            title,
            subtitle,
            draggedNode,
            path,
            treeIndex,
            isSearchMatch,
            isSearchFocus,
            buttons,
            className,
            style,
            didDrop,
            treeId,
            isOver, // Not needed, but preserved for other renderers
            parentNode, // Needed for dndManager
            rowDirection,
            onTermChange,
            onCheckActiveChange,
            onSelect,
            ...otherProps
        } = this.props;

		const getNodeKey = ({ treeIndex }) => treeIndex;
		const nodeTitle = title || node.term.name;
		const nodeSubtitle = subtitle || node.subtitle;
		const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;

        let handle;
        if (canDrag) {
			if (typeof node.children === 'function' && node.expanded) {
				// Show a loading symbol on the handle when the children are expanded
				//  and yet still defined by a function (a callback to fetch the children)
                handle = (
                    <div className="rst__loadingHandle">
                        <div className="rst__loadingCircle">
                            {[...new Array(12)].map((_, index) => (
                                <div
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    className={classnames(
                                        'rst__loadingCirclePoint',
                                        rowDirectionClass
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                );
            } else {
                // Show the handle used to initiate a drag-and-drop
                handle = connectDragSource(<div className="rst__moveHandle" />, {
                    dropEffect: 'copy',
                });
            }
        }

		const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
		const isLandingPadActive = !didDrop && isDragging;

        let buttonStyle = { left: -0.5 * scaffoldBlockPxWidth };
        if (rowDirection === 'rtl') {
            buttonStyle = { right: -0.5 * scaffoldBlockPxWidth };
        }

        return (
            <div style={{ height: '100%' }} {...otherProps}>
                {toggleChildrenVisibility &&
                    node.children &&
                    (node.children.length > 0 || typeof node.children === 'function') && (
                        <div>
                            <button
                                type="button" type="button"
                                aria-label={node.expanded ? 'Collapse' : 'Expand'}
                                className={classnames(
                                    node.expanded ? 'rst__collapseButton' : 'rst__expandButton',
                                    rowDirectionClass
                                )}
                                style={buttonStyle}
                                onClick={() =>
                                    toggleChildrenVisibility({
                                        node,
                                        path,
                                        treeIndex,
                                    })
                                }
                            />

                            {node.expanded && !isDragging && (
                                <div
                                    style={{ width: scaffoldBlockPxWidth }}
                                    className={classnames('rst__lineChildren', rowDirectionClass)}
                                />
                            )}
                        </div>
                    )}

                <div className={classnames('rst__rowWrapper', rowDirectionClass)}>
                    {/* Set the row preview to be used during drag and drop */}
                    {connectDragPreview(
                        <div
                            className={classnames(
                                'rst__row',
                                isLandingPadActive && 'rst__rowLandingPad',
                                isLandingPadActive && !canDrop && 'rst__rowCancelPad',
                                isSearchMatch && 'rst__rowSearchMatch',
                                isSearchFocus && 'rst__rowSearchFocus',
                                rowDirectionClass,
                                className
                            )}
                            style={{
                                opacity: isDraggedDescendant ? 0.5 : 1,
                                ...style,
                            }}
                        >
                            {handle}

                            <div
                                className={`${classnames(
                                    'rst__rowContents',
                                    !canDrag && 'rst__rowContentsDragDisabled',
                                    rowDirectionClass
                                )}  ${node.deleted?'alpha-20':''}`}
                            >
                                <div className={classnames('rst__rowLabel', rowDirectionClass)}>
                                    <div className="form-inline">
                                        <label className="fancy-checkbox">
                                            <input type="checkbox" value="1" onChange={onSelect} checked={node.selected}/>
                                            <span>&nbsp;</span>
                                        </label>
                                        <div className={`${bgcodes[node.depth]} mr-4 p-1 pl-3 pr-3 rounded text-white`}>
                                            {('ninput' in node && node.ninput.length)>1?node.ninput[1]:null}
                                        </div>
                                        <input type="text" className="form-control h-100" placeholder={trans('Nom')} value={typeof nodeTitle === 'function'
                                            ? nodeTitle({
                                                    node,
                                                    path,
                                                    treeIndex,
                                                })
                                            : nodeTitle} onChange={onTermChange}/>
                                        <div className="custom-control custom-switch ml-2">
                                            <input type="checkbox" className={`custom-control-input ${node.active?'':'disabled'}`} id={`category-toggle-active-${node.id}`} onChange={onCheckActiveChange} checked={node.active} value="1"/>
                                            <label className="custom-control-label" htmlFor={`category-toggle-active-${node.id}`}></label>
                                        </div>
                                    </div>
                                    {nodeSubtitle && (
                                        <span className="rst__rowSubtitle">
                                            {typeof nodeSubtitle === 'function'
                                                ? nodeSubtitle({
                                                        node,
                                                        path,
                                                        treeIndex,
                                                    })
                                                : nodeSubtitle}
                                        </span>
                                    )}
                                </div>

                                <div className="rst__rowToolbar">
                                    {buttons.map((btn, index) => (
                                        <div
                                            key={index} // eslint-disable-line react/no-array-index-key
                                            className="rst__toolbarButton"
                                        >
                                            {btn}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

NavigationNodeRenderer.defaultProps = {
    isSearchMatch: false,
    isSearchFocus: false,
    canDrag: false,
    toggleChildrenVisibility: null,
    buttons: [],
    className: '',
    style: {},
    parentNode: null,
    draggedNode: null,
    canDrop: false,
    title: null,
    subtitle: null,
    rowDirection: 'ltr',
    onTermChange: () => {},
    onCheckActiveChange: () => {},
    onSelect: ()=>{}
};

NavigationNodeRenderer.propTypes = {
    node: PropTypes.shape({}).isRequired,
    title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    subtitle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    path: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    treeIndex: PropTypes.number.isRequired,
    treeId: PropTypes.string.isRequired,
    isSearchMatch: PropTypes.bool,
    isSearchFocus: PropTypes.bool,
    canDrag: PropTypes.bool,
    scaffoldBlockPxWidth: PropTypes.number.isRequired,
    toggleChildrenVisibility: PropTypes.func,
    buttons: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
    style: PropTypes.shape({}),

    // Drag and drop API functions
    // Drag source
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    parentNode: PropTypes.shape({}), // Needed for dndManager
    isDragging: PropTypes.bool.isRequired,
    didDrop: PropTypes.bool.isRequired,
    draggedNode: PropTypes.shape({}),
    // Drop target
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool,

    // rtl support
    rowDirection: PropTypes.string,
    onTermChange: PropTypes.func,
    onCheckActiveChange: PropTypes.func,
    onSelect: PropTypes.func
};

class Secteur extends Component
{
    render() {
        return <span>
            {trans('Secteur')} : <span className="badge bg-success border-0 text-light">{this.props.data.secteur.id>0?this.props.data.secteur.ninput[1]:this.props.data.category.ninput[1]}</span> {this.props.data.secteur.id>0?this.props.data.secteur.term.name:(this.props.data.category.term.name==''?trans('Choisissez un secteur ou entrez un nom pour en créer un nouveau'):this.props.data.category.term.name)}
            {this.props.data.secteur.id>0?this.props.children:null}
        </span>
    }
}

class Famille extends Component
{
    render() {
        return <span className="ml-3">
            &gt; {trans('Famille')}: <span className="badge bg-blue border-0 text-light">{this.props.data.famille.id>0?this.props.data.famille.ninput[1]:this.props.data.category.ninput[1]}</span> {this.props.data.famille.id>0?this.props.data.famille.term.name:(this.props.data.category.term.name==''?trans('Choisissez une famille ou entrez un nom pour en créer une nouvelle'):this.props.data.category.term.name)}
            {this.props.data.famille.id>0?this.props.children:null}
        </span>
    }
}

class SousFamille extends Component
{
    render() {
        return <span className="ml-3">
            &gt; {trans('Sous-famille')}: <span className="badge badge-violet border-0 text-light">{this.props.data.category.ninput[1]}</span> {this.props.data.category.term.name==''?trans('Entrez le nom de la sous-famille'):this.props.data.category.term.name}
        </span>
    }
}

class Form extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            active : true,
            parent: {
                id: 0
            },
            treeData : this.props.treeData,
            secteur : {
                id : 0,
                term : {
                    name : ''
                },
                ninput : [0, '']
            },
            famille : {
                id : 0,
                term : {
                    name : ''
                },
                ninput : [0, '']
            },
            category : {
                tempid : 0,
                term : {
                    name : ''
                },
                active : true,
                position : 0,
                ninput : [0, '']
            },
            familles : [],
            positions : []
        }
        this.handleSecteurChange = this.handleSecteurChange.bind(this)
        this.handleFamilleChange = this.handleFamilleChange.bind(this)
        this.activeHandler = this.activeHandler.bind(this)
        this.handleSousFamilleNameChange = this.handleSousFamilleNameChange.bind(this)
        this.handleSousFamilleCodeChange = this.handleSousFamilleCodeChange.bind(this)
        this.handleSousFamillePositionChange = this.handleSousFamillePositionChange.bind(this)
        this.insert = this.insert.bind(this)
    }

    insert() {
        if($(this.refs.frm_add_category).parsley().validate()) {
            $.ajax({
                url : '/categories',
                type : 'post',
                data : {
                    treeData : [
                        this.state.category
                    ],
                    parent : this.state.parent
                },
                success : data=>{
                    this.setState(state=>{
                        state.treeData = data.data
                        if(state.secteur.id>0) {
                            let tree = state.treeData.filter(item=>item.id==state.secteur.id)[0]
                            state.familles = tree.children
                            let positions = []
                            for(var i=0; i<state.familles.length; i++) {
                                if(positions.indexOf(state.familles[i].position)<0)
                                    positions.push(state.familles[i].position)
                            }
                            if(positions.length>0)
                                positions.push(Math.max.apply(null, positions)+1)
                            state.positions = positions
                        }
                        state.category = {
                            tempid : 0,
                            term : {
                                name : ''
                            },
                            active: true,
                            position : 0,
                            ninput: [0, '']
                        }
                        return state
                    })
                    window.setTimeout(()=>{
                        $(this.refs.secteurs).selectpicker('refresh')
                        $(this.refs.familles).selectpicker('refresh')
                        $(this.refs.positions).selectpicker('refresh')
                    }, 0)
                    this.props.store.dispatch(data)
                }
            })
        }
    }

    handleSousFamilleNameChange(event) {
        const value = event.target.value
        this.setState(state=>{
            state.category.term.name = value
            return state
        })
    }

    handleSousFamilleCodeChange(event) {
        const value = event.target.value
        this.setState(state=>{
            state.category.ninput[1] = value
            return state
        })
    }

    handleSousFamillePositionChange(event) {
        const value = event.target.value
        this.setState(state=>{
            state.category.position = value
            return state
        })
    }

    handleSecteurChange(event) {
        const value = event.target.value
        this.setState(state=>{
            if(value==0) {
                state.familles = []
                state.secteur = {
                    id : 0,
                    term : {
                        name : ''
                    }
                }
                state.positions = []
                state.parent.id = 0
            }
            else {
                let tree = state.treeData.filter(item=>item.id==value)[0]
                state.familles = tree.children
                let positions = []
                for(var i=0; i<state.familles.length; i++) {
                    if(positions.indexOf(state.familles[i].position)<0)
                        positions.push(state.familles[i].position)
                }
                if(positions.length>0)
                    positions.push(Math.max.apply(null, positions)+1)
                state.positions = positions
                state.secteur = tree
                state.parent.id = value
            }
            state.famille = {
                id : 0,
                term : {
                    name : ''
                },
                ninput : [0, '']
            }
            return state
        })
        window.setTimeout(()=>{
            $(this.refs.familles).selectpicker('refresh')
            $(this.refs.positions).selectpicker('refresh')
        }, 0)
    }

    handleFamilleChange(event) {
        const value = event.target.value
        this.setState(state=>{
            if(value==0) {
                state.famille = {
                    id : 0,
                    term : {
                        name : ''
                    },
                    ninput : [0, '']
                }
                state.parent.id = state.secteur.id
            }
            else {
                let tree = state.familles.find(item=>item.id==value)
                state.famille = tree
                let positions = []
                for(var i=0; i<tree.children.length; i++) {
                    if(state.familles.length>i && positions.indexOf(state.familles[i].position)<0)
                        positions.push(state.familles[i].position)
                }
                if(positions.length>0)
                    positions.push(Math.max.apply(null, positions)+1)
                state.positions = positions
                state.parent.id = value
            }
            return state
        })
        window.setTimeout(()=>{
            $(this.refs.positions).selectpicker('refresh')
        }, 0)
    }

    activeHandler(event) {
        const checked = event.target.checked
        this.setState(state=>{
            state.category.active = checked
            return state
        })
    }

    render() {
        return <div className="card">
            <form ref="frm_add_category" name="frm_add_category" method="post" action={trans("/categories")}>
                <div className="card-header">
                    {trans("Ajouter un élément dans l'arborescence")}
                    <button type="button" className="btn btn-orange ml-4" data-toggle="collapse" data-target="#collapseExample">{trans('Ajouter')}</button>
                </div>
                <div className="card-body collapse" id="collapseExample">
                    <div className="row" data-parsley-validate="add-form">
                        <div className="col-md-10 border-right">
                            <div className="row">
                                <div className="col-md-6 form-inline mb-2">
                                    <label className="col-md-4 justify-content-end">{trans('Secteur')}</label>
                                    <div className="form-group col-md-8">
                                        <select ref="secteurs" className="form-control" onChange={this.handleSecteurChange} value={this.state.secteur.id}>
                                            <option value="0">{trans('Créer un secteur')}</option>
                                            {this.state.treeData.map(category=><option key={`secteur-${category.id}`} value={category.id}>{category.term.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 form-inline mb-2">
                                    <label className="col-md-4 justify-content-end">{trans('Famille')}</label>
                                    <div className="form-group col-md-8">
                                        <select ref="familles" className="form-control" onChange={this.handleFamilleChange} value={this.state.famille.id}>
                                            {this.state.familles.length>0?<option value="0">{trans('Créer une famille')}</option>:null}
                                            {this.state.familles.map(category=><option key={`famille-${category.id}`} value={category.id}>{category.term.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 form-inline">
                                    <label className="col-md-4 justify-content-end">{trans('Nom')}</label>
                                    <div className="form-group col-md-8">
                                        <input type="text" className="form-control w-100" onChange={this.handleSousFamilleNameChange} required value={this.state.category.term.name}/>
                                    </div>
                                </div>
                                <div className="col-md-3 form-inline">
                                    <label className="col-md-4 justify-content-end">{trans('Code')}</label>
                                    <div className="form-group col-md-8">
                                        <input type="number" className="form-control w-100" onChange={this.handleSousFamilleCodeChange} required value={this.state.category.ninput[1]}/>
                                    </div>
                                </div>
                                <div className="col-md-3 form-inline">
                                    <label className="col-md-4 justify-content-end">{trans('Position')}</label>
                                    <div className="form-group col-md-8">
                                        <select ref="positions" className="form-control" onChange={this.handleSousFamillePositionChange} value={this.state.category.position}>
                                            {this.state.positions.map(position=><option key={`position-${position}`} value={position}>{position}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 text-center">
                            {trans('Visible en front')}
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className={`custom-control-input ${this.state.category.active?'':'disabled'}`} id={`category-toggle-active`} onChange={this.activeHandler} checked={this.state.category.active} value="1"/>
                                <label className="custom-control-label" htmlFor={`category-toggle-active`}></label>
                            </div>
                            <button type="button" className="btn btn-orange mt-2 w-100" onClick={this.insert}>{trans('Ajouter')}</button>
                        </div>
                        <div className="offset-md-1 col-md-11">
                            <Secteur data={this.state}>
                                <Famille data={this.state}>
                                    <SousFamille data={this.state}/>
                                </Famille>
                            </Secteur>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    }
}

class Categories extends Component
{
    constructor(props) {
        super(props);
        let treeData = this.props.data.data.data
        treeData.map(item=>{
            item.expanded=true
            if(item.children) {
                item.children.map(item2=>item2.expanded=true)
            }
        })
        this.state = {
            action : '',
            treeData: treeData || [],
            searchstring: '',
            searchFoundCount: null,
            searchFocusIndex: 0,
            dirty: false
        };
        
        this.updateNodeAtPath = this.updateNodeAtPath.bind(this)
        this.addNodeAtRoot = this.addNodeAtRoot.bind(this)
        this.insertNodeAtPath = this.insertNodeAtPath.bind(this)
        this.removeCategoryNodeAtPath = this.removeCategoryNodeAtPath.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
        this.handleActionChange = this.handleActionChange.bind(this)
        this.applyAction = this.applyAction.bind(this)
    }
    
    componentDidMount() {
        this.refs.input.ry = this
        this.props.store.subscribe(()=>{
            const state = this.props.store.getState()
            if(state.type==='categories') {
                let treeData = state.data
                treeData.map(item=>{
                    item.expanded=true
                    if(item.children) {
                        item.children.map(item2=>item2.expanded=true)
                    }
                })
                this.setState({
                    dirty: false,
                    treeData : treeData
                })
            }
        })
    }

    handleActionChange(event) {
        const value = event.target.value
        this.setState({
            action : value
        })
    }

    applyAction() {
        this.setState(state=>{
            if(state.action=='activate') {
                state.treeData.map(item=>{
                    if(item.selected) {
                        item.active = true
                    }
                    propagateToSelected(item.children, true, 'active')
                })
            }
            else if(state.action=='deactivate') {
                state.treeData.map(item=>{
                    if(item.selected) {
                        item.active = false
                    }
                    propagateToSelected(item.children, false, 'active')
                })
            }
            else if(state.action=='delete') {
                state.treeData.map(item=>{
                    if(item.selected) {
                        item.deleted = true
                    }
                    propagateToSelected(item.children, true, 'deleted')
                })
            }
            state.dirty = true
            return state
        })
    }

    onSearchChange(event) {
        this.setState({
            searchstring : event.target.value
        })
    }

    getRaw() {
        return this.state
    }

	updateNodeAtPath(thepath, newNode) {
		const getNodeKey = ({ treeIndex }) => treeIndex;
		const newState = changeNodeAtPath({treeData:this.state.treeData, path:thepath, newNode:newNode, getNodeKey:getNodeKey});
		this.setState({
			treeData:newState
		});
    }

	addNodeAtRoot() {
		const getNodeKey = ({ treeIndex }) => treeIndex;
		this.setState(state => {
			let newState = addNodeUnderParent({
				treeData: state.treeData,
				expandParent: true,
				getNodeKey,
				newNode: JSON.parse(JSON.stringify(prototypeNode)),
				addAsFirstChild: state.addAsFirstChild,
			}).treeData
			return {
                treeData: newState,
                dirty: true
			}
		})
	}

	insertNodeAtPath(path) {
		const getNodeKey = ({ treeIndex }) => treeIndex;
		this.setState(state => {
			let newState = addNodeUnderParent({
				treeData: state.treeData,
				parentKey: path[path.length - 1],
				expandParent: true,
				getNodeKey,
				newNode: JSON.parse(JSON.stringify(prototypeNode)),
				addAsFirstChild: state.addAsFirstChild,
			}).treeData
			return {
				treeData: newState
			}
		})
	}

	removeCategoryNodeAtPath(path, node) {
        node.deleted = true
        $.ajax({
            url : trans('/categories'),
            type : 'post',
            data : {
                treeData : [node]
            },
            success : ()=>{
                const getNodeKey = ({ treeIndex }) => treeIndex;
                const newState = removeNodeAtPath({treeData:this.state.treeData, path:path, getNodeKey:getNodeKey});
                this.setState({
                    treeData:newState
                });
            }
        })
        this.updateNodeAtPath(path, node)
    }
    
    updateTreeData(treeData) {
        this.setState({ treeData })
    }

	render() {
        const {
            treeData,
            searchstring,
            searchFocusIndex,
            searchFoundCount,
        } = this.state;
		return <div className="col-md-12">
            <Form treeData={this.state.treeData} store={this.props.store}/>

            <form name="frm_categories" action={trans("/categories")} method="post">
                <div className="row justify-content-between m-0">
                    {false?<button type="button" className="btn btn-sm btn-primary" onClick={this.addNodeAtRoot}>
                        <i className="fa fa-plus"></i> {trans('Ajouter une branche')}
                    </button>:<div className="col-md-3 d-flex">
                        <select className="form-control" value={this.state.action} onChange={this.handleActionChange} title={trans('Actions groupées')}>
                            <option data-icon="fa fa-check" value="activate">{trans('Activer')}</option>
                            <option data-icon="fa fa-times" value="deactivate">{trans('Désactiver')}</option>
                            <option data-divider="true"></option>
                            <option data-icon="fam fam-trash-o" value="delete">{trans('Supprimer')}</option>
                        </select>
                        <button type="button" className="btn btn-default" onClick={this.applyAction}>{trans('Appliquer')}</button>
                    </div>}

                    <div className="form-inline my-2 my-lg-0">
                        <i className="fa fa-filter mr-3"></i>
                        <input className="form-control mr-sm-2" type="search" value={searchstring} placeholder={trans('Filtre rapide')} aria-label={trans('Filtre rapide')} onChange={this.onSearchChange}/>
                        <button type="submit" className={`ml-2 btn ${this.state.dirty?'faa-flash animated btn-warning':'btn-primary'}`}>{trans('Enregistrer')}</button>
                    </div>
                </div>
                <div className={`${this.state.treeData.length>0?'bg-white border mt-4 rounded':''}`} style={{height:640}}>
                    <SortableTree
                        nodeContentRenderer={NavigationNodeRenderer}
                        treeData={treeData}
                        searchQuery={this.state.searchstring}
                        searchFocusOffset={searchFocusIndex}
                        onMoveNode={()=>this.setState({dirty:true})}
                        searchMethod={data=>{
                            let regex = new RegExp(`^${data.searchQuery.toLowerCase()}`)
                            return data.searchQuery.length>1 && regex.test(data.node.term.name.toLowerCase())
                        }}
                        searchFinishCallback={matches =>
                            this.setState({
                                searchFoundCount: matches.length,
                                searchFocusIndex: matches.length > 0 ? searchFocusIndex % matches.length : 0,
                            })
                        }

                        isVirtualized={true} //autoheight - false
                        onChange={treeData => this.updateTreeData(treeData)}
                        generateNodeProps={({ node, path }) => {
                            let btns = []
                            if(node.id) {
                                    btns.push(<label className="btn btn-sm btn-circle btn-secondary m-0 mr-2">
                                    <i className="fa fa-images p-1"></i>
                                    <input type="file" className="d-none"/>
                                </label>)
                                btns.push(<button className="btn btn-sm btn-circle btn-outline-secondary mr-2" type="button" onClick={()=>{}}>
                                    <i className="fa fa-chart-pie"></i>
                                </button>)
                            }
                            btns.push(<button className="btn btn-sm btn-circle btn-primary mr-2" type="button"
                            onClick={() => this.insertNodeAtPath(path)}
                        >
                            <i className="fa fa-plus"></i>
                        </button>)
                            btns.push(<button className="btn btn-sm btn-circle btn-danger" type="button"
                            onClick={() => this.removeCategoryNodeAtPath(path, node)}
                        >
                            <i className="fa fa-times"></i>
                        </button>)
                            return{
                            onTermChange: (event) => {
                                node.dirty = true
                                this.setState({
                                    dirty : true
                                })
                                node.term.name = event.target.value
                                this.updateNodeAtPath(path, node)
                            },
                            onCheckActiveChange: (event) => {
                                node.dirty = true
                                node.active = event.target.checked ? 1 : 0
                                $.ajax({
                                    url : trans('/categories'),
                                    type : 'post',
                                    data : {
                                        treeData : [node]
                                    }
                                })
                                this.updateNodeAtPath(path, node)
                            },
                            onSelect: (event) => {
                                node.selected = event.target.checked ? 1 : 0
                                propagate(node.children, node.selected)
                                this.updateNodeAtPath(path, node)
                            },
                            buttons: btns
                        }
                    }
                    }
                    />
                </div>	
                <input type="hidden" name="ry" ref="input"/>
            </form>
        </div>
	}
}

export default Categories;