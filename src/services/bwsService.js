import { runCommand } from "../util/cmdRunner.js";
import constants from "../util/constants.js";

export function getById(req, res) {
  const _id = req.params.id;
  const _entity = "secret";

  console.log(`BWS: Get value of ${_entity} with ID ${_id}`);
  (async () => {
    try {
      const resultJSON = await runCommand(
        `${constants.BWS_CLI_PATH} ${_entity} get ${_id}`
      );
      res.setHeader("Content-Type", "application/json");
      res.send(resultJSON);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.setHeader("Content-Type", "application/json");
      res.send({
        message: `Error: ${error.message}`,
      });
    }
  })();
}
