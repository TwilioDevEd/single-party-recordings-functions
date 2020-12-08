const AccessToken = require("twilio/lib/jwt/AccessToken");

// A week
SYNC_MAP_TTL = 60 * 60 * 24 * 7;

function createToken(context, exploration) {
  const id = exploration.sid;
  console.log(`Generating token for ${id}`);
  const token = new AccessToken(
    context.ACCOUNT_SID,
    context.API_KEY,
    context.API_SECRET
  );
  const syncGrant = new AccessToken.SyncGrant({
    serviceSid: context.SYNC_SERVICE_ID,
  });
  token.addGrant(syncGrant);
  token.identity = id;
  return token.toJwt();
}

async function addParticipants(explorationMap, participants) {
  console.log(`Adding Participants to exploration map ${explorationMap.sid}`);
  const keyPromises = participants.map((participant) => {
    return explorationMap.syncMapItems().create({
      key: participant.callSid,
      data: {
        callSid: participant.callSid,
      },
    });
  });
  return Promise.all(keyPromises);
}

function getExplorationMap(client, context, explorationId) {
  return client.sync
    .services(context.SYNC_SERVICE_ID)
    .syncMaps(explorationId)
    .fetch();
}

function getExplorationMapItem(client, context, explorationId, key) {
  return client.sync
    .services(context.SYNC_SERVICE_ID)
    .syncMaps(explorationId)
    .syncMapItems(key)
    .fetch();
}

async function updateExplorationFromCallback(client, context, event) {
  const existingItem = await getExplorationMapItem(client, context, event.ExplorationId, event.CallSid);
  const data = existingItem.data;
  // Use the Function name to dynamically name results `/recorded` will become `data.recorded`
  data[context.PATH.replace("/", "")] = event;
  return existingItem.update({
    data
  });
}

async function createExplorationMap(client, context) {
  return await client.sync.services(context.SYNC_SERVICE_ID).syncMaps.create({
    ttl: SYNC_MAP_TTL,
  });
}

module.exports = {
  addParticipants,
  createExplorationMap,
  createToken,
  updateExplorationFromCallback,
  getExplorationMap
};
