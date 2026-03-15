import Tile from "./Tile";

function Board({ players }) {
  /* ── Serpentine layout (like Snakes & Ladders) ──
     Tile 1 starts at the bottom-left, zig-zags up to tile 35 at the top.
     Even rows from bottom go left→right, odd rows go right→left. */
  const COLS = 5;
  const ROWS = 7;
  const boardOrder = [];

  for (let row = ROWS - 1; row >= 0; row--) {
    const start = row * COLS;
    const rowTiles = [];
    for (let col = 0; col < COLS; col++) {
      rowTiles.push(start + col);
    }
    // Odd rows from bottom go right-to-left
    const rowFromBottom = ROWS - 1 - row;
    if (rowFromBottom % 2 === 1) {
      rowTiles.reverse();
    }
    boardOrder.push(...rowTiles);
  }

  return (
    <div className="board">
      {boardOrder.map((tile) => (
        <Tile key={tile} number={tile} players={players} />
      ))}
    </div>
  );
}

export default Board;