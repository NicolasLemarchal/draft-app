import { useState } from "react";
import "./ChampionCard.css";

export default function ChampionCard({ champion, onClick, onRemove }) {
  const [flipped, setFlipped] = useState(false);

  const getTierColor = (tier) => {
    switch (tier) {
      case "S+": return "#FFA51A";
      case "S": return "#3E99FA";
      case "A": return "#76B3F3";
      case "B": return "white";
      case "C": return "#FB9799";
      case "D": return "crimson";
      case "?": return "darkviolet";
      default: return "white";
    }
  };

  const handleFlip = (e) => {
    e.stopPropagation();
    setFlipped(!flipped);
  };

  return (
    <div className="card-wrapper" onClick={onClick}>
      <div className={`champion-card ${flipped ? "flipped" : ""}`}>
        <div className="card-face card-front">
          {champion ? (
            <>
              <div className="flip-button spin" onClick={handleFlip}>↻</div>
              <div className="remove-button" onClick={(e) => { e.stopPropagation(); onRemove?.(); }}>✕</div>
              <img src={champion.img} alt={champion.name} width="64" />
              <h3>{champion.name}</h3>
              <p className="tier-notation" style={{ color: getTierColor(champion.tier) }}>
                {champion.tier != null ? `${champion.tier}` : `N/A`}
              </p>
              <p className="winrate">
                {champion.winrate != null ? `${champion.winrate}%` : `N/A`}
              </p>
              <div className="complementary-infos">
                <p className="pickrate">
                  {champion.pickrate != null ? `${champion.pickrate}%` : `N/A`}
                </p>
                <p className="banrate">
                  {champion.banrate != null ? `${champion.banrate}%` : `N/A`}
                </p>
              </div>
            </>
          ) : (
            <p>Choix du Champion</p>
          )}
        </div>
        <div className="card-face card-back">
          <div className="flip-button spin-reverse" onClick={handleFlip}>↺</div>
          <p>Choix du Joueur sur {champion?.name}</p>
        </div>
      </div>
    </div>
  );
}
