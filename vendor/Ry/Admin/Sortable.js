import React, { Component } from 'react';
import SortableTree, { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath } from 'react-sortable-tree';
import PropTypes from 'prop-types';
import { isDescendant, insertNode } from '../Core/react-sortable-tree-source/src/utils/tree-data-utils';
import classnames from '../Core/react-sortable-tree-source/src/utils/classnames';
import trans from '../../../app/translations';

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
            onTitleChange,
            onHrefChange,
            onIconChange,
            ...otherProps
        } = this.props;
		const getNodeKey = ({ treeIndex }) => treeIndex;
		const nodeTitle = title || node.title;
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
                                className={classnames(
                                    'rst__rowContents',
                                    !canDrag && 'rst__rowContentsDragDisabled',
                                    rowDirectionClass
                                )}
                            >
                                <div className={classnames('rst__rowLabel', rowDirectionClass)}>
                                    <span
                                        className={classnames(
                                            'rst__rowTitle',
                                            node.subtitle && 'rst__rowTitleWithSubtitle'
                                        )}
                                    ><i className={node.icon}></i>&nbsp;<input type="text" placeholder="class CSS icône" value={node.icon?node.icon:''} onChange={onIconChange}/>&nbsp;<input type="text" placeholder="titre du menu" value={typeof nodeTitle === 'function'
                                            ? nodeTitle({
                                                    node,
                                                    path,
                                                    treeIndex,
                                                })
                                            : nodeTitle} onChange={onTitleChange}/>&nbsp;<input type="text" placeholder="lien absolu" value={node.href?node.href:''} onChange={onHrefChange}/>
                                        
                                    </span>

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
    onTitleChange: () => {},
    onHrefChange: () => {},
    onIconChange: () => {},
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
    onTitleChange: PropTypes.func,
    onHrefChange: PropTypes.func,
    onIconChange: PropTypes.func
};

class Sortable extends Component
{
	constructor(props) {
        super(props);

        this.state = {
            treeData: this.props.section.setup || [],
            treeDefault : this.props.section.setup,
            treeRoles : this.props.roles,
            modeLabel : trans('Par défaut'),
            current : -1,
            node: {
                title: '',
                icon: '',
                href: ''
            }
        };
        
        this.updateNodeAtPath = this.updateNodeAtPath.bind(this)
        this.setTreeDefault = this.setTreeDefault.bind(this)
        this.setTree = this.setTree.bind(this)
        this.cloneDefaultToCurrent = this.cloneDefaultToCurrent.bind(this)
        this.addNodeAtRoot = this.addNodeAtRoot.bind(this)
        this.insertNodeAtPath = this.insertNodeAtPath.bind(this)
        this.removeNavigationNodeAtPath = this.removeNavigationNodeAtPath.bind(this)
	}

	cloneDefaultToCurrent() {
		this.setState((state)=>{
			return {
				treeData : JSON.parse(JSON.stringify(state.treeDefault))
			}
		})
	}

	updateNodeAtPath(thepath, newNode) {
		const getNodeKey = ({ treeIndex }) => treeIndex;
		const newState = changeNodeAtPath({treeData:this.state.treeData, path:thepath, newNode:newNode, getNodeKey:getNodeKey});
		this.setState({
			treeData:newState,
			node: newNode
		});
		this.props.onUpdateNavigation({
			treeData:newState,
			current:this.state.current
		});
	}

	setTree(role, key) {
		this.setState(state=>{
			//fika masiso : deep shallow copy array
			let sections_setup = JSON.parse(JSON.stringify(state.treeData))
			if(state.treeRoles[key].layout_overrides[0].setup && state.treeRoles[key].layout_overrides[0].setup[this.props.section.id]) {
				sections_setup = JSON.parse(JSON.stringify(state.treeRoles[key].layout_overrides[0].setup[this.props.section.id]))
			}
			let newState = {
				treeData : sections_setup,
				modeLabel : trans('Rôle') + ' : ' + state.treeRoles[key].name,
				current : key
			}
			if(state.current<0) {
				newState.treeDefault = JSON.parse(JSON.stringify(state.treeData))
			}
			else {
				let treeRoles = state.treeRoles
				if(!treeRoles[state.current].layout_overrides[0].setup)
					treeRoles[state.current].layout_overrides[0].setup = {}
				treeRoles[state.current].layout_overrides[0].setup[this.props.section.id] = JSON.parse(JSON.stringify(state.treeData))
				newState.treeRoles = treeRoles
			}
			return newState
		})
	}

