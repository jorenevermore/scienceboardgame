import { useState, useCallback, useRef } from "react";
import Board from "./components/Board";
import Dice from "./components/Dice";
import QuestionModal from "./components/QuestionModal";
import GameHistory from "./components/GameHistory";
import GameSetup from "./components/GameSetup";
import questions from "./data/questions.json";
import "./App.css";

const SPECIAL_TILES = {
  6:  { type: "vine-up", destination: 12 },   // tile 7  → tile 13
  9:  { type: "vine-up", destination: 15 },   // tile 10 → tile 16
  13: { type: "vine-up", destination: 19 },   // tile 14 → tile 20
  21: { type: "landslide" },                  // tile 22
  23: { type: "landslide" },                  // tile 24
  25: { type: "landslide" },                  // tile 26
  29: { type: "landslide" },                  // tile 30
  32: { type: "landslide" }                   // tile 33
};

function App() {
  const FINAL_TILE = 34;
  const VIRUS_HP = 90;

  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([
    { name: "A", position: 0, color: "red", hp: 0 }, // TEMP: testing landslide
    { name: "B", position: 0, color: "blue", hp: 0 },
    { name: "C", position: 0, color: "green", hp: 0 },
    { name: "D", position: 0, color: "orange", hp: 0 }
  ]);

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [dice, setDice] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gameStatus, setGameStatus] = useState("ready");
  const [virusHP, setVirusHP] = useState(VIRUS_HP);
  const [winner, setWinner] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVirusDamaged, setIsVirusDamaged] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState(null);

  const playerIndexRef = useRef(0);
  const answerProcessedRef = useRef(false);
  const usedQuestionsRef = useRef({});
  const virusAttackRef = useRef(false);

  const handleStartGame = useCallback((configuredPlayers) => {
    setPlayers(configuredPlayers);
    setGameStarted(true);
    setCurrentPlayer(0);
    playerIndexRef.current = 0;
    usedQuestionsRef.current = {};
  }, []);

  const getRandomQuestion = (diceNumber) => {
    const types = ["multipleChoice", "identification", "trueOrFalse", "shortAnswer", "diagramLabeling", "problemSolving"];
    const type = types[diceNumber - 1];
    const questionsOfType = questions[type];

    // Get or initialize used indices for this type
    if (!usedQuestionsRef.current[type] || usedQuestionsRef.current[type].length === 0) {
      // Shuffle all indices for this type
      const indices = Array.from({ length: questionsOfType.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      usedQuestionsRef.current[type] = indices;
    }

    // Pop the next question index from the shuffled pool
    const nextIndex = usedQuestionsRef.current[type].pop();
    return questionsOfType[nextIndex];
  };

  const rollDice = () => {
    if (gameStatus !== "ready" || showQuestion || isAnimating) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
    playerIndexRef.current = currentPlayer;
    answerProcessedRef.current = false;

    const question = getRandomQuestion(roll);
    setCurrentQuestion(question);
    setGameStatus("answering");

    setTimeout(() => {
      setShowQuestion(true);
    }, 3200);
  };

  const handleModalClose = () => {
    answerProcessedRef.current = false;
  };

  /* ── Animate the player token hopping tile-by-tile ── */
  const animateMovement = useCallback((playerIdx, fromPos, toPos, onDone) => {
    setIsAnimating(true);
    const step = fromPos < toPos ? 1 : -1;
    let current = fromPos;

    const hop = () => {
      current += step;
      setPlayers((prev) => {
        const updated = prev.map((p) => ({ ...p }));
        updated[playerIdx].position = current;
        return updated;
      });

      if (current !== toPos) {
        setTimeout(hop, 250);
      } else {
        setIsAnimating(false);
        if (onDone) onDone(current);
      }
    };

    if (fromPos === toPos) {
      setIsAnimating(false);
      if (onDone) onDone(toPos);
      return;
    }

    setTimeout(hop, 250);
  }, []);

  /* ── Ref to track if current question is a landslide challenge ── */
  const landslideRef = useRef(false);

  /* ── Trigger a landslide question after landing ── */
  const triggerLandslideQuestion = useCallback((playerIndex) => {
    landslideRef.current = true;
    answerProcessedRef.current = false;
    const randomRoll = Math.floor(Math.random() * 6) + 1;
    const question = getRandomQuestion(randomRoll);
    setDice(randomRoll);
    setCurrentQuestion(question);
    setGameStatus("answering");
    setTimeout(() => {
      setShowQuestion(true);
    }, 600);
  }, []);

  const handleVirusAttack = useCallback(() => {
    virusAttackRef.current = true;
    answerProcessedRef.current = false;
    playerIndexRef.current = currentPlayer;

    const randomRoll = Math.floor(Math.random() * 6) + 1;
    const question = getRandomQuestion(randomRoll);
    setDice(randomRoll);
    setCurrentQuestion(question);
    setGameStatus("answering");
    setTimeout(() => {
      setShowQuestion(true);
    }, 600);
  }, [currentPlayer]);

  const handleAnswer = useCallback((isCorrect, diceRoll) => {
    if (answerProcessedRef.current === true) return;
    answerProcessedRef.current = true;

    const playerIndex = playerIndexRef.current;
    const startingPos = players[playerIndex].position;
    const isLandslide = landslideRef.current;
    landslideRef.current = false;

    /* ── VIRUS ATTACK answer ── */
    if (virusAttackRef.current) {
      // Don't clear virusAttackRef if answer is correct, so they can keep attacking
      if (!isCorrect) {
        virusAttackRef.current = false;
      }
      setShowQuestion(false);

      setGameHistory((prevHistory) => [
        ...prevHistory,
        {
          id: prevHistory.length,
          player: players[playerIndex].name,
          diceRoll,
          correct: isCorrect,
          oldPos: startingPos,
          newPos: startingPos,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);

      if (isCorrect) {
        const damage = 15;
        
        // Trigger damage animations
        setIsVirusDamaged(true);
        setFloatingDamage(damage);
        
        setTimeout(() => {
          setIsVirusDamaged(false);
          setFloatingDamage(null);
        }, 1000); // clear animation states

        setVirusHP((hp) => {
          const newHP = Math.max(hp - damage, 0);
          if (newHP === 0) {
            setWinner(players[playerIndex]);
          }
          return newHP;
        });
        
        // Wait a moment for damage animations to play, then auto-trigger the next attack if not won yet
        setTimeout(() => {
          setVirusHP((currentHP) => {
            if (currentHP > 0) {
               handleVirusAttack(); // Trigger next attack directly
            }
            return currentHP;
          });
        }, 1500);

      } else {
        // Incorrect answer -> pass turn
        setTimeout(() => {
          const nextPlayerIdx = (playerIndex + 1) % players.length;
          setCurrentPlayer(nextPlayerIdx);
          playerIndexRef.current = nextPlayerIdx;
          
          if (players[nextPlayerIdx].position >= FINAL_TILE) {
            setGameStatus("virus-battle");
          } else {
            setGameStatus("ready");
          }
        }, 1000);
      }
      return;
    }

    /* ── LANDSLIDE answer ── */
    if (isLandslide) {
      setShowQuestion(false);

      setGameHistory((prevHistory) => [
        ...prevHistory,
        {
          id: prevHistory.length,
          player: players[playerIndex].name,
          diceRoll,
          correct: isCorrect,
          oldPos: startingPos,
          newPos: isCorrect ? startingPos : Math.max(startingPos - 10, 0),
          timestamp: new Date().toLocaleTimeString()
        }
      ]);

      if (!isCorrect) {
        // Wrong → slide back 10 tiles
        const slideTarget = Math.max(startingPos - 10, 0);
        setTimeout(() => {
          animateMovement(playerIndex, startingPos, slideTarget, () => {
            setTimeout(() => {
              const nextPlayerIdx = (playerIndex + 1) % players.length;
              setCurrentPlayer(nextPlayerIdx);
              playerIndexRef.current = nextPlayerIdx;
              
              if (players[nextPlayerIdx].position >= FINAL_TILE) {
                setGameStatus("virus-battle");
              } else {
                setGameStatus("ready");
              }
            }, 800);
          });
        }, 500);
      } else {
        // Correct → stay, pass turn
        setTimeout(() => {
          const nextPlayerIdx = (playerIndex + 1) % players.length;
          setCurrentPlayer(nextPlayerIdx);
          playerIndexRef.current = nextPlayerIdx;
          
          if (players[nextPlayerIdx].position >= FINAL_TILE) {
            setGameStatus("virus-battle");
          } else {
            setGameStatus("ready");
          }
        }, 1000);
      }
      return;
    }

    /* ── NORMAL answer ── */
    const logNewPos = isCorrect ? Math.min(startingPos + diceRoll, FINAL_TILE) : startingPos;
    setGameHistory((prevHistory) => [
      ...prevHistory,
      {
        id: prevHistory.length,
        player: players[playerIndex].name,
        diceRoll,
        correct: isCorrect,
        oldPos: startingPos,
        newPos: logNewPos,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    setShowQuestion(false);

    if (!isCorrect) {
      setTimeout(() => {
        const nextPlayerIdx = (playerIndex + 1) % players.length;
        setCurrentPlayer(nextPlayerIdx);
        playerIndexRef.current = nextPlayerIdx;
        
        if (players[nextPlayerIdx].position >= FINAL_TILE) {
          setGameStatus("virus-battle");
        } else {
          setGameStatus("ready");
        }
      }, 1000);
      return;
    }

    // Correct answer — animate hopping to new position
    const directPos = Math.min(startingPos + diceRoll, FINAL_TILE);

    animateMovement(playerIndex, startingPos, directPos, (landedPos) => {
      const special = SPECIAL_TILES[landedPos];

      if (special && special.type === "vine-up") {
        setTimeout(() => {
          const vineTarget = Math.min(special.destination, FINAL_TILE);
          animateMovement(playerIndex, landedPos, vineTarget, (finalPos) => {
            setTimeout(() => {
              if (finalPos < FINAL_TILE) {
                const nextPlayerIdx = (playerIndex + 1) % players.length;
                setCurrentPlayer(nextPlayerIdx);
                playerIndexRef.current = nextPlayerIdx;
                
                if (players[nextPlayerIdx].position >= FINAL_TILE) {
                  setGameStatus("virus-battle");
                } else {
                  setGameStatus("ready");
                }
              } else {
                setGameStatus("virus-battle");
              }
            }, 800);
          });
        }, 400);
      } else if (special && special.type === "landslide") {
        // Auto-trigger landslide question
        setTimeout(() => {
          triggerLandslideQuestion(playerIndex);
        }, 500);
      } else {
        setTimeout(() => {
          if (landedPos < FINAL_TILE) {
            const nextPlayerIdx = (playerIndex + 1) % players.length;
            setCurrentPlayer(nextPlayerIdx);
            playerIndexRef.current = nextPlayerIdx;
            
            if (players[nextPlayerIdx].position >= FINAL_TILE) {
              setGameStatus("virus-battle");
            } else {
              setGameStatus("ready");
            }
          } else {
            // Player just reached Virus tile -> do NOT pass turn!
            setGameStatus("virus-battle");
          }
        }, 800);
      }
    });
  }, [players, animateMovement, triggerLandslideQuestion, handleVirusAttack]);

  const resetGame = useCallback(() => {
    setPlayers([
      { name: "A", position: 0, color: "red", hp: 0 },
      { name: "B", position: 0, color: "blue", hp: 0 },
      { name: "C", position: 0, color: "green", hp: 0 },
      { name: "D", position: 0, color: "orange", hp: 0 }
    ]);
    setCurrentPlayer(0);
    playerIndexRef.current = 0;
    answerProcessedRef.current = false;
    setDice(null);
    setShowQuestion(false);
    setCurrentQuestion(null);
    setGameStatus("ready");
    setVirusHP(VIRUS_HP);
    setWinner(null);
    setGameHistory([]);
    setGameStarted(false);
    setIsAnimating(false);
    setIsVirusDamaged(false);
    setFloatingDamage(null);
  }, [VIRUS_HP]);

  return (
    <>
      <div className={!gameStarted ? "app-container blurred" : "app-container"}>
        <h1>🧬 Science Virus Board Game 🧬</h1>

        {winner ? (
          <div className="winner-screen">
            <h2>🎉 {winner.name} Wins! 🎉</h2>
            <p>Congratulations! You defeated the virus!</p>
            <button onClick={resetGame} className="reset-btn">Play Again</button>
          </div>
        ) : (
          <>
            <div className="main-content">
              <div className="board-section">
                <div className="game-info">
                  <div className="player-turn">
                    <h2>Current Turn: {players[currentPlayer].name}</h2>
                  </div>

                  {players[currentPlayer].position < FINAL_TILE && (
                    <Dice rollDice={rollDice} dice={dice} disabled={showQuestion || gameStatus !== "ready" || isAnimating} />
                  )}
                </div>

                <Board players={players} />
              </div>

              <div className="sidebar">
                <div className="player-stats">
                  <h3>Team Stats</h3>
                  {players.map((player) => (
                    <div key={player.name} className="stat">
                      <span style={{ color: player.color, fontWeight: "bold" }}>
                        {player.name}
                      </span>
                      : {player.position >= FINAL_TILE ? "Boss" : `${player.position + 1}/35`}
                    </div>
                  ))}
                </div>

                <GameHistory history={gameHistory} />
              </div>
            </div>

            {/* VIRUS BATTLE MODAL */}
            {players[currentPlayer].position >= FINAL_TILE && (gameStatus === "virus-battle" || gameStatus === "answering" || isVirusDamaged) && (
              <div className="virus-battle-overlay">
                <div className="virus-battle-modal">
                  <div className="virus-battle-header">
                    <h2>🦠 Virus King Battle 🦠</h2>
                    <p className="virus-subtitle">Answer correctly to deal damage. Answer wrong and your turn ends!</p>
                  </div>
                  
                  <div className="virus-entity-container">
                    <div className={`virus-entity ${isVirusDamaged ? "taking-damage" : "idle"}`}>
                      <img src="/virusking.png" alt="Virus King Boss" className="virus-boss-img" />
                    </div>
                    {floatingDamage && (
                      <div key={Date.now()} className="damage-popup">
                        -{floatingDamage}
                      </div>
                    )}
                  </div>

                  <div className="virus-dashboard">
                    <div className="virus-hp-container">
                      <div className="virus-hp">
                        <p>Virus HP: {virusHP} / {VIRUS_HP}</p>
                        <div className="hp-bar">
                          <div
                            key={`hp-fill-${isVirusDamaged ? Date.now() : 'idle'}`}
                            className={`hp-fill ${isVirusDamaged ? "hp-damage-flash" : ""}`}
                            style={{ width: `${(virusHP / VIRUS_HP) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {gameStatus === "virus-battle" && !isVirusDamaged && !isAnimating && (
                      <button 
                         onClick={handleVirusAttack} 
                         className="boss-attack-btn"
                      >
                        ⚔️ Attack the Virus!
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showQuestion && (
              <QuestionModal
                question={currentQuestion}
                diceRoll={dice}
                onAnswer={handleAnswer}
                onClose={handleModalClose}
                currentPlayer={players[currentPlayer]}
                isLandslide={landslideRef.current}
                isVirusAttack={virusAttackRef.current}
              />
            )}
          </>
        )}
      </div>

      {!gameStarted && <GameSetup onStartGame={handleStartGame} />}
    </>
  );
}

export default App;