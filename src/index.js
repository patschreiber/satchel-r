import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ItemLibrary from './ItemLibrary.js'
import Satchel from './Satchel.js'

class SatchelContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      satchel: new Satchel(10, 4, ItemLibrary.emptyItem)
    }

    this.state.satchel.grid[1][0] = ItemLibrary.testArmor;
    this.state.satchel.grid[2][0] = ItemLibrary.testArmor;
    this.state.satchel.grid[3][0] = ItemLibrary.testArmor;
    this.state.satchel.grid[1][1] = ItemLibrary.testArmor;
    this.state.satchel.grid[2][1] = ItemLibrary.testArmor;
    this.state.satchel.grid[3][1] = ItemLibrary.testArmor;
    
    this.state.satchel.grid[0][2] = ItemLibrary.skinnySword;
    this.state.satchel.grid[1][2] = ItemLibrary.skinnySword;
    this.state.satchel.grid[2][2] = ItemLibrary.skinnySword;
    this.state.satchel.grid[3][2] = ItemLibrary.skinnySword;
    
    this.state.satchel.grid[2][7] = ItemLibrary.testRing;
    
    this.state.satchel.grid[0][9] = ItemLibrary.skinnySword;
    this.state.satchel.grid[1][9] = ItemLibrary.skinnySword;
    this.state.satchel.grid[2][9] = ItemLibrary.skinnySword;
    this.state.satchel.grid[3][9] = ItemLibrary.skinnySword;
    
    this.state.satchel.grid[0][4] = ItemLibrary.testBook;
    this.state.satchel.grid[1][4] = ItemLibrary.testBook;
    this.state.satchel.grid[0][5] = ItemLibrary.testBook;
    this.state.satchel.grid[1][5] = ItemLibrary.testBook;

  }

  selectSquare(x, y) {
    let item = this.state.satchel.grid[y][x];

    if (item.itemId !== 0) {
      let itemCoords = this.state.satchel.findItemCoords(x, y, item.itemId);
      this.setState((previousState) => {
        console.log('x :', x);
        console.log('y :', y);
        //previousState.satchel.addToClipboard(item, itemCoords);
        previousState.satchel.grid[y][x].status = "red";
        return previousState;
      });
    }

    console.log('this.state.satchel :', this.state.satchel);
    console.log('this.state.satchel :', this.state.satchel.isClipboardEmpty());
  }

  // pickContents(x, y) {
  //   let squareContents = this.state.satchel.grid[y][x];

  //   if (squareContents.itemId === 0) {
  //     return;
  //   }

  //   let itemCoords = inventory.findItemCoords(x, y, squareContents.itemId);
  //   Sizzle("#currently-selected-item")[0].innerHTML = squareContents.name;

  //   inventory.addToClipboard(squareContents, itemCoords);
  // }


  renderSquare(x, y) {
    return (
      <GridSquare
        onClick={() => this.selectSquare(x, y)}
        className={this.state.satchel.grid[y][x].status}
        displayText={this.state.satchel.grid[y][x].sym}
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
          {this.renderSquare(5,0)}
          {this.renderSquare(6,0)}
          {this.renderSquare(7,0)}
          {this.renderSquare(8,0)}
          {this.renderSquare(9,0)}
        </div>
        <div className="grid-row">
          {this.renderSquare(0,1)}
          {this.renderSquare(1,1)}
          {this.renderSquare(2,1)}
          {this.renderSquare(3,1)}
          {this.renderSquare(4,1)}
          {this.renderSquare(5,1)}
          {this.renderSquare(6,1)}
          {this.renderSquare(7,1)}
          {this.renderSquare(8,1)}
          {this.renderSquare(9,1)}
        </div>
        <div className="grid-row">
          {this.renderSquare(0,2)}
          {this.renderSquare(1,2)}
          {this.renderSquare(2,2)}
          {this.renderSquare(3,2)}
          {this.renderSquare(4,2)}
          {this.renderSquare(5,2)}
          {this.renderSquare(6,2)}
          {this.renderSquare(7,2)}
          {this.renderSquare(8,2)}
          {this.renderSquare(9,2)}
        </div>
        <div className="grid-row">
          {this.renderSquare(0,3)}
          {this.renderSquare(1,3)}
          {this.renderSquare(2,3)}
          {this.renderSquare(3,3)}
          {this.renderSquare(4,3)}
          {this.renderSquare(5,3)}
          {this.renderSquare(6,3)}
          {this.renderSquare(7,3)}
          {this.renderSquare(8,3)}
          {this.renderSquare(9,3)}
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
    {props.displayText}
    </div>
  );
}

class Inventory extends React.Component {
  render() {
    return (
      <div className="inventory">
        <div className="satchel">
          <SatchelContainer />
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
