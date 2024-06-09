import { exec } from "child_process";

/**
 * Run an arbitrary command line command and return the string output.
 * @param {string} command - The command to be executed.
 * @returns {Promise<string>} A Promise that resolves with the command output.
 */
export function runCommand(command) {
  console.log(`BWS API: Run CLI: ${command}`);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(new Error(stderr));
        return;
      }

      resolve(JSON.parse(stdout.trim()));
    });
  });
}
