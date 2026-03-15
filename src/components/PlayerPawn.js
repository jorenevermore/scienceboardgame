function PlayerPawn({ player }) {
  return (
    <div
      className="pawn"
      style={{
        backgroundColor: player.color,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "10px",
        border: "2px solid black"
      }}
    >
      {player.name}
    </div>
  );
}

export default PlayerPawn;
