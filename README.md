# adaptjs

A nodejs wrapper around the [Adapt Intent Parser from Mycroft](https://github.com/MycroftAI/adapt), which converts natural language into structured intents based on intent definitions.

## Installation

```
$ npm install --save adaptjs
```

Install [MycroftAI/adapt](https://github.com/MycroftAI/adapt) as described in their [README](https://github.com/MycroftAI/adapt).

## Example

```javascript
"use strict";
const EngineBuilder = require("adaptjs").EngineBuilder;

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
.catch(error => { console.log(error); engine.stop(); });

/* [ { intent_type: 'WeatherIntent',
    weatherkey: 'weather',
    Location: 'San Francisco',
    confidence: 0.4878048780487805,
    target: null } ] */
```

See [examples/](https://github.com/hinzundcode/adaptjs/tree/master/examples) for more examples of the API and [MycroftAI/adapt](https://github.com/MycroftAI/adapt) for more information about the Adapt Intent Parser itself.

## API

```
EngineBuilder.entity(name, arrayOfValues): Entity
EngineBuilder.regexEntity(pattern): RegexEntity
EngineBuilder.intent(name): Intent
EngineBuilder.build(): Engine

Intent.require(entity, [attributeName]): this
Intent.optionally(entity, [attributeName]): this

Engine.start()
Engine.stop()
Engine.isRunning(): bool
Engine.query(input): Promise
```

## How it works

The EngineBuilder on the JavaScript side creates a definition of all entities and intents and passes it to a python child process as JSON. The python child process keeps running in the background and receives new input over stdin. You have to stop the child process manually using `engine.stop()`.
