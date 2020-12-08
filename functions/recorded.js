const assets = Runtime.getAssets();
const { updateExplorationFromCallback } = require(assets["/exploration.js"].path);

exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();
  // Update the Sync record for the call
  await updateExplorationFromCallback(
    client,
    context,
    event
  );
  callback(null, event.ExplorationId);
};
