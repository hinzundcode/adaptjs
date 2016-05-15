"use strict";

class Intent {
	constructor(name) {
		this.name = name;
		this.requirements = [];
		this.optionals = [];
	}
	
	require(entity, attribute) {
		if (!attribute) attribute = entity;
		this.requirements.push({ entity: entity, attribute: attribute });
		return this;
	}
	
	optionally(entity, attribute) {
		if (!attribute) attribute = entity;
		this.optionals.push({ entity: entity, attribute: attribute });
		return this;
	}
	
	encode() {
		return {
			name: this.name,
			requirements: this.requirements,
			optionals: this.optionals,
		};
	}
}

module.exports = Intent;
