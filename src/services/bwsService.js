import constants from "../util/constants.js";
import { runCommand } from "../util/cmdRunner.js";
import { cache, compress, decompress } from "../util/cache.js"

const getCachedEntityByIdentifier = (type, idValue, idType) => {
  console.log(`BWS API: Search cache for ${type} with ${idType} ${idValue}...`);

  if (!cache[type]) return null;
  const entities = decompress(cache[type]);
  const entity = entities.find(e => e[idType] === idValue) || null;

  if (!entity) {
    console.log(`BWS API: Entity ${type} with ${idType} ${idValue} not found in cache.`);
  }
  else {
    console.log(`BWS API: Entity ${type} with ${idType} ${idValue} found in cache. Entity ID: ${entity.id}`);
    return entity;
  }
};

const getCachedEntity = async (type, idValue, idType) => {
  console.log(`BWS API: Get the value of ${type} with ${idType} ${idValue}`);

  let entity = getCachedEntityByIdentifier(type, idValue, idType);
  if (!entity) {
    console.log(`BWS API: Cache miss, fetching all ${type}s...`);
    const resultJSON = await runCommand(
      `${constants.BWS_CLI_PATH} list ${type}s`
    );
    cache[type] = compress(resultJSON);
    entity = getCachedEntityByIdentifier(type, idValue, idType);
  }
  return entity;
};

export const getByIdOrName = async (req, res) => {
  const _type = req.params.type;
  const _id = req.query.id;
  const _name = req.query.name;

  if ((!_id && !_name) || (_id && _name)) {
    res.status(400).send({
      message: `BWS API: You must provide either id or name, but not both.`,
    });
    return;
  }

  const idValue = _id || _name;
  const idType = _id ? 'id' : (_type === 'secret' ? 'key' : 'name');

  try {
    const entity = await getCachedEntity(_type, idValue, idType);
    if (entity) {
      res.setHeader("Content-Type", "application/json");
      res.send(entity);
    } else {
      throw new Error(`BWS API: Entity ${_type} with ${idType} ${idValue} not found`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.setHeader("Content-Type", "application/json");
    res.status(404).send({
      message: `BWS API: Error: ${error.message}`,
    });
  }
};