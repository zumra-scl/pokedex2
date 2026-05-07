import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/sukupolvi/:numero", async (req, res) => {
  try {
    const numero = req.params.numero;

    const response = await fetch(
      `https://pokeapi.co/api/v2/generation/${numero}/`,
    );

    const data = await response.json();

    const pokemonList = data.pokemon_species;

    res.render("generation", { pokemonList, numero });
  } catch (err) {
    res.render("error", { message: "Generation error" });
  }
});

app.get("/pokemon/:nimi", async (req, res) => {
  try {
    const nimi = req.params.nimi;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nimi}`);

    if (!response.ok) {
      return res.status(404).render("error", {
        message: "Pokemon not found",
      });
    }

    const pokemon = await response.json();

    res.render("pokemon", { pokemon });
  } catch (err) {
    res.render("error", { message: "Pokemon error" });
  }
});

app.get("/pokemon-search", async (req, res) => {
  try {
    const name = (req.query.name || "").toLowerCase();

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    if (!response.ok) {
      return res.status(404).render("error", {
        message: "Pokemon not found!",
      });
    }

    const pokemon = await response.json();

    res.render("pokemon", { pokemon });
  } catch (err) {
    res.status(500).render("error", {
      message: "Server error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});
