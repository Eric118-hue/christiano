import React, { Component } from 'react';
import { DragDropContextProvider, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

const ItemTypes = {
    KNIGHT: 'knight',
}

const knightSource = {
    beginDrag(props) {
        return {}
    },
}

const collect = function(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }
}

class Knight extends Component
{
    render() {
        return this.props.connectDragSource(<div
            style={{
              opacity: this.props.isDragging ? 0.5 : 1,
              fontSize: 25,
              fontWeight: 'bold',
              cursor: 'move',
            }}
          >♘</div>)
    }
}

let knightPosition = [0, 0]
let observer = null

function emitChange() {
    observer(knightPosition)
}
  
function observe(o) {
    if (observer) {
      throw new Error('Multiple observers not implemented.')
    }
  
    observer = o
    emitChange()
}

function moveKnight(toX, toY) {
    knightPosition = [toX, toY]
    emitChange()
}

const KnightSource = DragSource(ItemTypes.KNIGHT, knightSource, collect)(Knight)

class Square extends Component
{
    render() {
        const black = this.props.black
        const fill = black ? 'black' : 'white'
        const stroke = black ? 'white' : 'black'
        return <div style={{ backgroundColor: fill, color: stroke,
            width: '12.5%',
            height: 130}}>
            {this.props.children}
        </div>
    }
}

class BoardSquare extends Component
{
    render() {
        const black = (this.props.x + this.props.y) % 2 === 1
        return this.props.connectDropTarget(
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            ><Square black={black}>{this.props.children}</Square>
            {this.props.isOver && (
                <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    zIndex: 1,
                    opacity: 0.5,
                    backgroundColor: 'yellow',
                }}
                />
            )}
        </div>)
    }
}

function renderSquare(i, knightPosition) {
    const x = i % 8
    const y = Math.floor(i / 8)
    return (
      <div key={i} style={{ width: '12.5%', height: '12.5%' }}>
        <BoardSquareTarget x={x} y={y}>
          {renderPiece(x, y, knightPosition)}
        </BoardSquareTarget>
      </div>
    )
}

const squareTarget = {
    drop(props, monitor) {
      moveKnight(props.x, props.y)
    },
}

function renderPiece(x, y, [knightX, knightY]) {
    if (x === knightX && y === knightY) {
      return <KnightSource />
    }
}

function collectTarget(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
    }
}

const BoardSquareTarget = DropTarget(ItemTypes.KNIGHT, squareTarget, collectTarget)(BoardSquare)

class Board extends Component
{
    render() {
        const squares = []
        const knightPosition = this.props.knightPosition
        for (let i = 0; i < 64; i++) {
            squares.push(renderSquare(i, knightPosition))
        }
        return <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {squares}
      </div>
    }
}

class Tuto extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            knightPosition : [0, 0]
        }
    }

    componentDidMount() {
        observe(knightPosition => {
            this.setState({knightPosition})
        })
    }

    render() {
        return <Board knightPosition={this.state.knightPosition}/>
    }
}

class Repitt extends Component
{
    render() {
        return <DragDropContextProvider backend={HTML5Backend}>
            <Tuto/>
        </DragDropContextProvider>
    }
}

export default Repitt;