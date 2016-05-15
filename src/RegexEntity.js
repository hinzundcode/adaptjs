"use strict";

class RegexEntity {
	constructor(pattern) {
		this.pattern = pattern;
	}
	
	encode() {
		return {
			type: "regex",
			pattern: this.pattern,
		};
	}
}

module.exports = RegexEntity;
