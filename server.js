const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "deportes.json");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const readData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
  } catch (error) {
    console.error("Error writing data:", error);
  }
};

app.get("/deportes", (req, res) => {
  try {
    const deportes = readData();
    res.json({ deportes });
  } catch (error) {
    console.error("Error in /deportes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/agregar", (req, res) => {
  try {
    const { nombre, precio } = req.body;
    const deportes = readData();

    if (!nombre || !precio) {
      return res.status(400).json({ error: "Nombre y precio son requeridos" });
    }

    for (const deporte of deportes) {
      if (deporte.nombre === nombre) {
        return res.status(400).json({ error: "El deporte ya existe" });
      }
    }

    deportes.push({ nombre, precio });
    writeData(deportes);
    res.json({ message: "Deporte agregado con éxito" });
  } catch (error) {
    console.error("Error in /agregar:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/editar", (req, res) => {
  try {
    const { nombre, precio } = req.body;
    const deportes = readData();

    const deporte = deportes.find((d) => d.nombre === nombre);
    if (!deporte) {
      return res.status(404).json({ error: "Deporte no encontrado" });
    }

    deporte.precio = precio;
    writeData(deportes);
    res.json({ message: "Deporte editado con éxito" });
  } catch (error) {
    console.error("Error in /editar:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/eliminar", (req, res) => {
  try {
    const { nombre } = req.body;
    let deportes = readData();

    deportes = deportes.filter((d) => d.nombre !== nombre);
    writeData(deportes);
    res.json({ message: "Deporte eliminado con éxito" });
  } catch (error) {
    console.error("Error in /eliminar:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
