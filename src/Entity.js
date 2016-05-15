"use strict";

class Entity {
	constructor(name, values) {
		this.name = name;
		this.values = values;
	}
	
	encode() {
		return {
			type: "string",
			name: this.name,
			values: this.values,
		};
	}
}

module.exports = Entity;
