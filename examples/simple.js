"use strict";
const EngineBuilder = require("..").EngineBuilder;

let builder = new EngineBuilder();

builder.entity("WeatherKeyword", ["weather"]);
builder.entity("WeatherType", ["snow", "rain", "wind", "sleet", "sun"]);
builder.entity("Location", ["Seattle", "San Francisco", "Tokyo"]);

builder.intent("WeatherIntent")
	.require("WeatherKeyword", "weatherkey")
	.optionally("WeatherType")
	.require("Location");

let engine = builder.build();

engine.query("Whats the weather in San Francisco today?")
.then(intents => { console.log(intents); engine.stop(); })
.catch(error => { console.log(error); console.log(error.stack); engine.stop(); });

/*[ { intent_type: 'WeatherIntent',
    weatherkey: 'weather',
    Location: 'San Francisco',
    confidence: 0.4878048780487805,
    target: null } ]*/