	setTreeDefault() {
		this.setState(state=>{
			let newState = {
				treeData : JSON.parse(JSON.stringify(state.treeDefault)),
				modeLabel : trans('Par défaut'),
				current : -1
			}

			if(state.current<0) {
				newState.treeDefault = JSON.parse(JSON.stringify(state.treeData))
			}
			else {
				let treeRoles = state.treeRoles
				if(!treeRoles[state.current].layout_overrides[0].setup)
					treeRoles[state.current].layout_overrides[0].setup = {}
				treeRoles[state.current].layout_overrides[0].setup[this.props.section.id] = JSON.parse(JSON.stringify(state.treeData))
				newState.treeRoles = treeRoles
			}
			return newState;
		})
	}

	addNodeAtRoot() {
		const getNodeKey = ({ treeIndex }) => treeIndex;
		this.setState(state => {
			let newState = addNodeUnderParent({
				treeData: state.treeData,
				expandParent: true,
				getNodeKey,
				newNode: Object.assign({}, this.props.context),
				addAsFirstChild: state.addAsFirstChild,
			}).treeData
			this.props.onUpdateNavigation({
				treeData:newState,
				current:state.current
			});
			return {
				treeData: newState
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
				newNode: Object.assign({}, this.props.context),
				addAsFirstChild: state.addAsFirstChild,
			}).treeData
			this.props.onUpdateNavigation({
				treeData:newState,
				current:state.current
			});
			return {
				treeData: newState
			}
		})
	}

	removeNavigationNodeAtPath(path) {
		const getNodeKey = ({ treeIndex }) => treeIndex;
		this.setState(state => {
			let newState = removeNodeAtPath({
				treeData: state.treeData,
				path,
				getNodeKey,
			})
			this.props.onUpdateNavigation({
				treeData:newState,
				current:state.current
			});
			return {
				treeData: newState
			}
		})
    }
    
    updateTreeData(treeData) {
        this.setState({ treeData })
        this.props.onUpdateNavigation({
            treeData:treeData,
            current:this.state.current
        });
    }

	render() {
		return <div>
			<div className="row justify-content-between m-0">
				<button type="button" className="btn btn-sm btn-primary" onClick={this.addNodeAtRoot}>
					<i className="fa fa-plus"></i> {trans('Ajouter une branche')}
				</button>

				<div className="row m-0">
					<button type="button" className={`btn btn-default ${(this.state.current>=0 && this.state.treeRoles[this.state.current].layout_overrides[0].setup)?'':'d-none'}`} onClick={this.cloneDefaultToCurrent}>
                        {trans('Réinitialiser')}
                    </button>

                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.modeLabel}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#" onClick={this.setTreeDefault}>{trans('Par défaut')}</a>
                            {this.props.roles.map((role, key)=><a key={`${this.props.pkey}-sortable-${key}`} className="dropdown-item" href="#" onClick={()=>this.setTree(role, key)}>{trans('Rôle')} : {role.name}</a>)}
                        </div>
					</div>
			    </div>
			</div>

			<div style={{ height: this.state.treeData.length > 0 ? 400 : 0 }}>
                <SortableTree
                    nodeContentRenderer={NavigationNodeRenderer}
                    treeData={this.state.treeData}
                    onChange={treeData => this.updateTreeData(treeData)}
                    generateNodeProps={({ node, path }) => ({
                        onTitleChange: (event) => {
                            node.title = event.target.value
                            this.updateNodeAtPath(path, node)
                        },
                        onHrefChange: (event) => {
                            node.href = event.target.value
                            this.updateNodeAtPath(path, node)
                        },
                        onIconChange: (event) => {
                            node.icon = event.target.value
                            this.updateNodeAtPath(path, node)
                        },
                        buttons: [
                            <button className="btn btn-sm btn-circle btn-primary mr-2" type="button"
                                onClick={() => this.insertNodeAtPath(path)}
                            >
                                <i className="fa fa-plus"></i>
                            </button>,
                            <button className="btn btn-sm btn-circle btn-danger" type="button"
                                onClick={() => this.removeNavigationNodeAtPath(path)}
                            >
                                <i className="fa fa-times"></i>
                            </button>,
                        ],
                    })}
                />
			</div>			
		</div>
	}
}

export default Sortable;
