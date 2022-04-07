/** Connect Four
 *Springboard rules:
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let clickable = true;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  //iterates 'HEIGHT' amount of times and pushes array into board for each iteration, arr is 'WIDTH' elements long
  for (y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");
  // TODO: add comment for this code
  //create row at the top of the board and make it clickable
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  //I changed it to drop so that I can utilize a drag and drop feature for the game pieces
  top.addEventListener("drop", handleClick);
  // create cells for each column in the top row - append them to the row
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  //also changed parameters for y because starter code made piece appear on top cell
  for (let y = 5; y >= 0; y--) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  //could have waited to change makeHTML board had I known I would need to loop again to find spot in col
  for (let y = 0; y < HEIGHT; y++) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const pieceDiv = document.createElement("div");
  pieceDiv.classList.add("piece");
  pieceDiv.classList.add(`player${currPlayer}`);
  const targetTd = document.getElementById(`${y}-${x}`);
  targetTd.append(pieceDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (clickable) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    //being used for click and drag feature
    const active1 = document.getElementById("player1");
    const active2 = document.getElementById("player2");
    //toggle class to make the current player's gamae piece visible
    if (currPlayer === 1) {
      active2.classList.toggle("active");
      active1.classList.toggle("active");
    } else {
      active1.classList.toggle("active");
      active2.classList.toggle("active");
    }

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    board[y][x] = currPlayer;
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
      setTimeout(() => restartGame(), 2000);
      return setTimeout(() => endGame(`Player ${currPlayer} wins!`), 1000);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame

    if (board.every((arr) => arr.every((val) => val))) {
      return setTimeout(() => endGame("The game ends in a tie!"), 150);
    }

    // switch players
    // TODO: switch currPlayer 1 <-> 2
    currPlayer = currPlayer === 1 ? 2 : 1;
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    //
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      //four in a row side by side
      var horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      //four in a row top to bottom
      var vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      //bottom left to top right
      var diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      //top left to bottom right
      var diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      // if any of these conditions are true - return true (any four elements of the board array that are a match (currPlayer))
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        clickable = false;
        return true;
      }
    }
  }
}

function restartGame() {
  const replayButton = document.createElement("button");
  replayButton.classList.add("replay");
  replayButton.innerText = "Restart Game";
  const gameDiv = document.getElementById("game");
  gameDiv.append(replayButton);
  gameDiv.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      window.location.reload(false);
      clickable = true;
    }
  });
}

//I reviewed the MDN docs and a jsfiddle page by user Radonirina Maminiaina to learn drag and drop listeners
//allow top row to execute handleClick when piece is released inside
top.addEventListener(
  "dragover",
  function (event) {
    // prevent default to allow drop
    event.preventDefault();
  },
  false
);

makeBoard();
makeHtmlBoard();
