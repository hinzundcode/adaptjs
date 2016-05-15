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

engine.query("weather in seattle").then(intents => {
	console.log("seattle", intents);
}).catch(error => {
	console.log(error.stack);
});

engine.query("play the who").then(intents => {
	console.log("who", intents);
}).catch(error => {
	console.log(error.stack);
});

engine.query("weather in san francisco").then(intents => {
	console.log("san francisco", intents);
}).catch(error => {
	console.log(error.stack);
});
