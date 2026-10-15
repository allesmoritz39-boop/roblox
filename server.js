const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let nowList = [];
let historyList = [];

app.post("/join", (req, res) => {
	const data = req.body;
	if (!data || !data.placeId) {
		console.log("[FEHLER] Ungültige Daten empfangen");
		return res.sendStatus(400);
	}

	const entry = {
		placeId: data.placeId,
		placeName: data.placeName || "Unknown",
		playerName: data.playerName || "Unknown",
		playerId: data.playerId || 0,
		time: data.time || Date.now() / 1000,
		receivedAt: Date.now()
	};

	nowList.unshift(entry);
	historyList.unshift(entry);

	if (nowList.length > 30) nowList.pop();
	if (historyList.length > 500) historyList.pop();

	// Log zum Testen
	console.log("=================================");
	console.log("[JOIN EMPFANGEN]");
	console.log("Place ID   :", entry.placeId);
	console.log("Place Name :", entry.placeName);
	console.log("Spieler    :", entry.playerName, `(${entry.playerId})`);
	console.log("Zeit       :", new Date().toLocaleString());
	console.log("=================================");

	res.sendStatus(200);
});

app.get("/now", (req, res) => {
	res.json(nowList);
});

app.get("/history", (req, res) => {
	res.json(historyList);
});

app.get("/", (req, res) => {
	res.send("Silent Join Server is running");
});

app.listen(PORT, () => {
	console.log(`Server läuft auf Port ${PORT}`);
});
