import { useEffect, useState } from "react";
import "./ChampionPicker.css";

export default function ChampionPicker({ isOpen, onSelect, onClose, role }) {
  const [champions, setChampions] = useState([]);
  const [sortKey, setSortKey] = useState("tier");

  const sortedChampions = [...champions].sort((a, b) => {
    const valA = sortKey === "name" ? a.name : sortKey === "banrate" ? a.banrate : a[sortKey]?.[role];
    const valB = sortKey === "name" ? b.name : sortKey === "banrate" ? b.banrate : b[sortKey]?.[role];

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (sortKey === "name") return valA.localeCompare(valB);
    if (sortKey === "tier") {
      const tierOrder = ["S+", "S", "A", "B", "C", "D", "?"];
      return tierOrder.indexOf(valA) - tierOrder.indexOf(valB);
    }

    return valB - valA;
  });

  const getTierColor = (tier) => {
    switch (tier) {
      case "S+":
        return "#FFA51A";
      case "S":
        return "#3E99FA";
      case "A":
        return "#76B3F3";
      case "B":
        return "white";
      case "C":
        return "#FB9799";
      case "D":
        return "crimson";
      case "?":
        return "darkviolet";
      default:
        return "white";
    }
  };

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "champions.json")
      .then((res) => res.json())
      .then(setChampions);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Choisis un champion</h3>
        <div className="sort-buttons-wrapper">
          <div className="sort-buttons">
            <button onClick={() => setSortKey("tier")} className={`tier ${sortKey === "tier" ? "active" : ""}`}>Tier</button>
            <button onClick={() => setSortKey("winrate")} className={`winrate ${sortKey === "winrate" ? "active" : ""}`}>WinRate</button>
            <button onClick={() => setSortKey("pickrate")} className={`pickrate ${sortKey === "pickrate" ? "active" : ""}`}>PickRate</button>
          </div>
          <div className="sort-buttons-fixed">
            <button onClick={() => setSortKey("banrate")} className={`banrate ${sortKey === "banrate" ? "active" : ""}`}>BanRate</button>
            <button onClick={() => setSortKey("name")} className={`name ${sortKey === "name" ? "active" : ""}`}>Name</button>
          </div>
        </div>
        <div className="champion-gallery">
          {sortedChampions.map((champ) => (
            <div
              key={champ.name}
              onClick={() => onSelect(champ)}
              className="champion-option"
            >
              <img src={champ.img} alt={champ.name} width="64" />
              <h3>{champ.name}</h3>
              <p className="tier-notation" style={{ color: getTierColor(champ.tier?.[role]) }}>
                {champ.tier?.[role] != null ? `${champ.tier?.[role]}` : `N/A`}
              </p>
              <p className="winrate">
                {champ.winrate?.[role] != null ? `${champ.winrate?.[role]}%` : `N/A`}
              </p>
              <div className="complementary-infos">
                <p className="pickrate">
                  {champ.pickrate?.[role] != null ? `${champ.pickrate?.[role]}%` : `N/A`}
                </p>
                <p className="banrate">
                  {champ.banrate != null ? `${champ.banrate}%` : `N/A`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
