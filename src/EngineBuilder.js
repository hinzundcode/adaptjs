"use strict";
const Entity = require("./Entity");
const RegexEntity = require("./RegexEntity");
const Intent = require("./Intent");
const Engine = require("./Engine");

class EngineBuilder {
	constructor() {
		this.entities = [];
		this.intents = [];
	}
	
	entity(name, values) {
		let entity = new Entity(name, values);
		this.entities.push(entity);
		return entity;
	}
	
	regexEntity(pattern) {
		let entity = new RegexEntity(pattern);
		this.entities.push(entity);
		return entity;
	}
	
	intent(name) {
		let intent = new Intent(name);
		this.intents.push(intent);
		return intent;
	}
	
	build() {
		return new Engine({
			entities: this.entities.map(entity => entity.encode()),
			intents: this.intents.map(intent => intent.encode()),
		});
	}
}

module.exports = EngineBuilder;
