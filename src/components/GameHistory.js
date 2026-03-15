import React from "react";
import "../styles/gamehistory.css";

function GameHistory({ history }) {
  if (history.length === 0) {
    return (
      <div className="game-history">
        <h3>📋 Game History</h3>
        <p className="no-history">No moves yet. Start rolling the dice!</p>
      </div>
    );
  }

  return (
    <div className="game-history">
      <h3>📋 Game History</h3>
      <div className="history-list">
        {[...history].reverse().map((entry) => (
          <div
            key={entry.id}
            className={`history-entry ${entry.correct ? "correct" : "incorrect"}`}
          >
            <div className="history-header">
              <span className="player-name">{entry.player}</span>
              <span className={`result-badge ${entry.correct ? "correct" : "incorrect"}`}>
                {entry.correct ? "✓ Correct" : "✗ Wrong"}
              </span>
            </div>
            <div className="history-details">
              <span className="dice-info">Rolled: {entry.diceRoll}</span>
              <span className="position-info">
                Tile {entry.oldPos + 1} → Tile {entry.newPos + 1}
              </span>
            </div>
            <div className="history-time">{entry.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameHistory;
