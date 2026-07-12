import fs from "fs";
import readline from "readline";

async function search() {
  const fileStream = fs.createReadStream("C:\\Users\\spsch\\.gemini\\antigravity\\brain\\9d4ec8d8-c224-4140-953e-fd9650ffe204\\.system_generated\\logs\\transcript.jsonl");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === "run_command" && tc.args && tc.args.CommandLine) {
            const cmd = tc.args.CommandLine;
            console.log(`Step ${obj.step_index} (${obj.created_at}): ${cmd}`);
          }
        }
      }
    } catch (err) {
      // Not JSON
    }
  }
}

search();
