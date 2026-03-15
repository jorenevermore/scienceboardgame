function Tile({ number, players }) {
  const playersHere = players.filter((p) => p.position === number);

  /* ── Vine pairs: each has a unique color class (A / B / C) ── */
  const vineStarts = {
    6:  { destination: 13, pair: "A" },   // tile 7  → tile 13
    9:  { destination: 16, pair: "B" },   // tile 10 → tile 16
    13: { destination: 20, pair: "C" },   // tile 14 → tile 20
  };

  const vineLandings = {
    12: { from: 7,  pair: "A" },          // tile 13 ← tile 7
    15: { from: 10, pair: "B" },          // tile 16 ← tile 10
    19: { from: 14, pair: "C" },          // tile 20 ← tile 14
  };

  const otherSpecials = {
    21: { type: "landslide", emoji: "⛰️" },
    23: { type: "landslide", emoji: "⛰️" },
    25: { type: "landslide", emoji: "⛰️" },
    29: { type: "landslide", emoji: "⛰️" },
    32: { type: "landslide", emoji: "⛰️" },
  };

  const vineStart   = vineStarts[number];
  const vineLanding = vineLandings[number];
  const other       = otherSpecials[number];
  const isFinal     = number === 34;

  /* Build className */
  let cls = "tile";
  if (vineStart)   cls += ` tile-vine-start tile-vine-${vineStart.pair}`;
  if (vineLanding) cls += ` tile-vine-land tile-vine-${vineLanding.pair}`;
  if (other)       cls += ` tile-${other.type}`;
  if (isFinal)     cls += " tile-final";

  return (
    <div className={cls}>
      {isFinal ? (
        <div className="final-stage-badge">
          <span className="final-text">FINAL STAGE</span>
          <img src="/virusking.png" alt="Boss" className="mini-boss-img" />
        </div>
      ) : (
        <span className="tile-number">{number + 1}</span>
      )}

      {/* Vine START tile: leaf + arrow to destination */}
      {vineStart && (
        <div className="vine-badge vine-start-badge">
          <span className="vine-icon">🌿</span>
          <span className="vine-label">→ {vineStart.destination}</span>
        </div>
      )}

      {/* Vine LANDING tile: sprout + from source */}
      {vineLanding && (
        <div className="vine-badge vine-land-badge">
          <span className="vine-icon">🌱</span>
          <span className="vine-label">from {vineLanding.from}</span>
        </div>
      )}

      {/* Other specials (landslide) */}
      {other && (
        other.type === "landslide"
          ? <span className="tile-special landslide-text">LANDSLIDE!!</span>
          : <span className="tile-special">{other.emoji}</span>
      )}

      {playersHere.length > 0 && (
        <div className="players">
          {playersHere.map((p, i) => (
            <div key={i} className="player" style={{ backgroundColor: p.color }} title={p.name}>
              {p.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tile;