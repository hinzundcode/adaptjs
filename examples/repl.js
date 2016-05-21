"use strict";
const EngineBuilder = require("..").EngineBuilder;
const readline = require("readline");

let builder = new EngineBuilder();

builder.entity("WeatherKeyword", ["weather"]);
builder.entity("WeatherType", ["snow", "rain", "wind", "sleet", "sun"]);
builder.entity("Location", ["Seattle", "San Francisco", "Tokyo"]);
//builder.regexEntity("in (?P<Location>.*)");

builder.intent("WeatherIntent")
	.require("WeatherKeyword", "weatherkey")
	.optionally("WeatherType")
	.require("Location");

builder.entity("Artist", ["third eye blind", "the who", "the clash", "john mayer", "kings of leon", "adelle"]);
builder.entity("MusicVerb", ["listen", "hear", "play"]);
builder.entity("MusicKeyword", ["songs", "music"]);

builder.intent("MusicIntent")
	.require("MusicVerb")
	.optionally("MusicKeyword")
	.optionally("Artist");

let engine = builder.build();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
rl.setPrompt("> ");
rl.prompt();

rl.on("line", line => {
	engine.query(line).then(intents => {
		console.log(intents);
		rl.prompt();
	}).catch(error => {
		console.log(error);
		console.log(error.stack);
		rl.prompt();
	});
});

rl.on("close", () => {
	engine.stop();
});
