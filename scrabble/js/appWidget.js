'use strict';


// Board element and dimensions
const
    BOARD = document.getElementById('board'),
    MAX_ROW = 7,
    MAX_COL = 7;

// live region for screen reader info
const INFO = document.getElementById('info');


// Current position
var
    currentRow = 4,
    currentCol = 5;
// Key aliases for detection
var Key = {
    UP: 'ArrowUp',
    LEFT: 'ArrowLeft',
    DOWN: 'ArrowDown',
    RIGHT: 'ArrowRight'
    // add here other shortcut keys...
};

// Do nothing (just for future improvements)
function doNothing() {
    return false;
}

// Send message to live region
function say(message) {
    INFO.innerHTML = message;
    setTimeout(() => {
        INFO.innerHTML = '';
    }, 3000);
}

function cellName(row, col) {
    let colNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let colName = colNames.charAt(col);
    let rowName = (row + 1).toString();
    return colName + rowName;

    return cadena.charAt(posicion - 1);
}
// Update position and set focus to current row & column
function updatePosition(updateWhat, newValue) {
    let cellInfo = ''; // cell info for screen reader
    let isNewCell = false; // only update if there are changes

    // change info depending on update type
    switch (updateWhat) {
        case 'row': {
            if (newValue != currentRow) {
                currentRow = newValue;
                isNewCell = true;
                cellInfo = cellName(currentRow, currentCol);
            }
        }; break;
        case 'col': {
            if (newValue != currentCol) {
                currentCol = newValue;
                isNewCell = true;
                cellInfo = cellName(currentRow, currentCol);
            }
        }; break;
        case 'both': {
            // **TBD: in case there is a way yo update both at the same time
        }; break;
        default: doNothing();
    }
    if (isNewCell) {
        // hide focus for all cells
        var allCells = BOARD.getElementsByClassName('board__cell');
        for (let cell = 0; cell < allCells.length; cell++) {
            allCells[cell].classList.remove('cell--current');
        }
        // locate new current cell
        var targetRow = BOARD.getElementsByClassName('board__row')[currentRow];
        var targetCell = targetRow.getElementsByClassName('board__cell')[currentCol];
        targetCell.classList.add('cell--current');
        cellInfo += ', ' + targetCell.textContent;
        say(cellInfo);
    } else {
        say('Borde del tablero');
    }
}

// Single row/column movement
function prevRow() {
    let new_row = (currentRow > 0)
        ? currentRow - 1
        : 0;
    updatePosition('row', new_row);
}
function nextRow() {
    let new_row = (currentRow < MAX_ROW)
        ? currentRow + 1
        : MAX_ROW;
    updatePosition('row', new_row);
} // nextRow
function prevCol() {
    var new_col = (currentCol > 0)
        ? currentCol - 1
        : 0;
    updatePosition('col', new_col);
} // prevCol
function nextCol() {
    var new_col = (currentCol < MAX_COL)
        ? currentCol + 1
        : MAX_COL;
    updatePosition('col', new_col);
} // nextCol

// Move to start/end of row/column
function firstRow() {
    updatePosition('row', 0);
} // firstRow
function lastRow() {
    updatePosition('row', MAX_ROW);
} // lastRow
function firstCol() {
    updatePosition('col', 0);
} // firstCol
function lastCol() {
    updatePosition('col', MAX_COL);
} // lastCol

// Main keyboard management
function handleKeyboardEvent(ev) {
    // cancel event propagation & default behaviour
    ev.preventDefault();
    ev.stopPropagation();

    // Detect modifier keys
    let
        singleKey = !ev.ctrlKey && !ev.shiftKey && !ev.altKey && !ev.metaKey,
        controlKey = ev.ctrlKey && !ev.shiftKey && !ev.altKey && !ev.metaKey;

    // Main non-modifier key
    var theKey = ev.key;

    // Single key, no modifier
    if (singleKey) {
        switch (theKey) {
            case Key.UP: prevRow(); break;
            case Key.DOWN: nextRow(); break;
            case Key.LEFT: prevCol(); break;
            case Key.RIGHT: nextCol(); break;
            // other shortcuts
            default: doNothing();
        }
    } else if (controlKey) {
        switch (theKey) {
            case Key.UP: firstRow(); break;
            case Key.DOWN: lastRow(); break;
            case Key.LEFT: firstCol(); break;
            case Key.RIGHT: lastCol(); break;
            // other shortcuts
            default: doNothing();
        }
        // Ctrl + shift + key
    }
}

// Capture keyboard events (needs tabindex in BOARD element)
BOARD.addEventListener('keyup', handleKeyboardEvent);
