import Grid from './Grid.js'
import ItemLibrary from './ItemLibrary.js'

/**
 * The satchel class. Implements a 2D array specifically for storing item
 * objects. The satchel can then be used as an inventory system akin to
 * old-school RPGs which had a grid containing items of different sizes. The
 * satchel allows a user to rearrange items in the grid manually.
 *
 * An item in the clipboard can be swapped with a single item in the grid.
 * If the item in the clipboard overlaps more than 1 item, it can't be
 * hotswapped.
 * Properties:
 * @prop {object} clipboard A temp storage for selected items.
 * @prop {int}   maxX   The max row width to easily get the bounds of the grid.
 * @prop {int}   maxY   max column height to easily get the bounds of the grid.
 */
class Satchel extends Grid {
  /**
   * The constructor method.
   * @param {int} width  How many columns the subarray should be.
   * @param {int} height How many rows the 2D array should have.
   */
  constructor(width, height) {
    let initialGridBlankVal = ItemLibrary.emptyItem;
    super(width, height, initialGridBlankVal);

    // We want to store a reference to the item as well as it's coordinates in
    // the satchel grid. This lets us reference item properties and return the
    // item to its original grid position, if we so choose.
    this.clipboard = {
      itemObject: {},
      itemCoords: []
    };

    this.maxX = width - 1;
    this.maxY = height - 1;
  }

  /**
   * Checks if the clipboard is empty by looking at the value of the itemObject
   * key. If itemObject is empty, we assume the clipboard is empty.
   * @return {boolean}    The status of the clipboard
   */
  isClipboardEmpty() {
    return this.isEmpty(this.clipboard.itemObject);
  }

  /**
   * Adds a reference to an item to the clipboard.
   * @param {object} object The object to store in the clipboard.
   * @param {array} coords  An array of coordinates representing the position of
   * the item in the inventory grid.
   */
  addToClipboard(object, coords = []) {
    this.clipboard.itemObject = object;
    this.clipboard.itemCoords = coords;
  }

  /**
   * Removes the reference to an item stored in the clipboard.
   */
  clearClipboard() {
    this.clipboard.itemObject = {};
    this.clipboard.itemCoords = []
  }

  /**
   *
   * @param {int} x       The x position on the 2D (grid) array.
   * @param {int} y	      The y position on the 2D (grid) array.
   * @param {int} itemId	The unique item id of the object in the grid square.
   */
  findItemCoords(x, y, itemId) {
    // We keep track of our visited squares to avoid infinite loops.
    let visited = {};
    let queue = [];
    let itemCoords = [];

    // Let's add our initial square to the queue
    queue.push([x,y]);

    while (queue.length > 0) {
      let currentSquareCoords = queue.shift();
      // We want visitedKey to be a string so we can use it as the dictionary key.
      let visitedKey = this.stringifyCoords(currentSquareCoords);

      // If we've already visited this square, let's not process it again.
      if (visited[visitedKey]) {
        continue;
      } else {
        let isItemInSquare = this.compareSquareVal(currentSquareCoords, itemId);
        if (isItemInSquare) {
          itemCoords.push(currentSquareCoords);
        }

        visited[visitedKey] = true;
      }

      // Meet our neighbors
      let neighbors = this.getNeighbors(currentSquareCoords, this.grid);

      // Let's add the current square's neighbors to the queue in order to be
      // processed, only if it hasn't been visited before.
      for (let key in neighbors) {
        let neighborCoords = neighbors[key];

        if (neighborCoords !== false) {
          let visitedKey = this.stringifyCoords(neighborCoords);
          // We don't want to push to the queue if we've already visited this
          // square.
          if (visited[visitedKey]) {
            continue;
          }

          queue.push(neighbors[key]);
        }
      }
    }

    return itemCoords;
  }

  /**
   * Determines if the value of the itemId at currentSquareCoordinates is the
   * same as the item id we're searching for.
   * @param {array} currentSquareCoords	  The [x,y] coordinates of the square.
   * @param {string} itemId	                  The item uid we're searching for.
   */
  compareSquareVal(currentSquareCoords, itemId) {
    let x = currentSquareCoords[0];
    let y = currentSquareCoords[1];
    let currentSquareContents = this.grid[y][x];

    return currentSquareContents.itemId === itemId;
  }
}

export default Satchel;
