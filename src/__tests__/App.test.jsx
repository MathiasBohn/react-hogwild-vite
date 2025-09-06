import { render, screen, fireEvent } from "@testing-library/react";
import App from "../components/App";
import hogs from "../porkers_data";

describe("Hog App", () => {
  it("displays a tile for each hog on load", () => {
    render(<App />);
    hogs.forEach((hog) => {
      expect(screen.getByText(hog.name)).toBeInTheDocument();
      const img = screen.getByAltText("Photo of " + hog.name);
      expect(img).toHaveAttribute("src", hog.image);
    });
  });

  it("displays additional hog details when a tile is clicked", () => {
    render(<App />);
    const index = Math.floor(Math.random() * 11)
    const hogTile = screen.getByText(hogs[index].name);
    hogTile.parentElement.parentElement
    fireEvent.click(hogTile);

    expect(screen.getByText(`Specialty: ${hogs[index].specialty}`)).toBeInTheDocument();
    expect(screen.getByText(hogs[index].weight)).toBeInTheDocument();
    expect(screen.getByText(hogs[index].greased ? "Greased" : "Nongreased")).toBeInTheDocument();
    expect(screen.getByText(hogs[index]["highest medal achieved"])).toBeInTheDocument();
  });

  it("filters hogs by greased status", () => {
    render(<App />);
    const filterCheckbox = screen.getByLabelText("Greased Pigs Only?");
    fireEvent.click(filterCheckbox);

    hogs.filter((hog) => hog.greased).forEach((hog) => {
      expect(screen.getByText(hog.name)).toBeInTheDocument();
    });

    hogs.filter((hog) => !hog.greased).forEach((hog) => {
      expect(screen.queryByText(hog.name)).not.toBeInTheDocument();
    });
  });

  it("sorts hogs by name or weight", () => {
    render(<App />);

    const sortBySelect = screen.getByLabelText("Sort by:");
    
    fireEvent.change(sortBySelect, { target: { value: "name" } });

    const sortedByName = [...hogs].sort((a, b) => a.name.localeCompare(b.name));
    const renderedHogNamesByName = screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent);

    expect(renderedHogNamesByName).toEqual(sortedByName.map((hog) => hog.name));

    fireEvent.change(sortBySelect, { target: { value: "weight" } });

    const sortedByWeight = [...hogs].sort((a, b) => a.weight - b.weight);
    const renderedHogNamesByWeight = screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent);

    expect(renderedHogNamesByWeight).toEqual(sortedByWeight.map((hog) => hog.name));
  });

  it("hides a hog when the hide button is clicked", () => {
    render(<App />);
    const sortBySelect = screen.getByLabelText("Sort by:");
    fireEvent.change(sortBySelect, { target: { value: "name" } });

    const hideButtons = screen.getAllByRole("button", {name: 'Hide Me'});
    fireEvent.click(hideButtons[0]);

    const sortedHogsByName = [...hogs].sort((a, b) => a.name.localeCompare(b.name));

    expect(screen.queryByText(sortedHogsByName[0].name)).not.toBeInTheDocument();
  });

  it("adds a new hog via the form", () => {
    render(<App />);
    const nameInput = screen.getByLabelText("Name:");
    const weightInput = screen.getByLabelText("Weight:");
    const specialtyInput = screen.getByLabelText("Specialty:");
    const greasedCheckbox = screen.getByLabelText("Greased?");
    const addButton = screen.getByText("Add Hog");

    fireEvent.change(nameInput, { target: { value: "New Hog" } });
    fireEvent.change(weightInput, { target: { value: 100 } });
    fireEvent.change(specialtyInput, { target: { value: "Dancing" } });
    fireEvent.click(greasedCheckbox);
    fireEvent.click(addButton);

    expect(screen.getByText("New Hog")).toBeInTheDocument();
  });

  it("renders hog tiles using Semantic Cards", () => {
    render(<App />);
    const cards = screen.getAllByLabelText(/hog card/i)
    
    cards.forEach((card) => {
        expect(card).toHaveClass("ui");
        expect(card).toHaveClass("card");
    });

    expect(cards.length).toBe(hogs.length);
  });
});