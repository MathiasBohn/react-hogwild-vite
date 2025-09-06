import { useState } from "react";
import Nav from "./Nav";
import hogsData from "../porkers_data";

function App() {
  const [hogs, setHogs] = useState(hogsData);
  const [greasedOnly, setGreasedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("none");
  const [hidden, setHidden] = useState([]); 
  const [open, setOpen] = useState([]);  
  const [form, setForm] = useState({ name: "", weight: "", specialty: "", greased: false, medal: "bronze", image: "" });
  const medals = ["wood","bronze","silver","gold","platinum","diamond"];

  const visible = [...hogs]
    .filter(h => (!greasedOnly || h.greased) && !hidden.includes(h.name))
    .sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : sortBy === "weight" ? a.weight - b.weight : 0);

  const onFormChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setHogs(v => [{
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      greased: !!form.greased,
      weight: Number(form.weight) || 0,
      "highest medal achieved": form.medal,
      image: form.image.trim() || "https://placehold.co/600x400?text=Hog",
    }, ...v]);
    setForm({ name: "", weight: "", specialty: "", greased: false, medal: "bronze", image: "" });
  };

  return (
    <div className="App ui container">
      <Nav />

      <div className="ui segment">
        <div className="ui form inline fields">
          <div className="field">
            <div className="ui checkbox">
              <input id="filter-greased" type="checkbox" checked={greasedOnly} onChange={e => setGreasedOnly(e.target.checked)} />
              <label htmlFor="filter-greased">Greased Pigs Only?</label>
            </div>
          </div>
          <div className="field">
            <label htmlFor="sort-select" style={{ marginRight: 8 }}>Sort by:</label>
            <select id="sort-select" className="ui dropdown" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="none">None</option>
              <option value="name">Name (A→Z)</option>
              <option value="weight">Weight (light→heavy)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="ui segment">
        <form className="ui form" onSubmit={onAdd}>
          <div className="three fields">
            <div className="field">
              <label htmlFor="hog-name">Name:</label>
              <input id="hog-name" name="name" value={form.name} onChange={onFormChange} />
            </div>
            <div className="field">
              <label htmlFor="hog-weight">Weight:</label>
              <input id="hog-weight" name="weight" type="number" step="0.1" value={form.weight} onChange={onFormChange} />
            </div>
            <div className="field">
              <label htmlFor="hog-specialty">Specialty:</label>
              <input id="hog-specialty" name="specialty" value={form.specialty} onChange={onFormChange} />
            </div>
          </div>

          <div className="three fields">
            <div className="field">
              <div className="ui checkbox">
                <input id="hog-greased" name="greased" type="checkbox" checked={form.greased} onChange={onFormChange} />
                <label htmlFor="hog-greased">Greased?</label>
              </div>
            </div>
            <div className="field">
              <label htmlFor="hog-medal">Highest Medal Achieved:</label>
              <select id="hog-medal" name="medal" className="ui dropdown" value={form.medal} onChange={onFormChange}>
                {medals.map(m => <option key={m} value={m}>{m} medal</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="hog-image">Image URL:</label>
              <input id="hog-image" name="image" type="url" value={form.image} onChange={onFormChange} />
            </div>
          </div>

          <button className="ui primary button" type="submit">Add Hog</button>
        </form>
      </div>

      <div className="ui three stackable cards" role="list">
        {visible.map(hog => {
          const isOpen = open.includes(hog.name);
          return (
            <div
              key={hog.name}
              aria-label="hog card"
              className="ui card"
              role="listitem"
              onClick={() => setOpen(xs => xs.includes(hog.name) ? xs.filter(n => n !== hog.name) : [...xs, hog.name])}
            >
              <div className="image">
                <img src={hog.image} alt={`Photo of ${hog.name}`} />
              </div>

              <div className="content">
                <h3 className="header" style={{ margin: 0 }}>{hog.name}</h3>
              </div>

              {isOpen && (
                <div className="content">
                  <div>Specialty: {hog.specialty}</div>
                  <div>{hog.weight}</div>
                  <div>{hog.greased ? "Greased" : "Nongreased"}</div>
                  <div>{hog["highest medal achieved"]}</div>
                </div>
              )}

              <div className="extra content">
                <button
                  className="ui tiny red button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHidden(xs => xs.includes(hog.name) ? xs : [...xs, hog.name]);
                  }}
                >
                  Hide Me
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;