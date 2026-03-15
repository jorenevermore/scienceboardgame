import { useState, useEffect } from "react";
import "../styles/dice.css";

function Dice({ rollDice, dice, disabled }) {
  const [isRolling, setIsRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState(null);

  const getDiceDots = (number) => {
    const dotPatterns = {
      1: { positions: [[50, 50]] },
      2: { positions: [[25, 25], [75, 75]] },
      3: { positions: [[25, 25], [50, 50], [75, 75]] },
      4: { positions: [[25, 25], [75, 25], [25, 75], [75, 75]] },
      5: { positions: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]] },
      6: { positions: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]] }
    };
    return dotPatterns[number] || { positions: [] };
  };

  const handleRoll = () => {
    setIsRolling(true);
    setDisplayValue(null);
    rollDice();
    
    // Simulate rolling animation for 3 seconds
    setTimeout(() => {
      setIsRolling(false);
    }, 3000);
  };

  useEffect(() => {
    if (!isRolling && dice) {
      setDisplayValue(dice);
    }
  }, [dice, isRolling]);

  return (
    <div className="dice-container">
      <button onClick={handleRoll} disabled={disabled || isRolling} className="dice-btn">
        🎲 Roll Dice
      </button>

      <div className={`dice-display ${isRolling ? "rolling" : ""}`}>
        {isRolling ? (
          <>
            <div className="dice-face">
              {getDiceDots(1).positions.map((pos, i) => (
                <div key={i} className="dot" style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}></div>
              ))}
            </div>
            <div className="dice-face">
              {getDiceDots(2).positions.map((pos, i) => (
                <div key={i} className="dot" style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}></div>
              ))}
            </div>
            <div className="dice-face">
              {getDiceDots(3).positions.map((pos, i) => (
                <div key={i} className="dot" style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}></div>
              ))}
            </div>
            <div className="dice-face">
              {getDiceDots(4).positions.map((pos, i) => (
                <div key={i} className="dot" style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}></div>
              ))}
            </div>
            <div className="dice-face">
              {getDiceDots(5).positions.map((pos, i) => (
                <div key={i} className="dot" style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}></div>
              ))}
            </div>
            <div className="dice-face">
              {getDiceDots(6).positions.map((pos, i) => (
                <div key={i} className="dot" style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}></div>
              ))}
            </div>
          </>
        ) : (
          displayValue && (
            <div className="dice-result-display">
              {getDiceDots(displayValue).positions.map((pos, i) => (
                <div key={i} className="dot" style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}></div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Dice;