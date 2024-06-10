import constants from "../util/constants.js";
import { runCommand } from "../util/cmdRunner.js";
import { cache, compress, decompress } from "../util/cache.js";

const groupSecretsByProject = async (secrets, fetchSecretsIfMissing = false) => {
  const projectSecrets = {};
  secrets.forEach(secret => {
    const projectId = secret.projectId;
    if (!projectSecrets[projectId]) {
      projectSecrets[projectId] = [];
    }
    projectSecrets[projectId].push(secret);
  });
  
  cache.projectSecrets = projectSecrets;

  if (fetchSecretsIfMissing) {
    const missingProjects = Object.keys(projectSecrets).filter(projectId => !cache.projectSecrets[projectId]);
    for (const projectId of missingProjects) {
      console.log(`BWS API: Project-specific secrets not found in cache, fetching all secrets...`);
      const allSecrets = await fetchAndCacheEntities('secret');
      console.log(`allSecrets in groupSecretsByProject: ${JSON.stringify(allSecrets)}`);
      await groupSecretsByProject(allSecrets);
    }
  }
};

const fetchAndCacheEntities = async (entityType) => {
  console.log(`Fetching all ${entityType}s...`);
  const resultJSON = await runCommand(`${constants.BWS_CLI_PATH} list ${entityType}s`);
  cache[entityType] = compress(resultJSON);
  return resultJSON;
};

const getCachedEntityByIdentifier = async (type, idValue, idType, projectId) => {
  console.log(`BWS API: Search cache for ${type} with ${idType} ${idValue}...`);
  if (!cache.project || !cache.secret) {
    console.log(`BWS API: No ${type}s fetched yet, fetching all ${type}s...`);
    await fetchAndCacheEntities(type);
  }
  let entity = null;

  if (type === 'secret') {
    if (projectId) {
      console.log(`BWS API: Checking if ${type}s are fetched...`);
      let projectSecrets = cache.projectSecrets;
      if (projectSecrets[projectId]) {
        console.log(`BWS API: Searching cache for secrets in project ${projectId}...`);
        const projectSecrets = cache.projectSecrets[projectId];
        entity = projectSecrets.find(e => e[idType] === idValue);
      } else {
        console.log(`BWS API: ${type}s with ${projectId} not found in cache.projectSecrets.`);
      }
    } else {
      console.log(`BWS API: Searching entire cache for ${type}s with ${idType} ${idValue}...`);
      const entities = decompress(cache[type]);
      entity = entities.find(e => e[idType] === idValue);
    }
  } else {
    console.log(`BWS API: Searching entire cache for ${type} with ${idType} ${idValue}...`);
    const entities = decompress(cache[type]);
    entity = entities.find(e => e[idType] === idValue);
  }

  if (!entity) {
    console.log(`BWS API: Entity ${type} with ${idType} ${idValue} not found in cache.`);
  } else {
    console.log(`BWS API: Entity ${type} with ${idType} ${idValue} found in cache. Entity ID: ${entity.id}`);
  }

  return entity;
};

const getCachedEntity = async (type, idValue, idType, projectId) => {
  console.log(`BWS API: Get the value of ${type} with ${idType} ${idValue}`);

  let entity = await getCachedEntityByIdentifier(type, idValue, idType, projectId);
  if (!entity) {
    console.log(`BWS API: Cache miss, fetching all ${type}s...`);
    const resultJSON = await runCommand(
      `${constants.BWS_CLI_PATH} list ${type}s`
    );
    cache[type] = compress(resultJSON);
    if (type === 'secret') {
      await groupSecretsByProject(resultJSON, true);
    }
    entity = await getCachedEntityByIdentifier(type, idValue, idType, projectId);
  }
  return entity;
};

export const getByIdOrName = async (req, res) => {
  const _type = req.params.type;
  const _id = req.query.id;
  const _name = req.query.name;
  const _projectId = req.query.projectId;

  if ((!_id && !_name) || (_id && _name)) {
    res.status(400).send({
      message: `BWS API: You must provide either id or name, but not both.`,
    });
    return;
  }

  const idValue = _id || _name;
  const idType = _id ? 'id' : (_type === 'secret' ? 'key' : 'name');

  try {
    const entity = await getCachedEntity(_type, idValue, idType, _projectId);
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
