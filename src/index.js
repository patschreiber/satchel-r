import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ItemLibrary from './ItemLibrary.js'
import Satchel from './Satchel.js'

class SatchelRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      satchel: new Satchel(10, 4, ItemLibrary.emptyItem),
      highlightedSquares: []
    }
  }

  selectSquare(x, y) {
    if (this.state.satchel.isClipboardEmpty()) {
      this.pickContents(x, y);
    } else {
      this.putContents(x, y);
    }

    console.log('item :', item);
    // satchel.clipboard = ItemLibrary.skinnySword;
    // this.setState({satchel: satchel })

    if (item.itemId !== 0) {
      this.setState((previousState) => {
        previousState.satchel.addToClipboard(item, [[0,0],[0,1]]);
        return previousState;
      });
    }

    this.setState({className: "red"})
    console.log('this.state.satchel :', this.state.satchel.isClipboardEmpty());
  }

  pickContents(x, y) {
    let squareContents = this.state.satchel.grid[y][x];

    if (squareContents.itemId === 0) {
      return;
    }

    let itemCoords = inventory.findItemCoords(x, y, squareContents.itemId);
    Sizzle("#currently-selected-item")[0].innerHTML = squareContents.name;

    inventory.addToClipboard(squareContents, itemCoords);
  }


  renderSquare(x, y) {
    return (
      <GridSquare
        onClick={() => this.selectSquare(x, y)}
        className={this.state.className}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="grid-row">
          {this.renderSquare(0,0)}
          {this.renderSquare(1,0)}
          {this.renderSquare(2,0)}
          {this.renderSquare(3,0)}
          {this.renderSquare(4,0)}
        </div>
        <div className="grid-row">
          {this.renderSquare(0,1)}
          {this.renderSquare(1,1)}
          {this.renderSquare(2,1)}
          {this.renderSquare(3,1)}
          {this.renderSquare(4,1)}
        </div>
        <div className="grid-row">
          {this.renderSquare(0,2)}
          {this.renderSquare(1,2)}
          {this.renderSquare(2,2)}
          {this.renderSquare(3,2)}
          {this.renderSquare(4,2)}
        </div>
      </div>
    );
  }
}

function GridSquare(props) {
  return (
    <div
      className={`grid-square ${props.className}`}
      onClick={() => props.onClick()}
    >
    </div>
  );
}

class Inventory extends React.Component {
  render() {
    return (
      <div className="inventory">
        <div className="satchel">
          <SatchelRenderer />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Inventory />,
  document.getElementById('root')
);
