import { useState, useEffect, useCallback } from "react";

function QuestionModal({ question, diceRoll, onAnswer, currentPlayer, isLandslide, isVirusAttack }) {
  const [timeLeft, setTimeLeft] = useState(45);
  const [userAnswer, setUserAnswer] = useState("");
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    console.log(`QuestionModal mounted: Player=${currentPlayer.name}, DiceRoll=${diceRoll}`);
  }, [diceRoll, currentPlayer.name]);

  const handleTimeout = useCallback(() => {
    console.log(`TIMEOUT: Player=${currentPlayer.name}, DiceRoll=${diceRoll}`);
    setAnswered(true);
    setTimeout(() => { onAnswer(false, diceRoll); }, 1500);
  }, [currentPlayer.name, diceRoll, onAnswer]);

  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered, handleTimeout]);

  const checkCorrect = () => {
    if (!question) return false;
    // Types with options (Multiple Choice, Short Answer, Diagram Labeling, Situational)
    if (question.options) {
      return userAnswer === question.correct;
    }
    // True or False
    if (question.type === "True or False") {
      return userAnswer === question.correct.toString();
    }
    // Identification (text input)
    return userAnswer.toLowerCase().trim() === question.correct.toLowerCase().trim();
  };

  const handleSubmit = () => {
    const isCorrect = checkCorrect();
    console.log(`SUBMIT: Player=${currentPlayer.name}, DiceRoll=${diceRoll}, Answer=${userAnswer}, Correct=${isCorrect}`);
    setAnswered(true);
    setTimeout(() => { onAnswer(isCorrect, diceRoll); }, 1500);
  };

  if (!question) return null;

  /* Does this question use clickable option buttons? */
  const hasOptions = question.options && question.options.length > 0;
  /* Is this a text-input question? (Identification only now) */
  const isTextInput = question.type === "Identification";
  /* Is this True/False? */
  const isTrueFalse = question.type === "True or False";

  const isCorrect = checkCorrect();

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          {isVirusAttack ? "🦠 Virus Attack!" : isLandslide ? "⛰️ Landslide Challenge!" : `${currentPlayer.name}'s Turn`}
        </h2>
        
        {isLandslide && (
          <div className="landslide-warning">
            ⚠️ Answer correctly or slide back 10 tiles!
          </div>
        )}
        
        {isVirusAttack && (
          <div className="virus-warning">
            ⚠️ Answer correctly to deal 15 damage to the virus!
          </div>
        )}
        <p className="dice-info">Dice Roll: {diceRoll} ({question.type})</p>

        <div className="timer" style={{ color: timeLeft <= 10 ? "red" : undefined }}>
          Time Left: {timeLeft}s
        </div>

        <div className="question">
          {/* Show diagram image for Diagram Labeling questions */}
          {question.image && (
            <div className="diagram-container">
              <img
                src={question.image}
                alt="Diagram"
                className="diagram-image"
              />
            </div>
          )}

          <h3>{question.question}</h3>

          {/* Option buttons (Multiple Choice, Short Answer, Diagram Labeling, Situational) */}
          {hasOptions && (
            <div className="options">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option ${userAnswer === option ? "selected" : ""}`}
                  onClick={() => setUserAnswer(option)}
                  disabled={answered}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* True/False buttons */}
          {isTrueFalse && (
            <div className="options">
              <button
                className={`option ${userAnswer === "true" ? "selected" : ""}`}
                onClick={() => setUserAnswer("true")}
                disabled={answered}
              >
                True
              </button>
              <button
                className={`option ${userAnswer === "false" ? "selected" : ""}`}
                onClick={() => setUserAnswer("false")}
                disabled={answered}
              >
                False
              </button>
            </div>
          )}

          {/* Text input (Identification only) */}
          {isTextInput && (
            <input
              type="text"
              placeholder="Type your answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !answered && handleSubmit()}
              disabled={answered}
              className="answer-input"
            />
          )}
        </div>

        {answered && (
          <div className={`answer-result ${isCorrect ? "correct" : "incorrect"}`}>
            <p>{isCorrect ? "✓ Correct!" : `✗ Incorrect! The answer is: ${question.correct}`}</p>
          </div>
        )}

        {!answered && (
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Answer
          </button>
        )}
      </div>
    </div>
  );
}

export default QuestionModal;
