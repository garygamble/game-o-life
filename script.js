// initial vars

// set up grid size
var grid = 20,
// live cell probability - to fill in 50% live cells
	liveCellProb = 0.5,
	$table,
	$cells;

$(document).ready(function() {
	// cache varables, initialize everything
	$table = $('#universe');
	initUniverse();
	$cells = $table.find('td');
	initCells();
	runGeneration();
});

function initUniverse() {
	// set up grid
	var row = [];
	for (var y = 0; y < grid; y++) {
		row.push('<tr>');
		for (var x = 0; x < grid; x++) {
			row.push('<td>&nbsp</td>');
		}
		row.push('</tr>');
	}
	row = row.join('');
	$table.append($(row));
}

function initCells() {
	// initailize grid base on grid size - randomly select some cells
	for (var y = 0; y < grid; y++) {
		for (var x = 0; x < grid; x++) {
			var cell = getCell(x, y);
			if (Math.random() > liveCellProb) {
				cell.addClass('alive');
			} else {
				cell.removeClass('alive');
			}
		}
	}
}

function getCell(x, y) {
	// get cells - since the generations are infinite come back into the grid if you've gone off-grid
	if (x >= grid) { x = 0; }
	if (y >= grid) { y = 0; }
	if (x < 0) { x = grid - 1; }
	if (y < 0) { y = grid - 1; }
	return $($cells[y * grid + x]);
}

function runGeneration() {
	// run generation - set up next generation and render next generation
	// run generations every 1/5 of a second
	initGeneration();
	renderGeneration();
	setTimeout('runGeneration()', 200);
}

function initGeneration() {
	// conway's rules
	for (var y = 0; y < grid; y++) {
		for (var x = 0; x < grid; x++) {
			var cell = getCell(x, y);
			var neighbours = getLiveNeighboursCount(x, y);
			// if cell is living find out if it will survive next generation
			if (isLiveCell(x, y)) {
				if (neighbours === 2 || neighbours === 3) {
					cell.attr('live', 'true');
				}
			// if cell is dead find out if it will be born
			} else if (neighbours === 3) {
				cell.attr('live', 'true');
			}
		}
	}
}

function getLiveNeighboursCount(x, y) {
	// check the 8 surounding neighbours for living cells
	var count = 0;
	if (isLiveCell(x-1, y-1)) count++;
	if (isLiveCell(x, y-1)) count++;
	if (isLiveCell(x+1, y-1)) count++;
	if (isLiveCell(x-1, y)) count++;
	if (isLiveCell(x+1, y)) count++;
	if (isLiveCell(x-1, y+1)) count++;
	if (isLiveCell(x, y+1)) count++;
	if (isLiveCell(x+1, y+1)) count++;
	return count;
}

function isLiveCell(x, y) {
	// are we alive?
	return getCell(x, y).hasClass('alive');
}

function renderGeneration() {
	// iterate through all cells to render live/dead celss
	$cells.each(function () {
		var cell = $(this);
		cell.removeClass('alive');
		if (cell.attr('live') === 'true') {
			cell.addClass('alive');
		}
		cell.removeAttr('live');
	})
}
