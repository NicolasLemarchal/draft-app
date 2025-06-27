import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "./ChampionCard.css";

export default function ChampionCard({ champion, onClick, onRemove }) {
  const [flipped, setFlipped] = useState(false);
  const [playerStats, setPlayerStats] = useState(null);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    setPlayerStats(null);

    if (playerName && champion) {
      fetchPlayerStats(playerName, champion);
    }
  }, [champion]);

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

  const fetchPlayerStats = async (playerName, champion) => {
    const roleMap = {
      top: "Top",
      jgl: "Jungle",
      mid: "Middle",
      bot: "ADC",
      sup: "Support"
    };

    const dbRole = roleMap[champion.role?.toLowerCase()] ?? champion.role;

    const { data: stats, error } = await supabase
      .rpc("get_player_champion_stats", {
        player_name_input: playerName,
        champion_name_input: champion.name,
        role_input: dbRole,
      });

    if (error) return setPlayerStats({ error: "Erreur lors de la récupération des données." });

    if (!stats || stats.length === 0) {
      return setPlayerStats({ error: "Aucune statistique trouvée." });
    }

    const stat = stats[0];
    setPlayerStats({
      players: {
        name: stat.player_name,
        url: stat.player_url
      },
      champions: {
        name: stat.champion_name
      },
      role: stat.role,
      kda: stat.kda,
      kp: stat.kp,
      win_pct: stat.win_pct
    });
  };

  return (
    <div className="card-wrapper" onClick={onClick}>
      <div className={`champion-card ${flipped ? "flipped" : ""}`}>
        <div className="card-face card-front">
          {champion ? (
            <>
              <div className="flip-button spin" onClick={handleFlip}>↻</div>
              <div className="remove-button" onClick={(e) => { e.stopPropagation(); onRemove?.(); }}>✕</div>
              <img src={champion.img} alt={champion.name} />
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
          <div className="flip-button spin-reverse" onClick={(e) => { e.stopPropagation(); setFlipped(false); }}>↺</div>
          {playerStats ? (
            <>
              <div
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPlayerStats(null);
                  setPlayerName("");
                }}
              >
                ✕
              </div>
              {playerStats.players?.url && (
                <img
                  src={playerStats.players.url}
                  className="pdp_players"
                  alt={playerStats.players.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlayerStats(null);
                    setPlayerName("");
                  }}
                />
              )}
              <div className="player-stats">
                {playerStats.error ? (
                  <p className="error-msg">{playerStats.error}</p>
                ) : (
                  <>
                    <p>KDA: {playerStats.kda}</p>
                    <p>KP: {playerStats.kp}%</p>
                    <p>Win%: {playerStats.win_pct}%</p>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <p>Choix du <strong>Joueur</strong> sur <strong>{champion?.name}</strong></p>
              <input
                type="text"
                placeholder="Nom du joueur"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetchPlayerStats(playerName, champion);
                }}
              >
                Valider
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
