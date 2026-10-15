// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let nowList = [];      // aktuelle Events
let historyList = [];  // alle jemals empfangenen

app.post("/join", (req, res) => {
	const data = req.body;
	if (!data || !data.placeId) return res.sendStatus(400);

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

	// Now-Liste kurz halten
	if (nowList.length > 30) nowList.pop();
	// History unbegrenzt (oder selbst begrenzen)
	if (historyList.length > 500) historyList.pop();

	res.sendStatus(200);
});

app.get("/now", (req, res) => {
	res.json(nowList);
});

app.get("/history", (req, res) => {
	res.json(historyList);
});

app.listen(PORT, () => {
	console.log(`Server läuft auf Port ${PORT}`);
});
