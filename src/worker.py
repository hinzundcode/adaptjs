import json
import sys

# If there's a second argument given, use that to insert an import path
# This enables users to use their own Adapt installation directories.
if len(sys.argv) > 2:
    sys.path.insert(0, sys.argv[2])

from adapt.intent import IntentBuilder
from adapt.engine import IntentDeterminationEngine

engine = IntentDeterminationEngine()

schema = json.loads(sys.argv[1])

for entity in schema["entities"]:
	if entity["type"] == "string":
		for value in entity["values"]:
			engine.register_entity(value, entity["name"])
	elif entity["type"] == "regex":
		engine.register_regex_entity(entity["pattern"])

for intent in schema["intents"]:
	ib = IntentBuilder(intent["name"].encode("utf-8"))
	for requirement in intent["requirements"]:
		ib.require(requirement["entity"], requirement["attribute"])
	for optional in intent["optionals"]:
		ib.optionally(optional["entity"], optional["attribute"])
	engine.register_intent_parser(ib.build())

if __name__ == "__main__":
	while True:
		line = sys.stdin.readline()
		query = json.loads(line)
		intents = list(engine.determine_intent(query["input"]))
		response = {"intents": intents}
		print(json.dumps(response))
		sys.stdout.flush()
