"use strict";
const spawn = require("child_process").spawn;
const JSONStream = require("json-stream");

class Engine {
	constructor(schema) {
		this.schema = schema;
		this.worker = null;
		this.stream = JSONStream();
		this.queue = [];
		this.currentJob = null;
		
		this.stream.on("data", (result) => {
			if (!this.currentJob) return;
			
			this.currentJob.resolve(result.intents);
			this.currentJob = null;
			this.process();
		});
	}
	
	start() {
		if (this.worker) return;
		this.worker = spawn("python", [__dirname+"/worker.py", JSON.stringify(this.schema)]);
		
		this.worker.on("error", err => {
			//console.log("worker error", err);
			this.stop(err);
		});
		this.worker.on("exit", (code, signal) => {
			//console.log("worker exited", code, signal);
			this.stop(new Error("worker exited"));
		});
		
		this.worker.stdout.pipe(this.stream);
		//this.worker.stdout.pipe(process.stdout);
		//this.worker.stderr.pipe(process.stderr);
	}
	
	stop(error) {
		if (!error)
			error = new Error("worker stop");
		
		if (this.worker)
			this.worker.kill();
		
		this.worker = null;
		
		if (this.currentJob)
			this.currentJob.reject(error);
		
		for (let job of this.queue)
			job.reject(error);
		
		this.currentJob = null;
		this.queue = [];
	}
	
	isRunning() {
		return this.worker != null;
	}
	
	process() {
		if (this.currentJob) return;
		
		let job = this.queue.shift();
		if (!job) return;
		this.currentJob = job;
		
		this.start();
		let request = { input: job.input };
		this.worker.stdin.write(JSON.stringify(request)+"\n");
	}
	
	query(input) {
		return new Promise((resolve, reject) => {
			this.queue.push({
				input: input,
				resolve: resolve,
				reject: reject,
			});
			this.process();
		});
	}
}

module.exports = Engine;
