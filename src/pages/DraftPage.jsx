import { useState } from "react";
import ChampionCard from "../components/ChampionCard";
import ChampionPicker from "../components/ChampionPicker";
import "./DraftPage.css";

export default function DraftPage() {
  const [team, setTeam] = useState([null, null, null, null, null]);
  const [modalIndex, setModalIndex] = useState(null);
  const [zoom, setZoom] = useState(100);
  
  const increaseZoom = () => {
    setZoom(prev => Math.min(prev + 10, 250));
  };
  const decreaseZoom = () => {
    setZoom(prev => Math.max(prev - 10, 100));
  };

  const handleChampionSelect = (champ) => {
    const positionMap = ["top", "jgl", "mid", "bot", "sup"];
    const role = positionMap[modalIndex];
    const tier = champ.tier?.[role] ?? null;
    const winrate = champ.winrate?.[role] ?? null;
    const pickrate = champ.pickrate?.[role] ?? null;
    const banrate = champ.banrate ?? null;
    const updated = [...team];
    updated[modalIndex] = { ...champ, tier, winrate, pickrate, banrate, role };
    setTeam(updated);
    setModalIndex(null);
  };

  const averageWR = () => {
    const values = team.map((c) => c?.winrate).filter((w) => w != null);
    if (values.length === 0) return "N/A";
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) + "%";
  };

  const removeChampion = (index) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const positionMap = ["top", "jgl", "mid", "bot", "sup"];
  const currentRole = modalIndex !== null ? positionMap[modalIndex] : null;

  return (
    <div className="draft-page">
      <div style={{ zoom: `${zoom}%` }}>
        <h1>Draft équipe</h1>
        <div className="zoom-controls">
          <button className="minus" onClick={decreaseZoom} disabled={zoom <= 100}>-</button>
          <button onClick={increaseZoom} disabled={zoom >= 250}>+</button>
        </div>
        <div className="draft-team">
          {team.map((champ, i) => (
            <ChampionCard
              key={i}
              champion={champ}
              onClick={() => setModalIndex(i)}
              onRemove={() => removeChampion(i)}
            />
          ))}
        </div>
        <h2>Champion Winrate moyen : {averageWR()}</h2>
      </div>
        <ChampionPicker
          isOpen={modalIndex !== null}
          onSelect={handleChampionSelect}
          onClose={() => setModalIndex(null)}
          role={currentRole}
          zoom={zoom}
        />
    </div>
  );
}
