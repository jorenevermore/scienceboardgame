import { useState } from "react";

const COLORS = ["red", "blue", "green", "orange", "purple", "pink"];
const PLAYER_NAMES = ["A", "B", "C", "D"];

function GameSetup({ onStartGame }) {
  const [playerCount, setPlayerCount] = useState(2);
  const [selectedColors, setSelectedColors] = useState(["red", "blue"]);

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    setSelectedColors(COLORS.slice(0, count));
  };

  const handleColorChange = (index, color) => {
    const updated = [...selectedColors];
    updated[index] = color;
    setSelectedColors(updated);
  };

  const handleStartGame = () => {
    const players = PLAYER_NAMES.slice(0, playerCount).map((name, i) => ({
      name: name,
      position: 0,
      color: selectedColors[i],
      hp: 0
    }));
    onStartGame(players);
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h1>🧬 Science Virus Board Game 🧬</h1>
        <p className="setup-subtitle">Select number of players and customize your teams</p>

        {/* Player Count Selection */}
        <div className="player-count-section">
          <h2>How many players?</h2>
          <div className="count-buttons">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                className={`count-btn ${playerCount === count ? "active" : ""}`}
                onClick={() => handlePlayerCountChange(count)}
              >
                {count} Players
              </button>
            ))}
          </div>
        </div>

        {/* Player Configuration */}
        <div className="players-config">
          <h2>Choose Team Colors</h2>
          <div className="players-grid">
            {PLAYER_NAMES.slice(0, playerCount).map((name, index) => (
              <div key={index} className="player-config-card">
                <div className="player-label">Team {name}</div>

                <div className="color-selector">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${selectedColors[index] === color ? "selected" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(index, color)}
                      title={color}
                    />
                  ))}
                </div>

                <div
                  className="color-preview"
                  style={{ backgroundColor: selectedColors[index] }}
                >
                  <span>{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button className="start-btn" onClick={handleStartGame}>
          Start Game 🚀
        </button>
      </div>
    </div>
  );
}

export default GameSetup;
