import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ItemLibrary from './ItemLibrary.js'
import Satchel from './Satchel.js'

class SatchelContainer extends React.Component {
  constructor(props) {
    super(props);
    let satchel = new Satchel(10, 4, ItemLibrary.emptyItem);
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

  pickContents(x, y) {
    let item = this.state.satchel.grid[y][x];

    if (item.itemId === 0) {
      return;
    }

    let itemCoords = this.state.satchel.findItemCoords(x, y, item.itemId);
  
    this.setState((previousState) => {
      previousState.satchel.addToClipboard(item, itemCoords);

      // Let's blank out each square by setting its value to the empty item, now
      // that the item is added to the clipboard.
      for (let i=0; i<itemCoords.length; i++) {
        let x = itemCoords[i][0];
        let y = itemCoords[i][1];
        previousState.satchel.grid[y][x] = ItemLibrary.emptyItem;
      }

      return previousState;
    });
  }

  putContents(x, y) {
    let item = this.state.satchel.clipboard.itemObject;
    let possiblePlacementCoords = getItemGhost(item, x, y);
    let occupants = this.getOccupants(possiblePlacementCoords);
  
    // If we checked a square that's out of bounds, we won't even attempt to 
    //place the item.
    if (occupants === false) {
      return;
    }
  
    // We need a count of how many different items currently exist in the desired
    // placement and we only want to manipulate the grid if the item can be
    // placed. If there's not 0-1 occupants in the desired grid, let's leave it
    // alone.
    switch (Object.keys(occupants).length) {
      case 0:
        this.placeItem(possiblePlacementCoords, item);
        this.setState((previousState) => {
          previousState.satchel.clearClipboard();
        });
        break;
      case 1:
        let itemToPlace = this.state.satchel.clipboard.itemObject;
        this.setState((previousState) => {
          previousState.satchel.clearClipboard();
          return previousState;
        });
        this.pickContentsInArea(possiblePlacementCoords); // TODO we cant do this since we have to know if items exist in all squares of the item
        this.placeItem(possiblePlacementCoords, itemToPlace);
        break;
      default:
        return;
    }
  }

  /**
   * Finds a selected item in an area and picks the item.
   * @param {array} coords  The array of coords . e.g. [[0,1], [1,1], [2,5]]
   */
  pickContentsInArea(coords) {
    for (let i=0; i<coords.length; i++) {
      let x = coords[i][0];
      let y = coords[i][1];
      let squareContents = this.state.satchel.grid[y][x];
  
      if (squareContents.itemId !== 0) {
        this.pickContents(x, y);
        break;
      }
    }
  }

  /**
   * Places an item in the inventory grid and updates the UI.
   * @param {*} coords The array of coords . e.g. [[0,1], [1,1], [2,5]]
   * @param {*} item   The item object to place
   */
  placeItem(coords, item) {
    this.setState((previousState) => {
      for (let i = 0; i<coords.length; i++) {
        let x = coords[i][0];
        let y = coords[i][1];
        previousState.satchel.grid[y][x] = item
      }

      return previousState;
    });
  }

  /**
   * Checks inventory squares to see if they're currently-occupied.
   * @param {array} coords   The array of item coords.
   */
  getOccupants(coords) {
    let currentOccupantId = 0;
    let occupants = {};
  
    for (let i=0; i<coords.length; i++) {
      let x = coords[i][0];
      let y = coords[i][1];
  
      // We can't place an item that's going to be out of bounds.
      if (x > this.state.satchel.maxX || y > this.state.satchel.maxY) {
        return false;
      }
  
      currentOccupantId = this.state.satchel.grid[y][x].itemId;
  
      if (currentOccupantId !== 0) {
        occupants[currentOccupantId] = this.state.satchel.grid[y][x];
      }
    }
  
    return occupants;
  }

  /**
   * Callback function
   * Modifies the grid state based on the value at the selected square.
   */
  selectSquare(x, y) {
    if (this.state.satchel.isClipboardEmpty()) {
      this.pickContents(x, y);
    } else {
      this.putContents(x, y);
    }

    console.log('this.state.satchel :', this.state.satchel);
    console.log('this.state.satchel :', this.state.satchel.isClipboardEmpty());
  }

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

/**
 * Gets the potential placement squares for an item. Think of it as an "outline"
 * of the item so we can operate on where the item may be placed.
 * @param {object} item
 * @param {int} x     The x position on the 2D array.
 * @param {int} y     The y position on the 2D array.
 */
function getItemGhost(item, x, y) {
  let ghostSquares = [];
  let itemHeight = 0;
  let itemWidth = 0;

  switch(item.orientation) {
    case "vertical":
      itemHeight = item.size / item.thickness;
      itemWidth = item.thickness;
      break;
    case "horizontal":
      itemHeight = item.thickness;
      itemWidth = item.size / item.thickness;
      break;
    default:
      return;
  }

  for (let i = 0; i < itemHeight; i++) {
    for (let j = 0; j < itemWidth; j++) {
      ghostSquares.push([x + j, y + i]);
    }
  }

  return ghostSquares;
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
