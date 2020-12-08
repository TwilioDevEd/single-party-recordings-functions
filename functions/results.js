const assets = Runtime.getAssets();
const { render } = require(assets["/templating.js"].path);

const { createToken, getExplorationMap } = require(assets[
  "/exploration.js"
].path);


exports.handler = async (context, event, callback) => {
  try {
    const client = context.getTwilioClient();
    const explorationMap = await getExplorationMap(client, context, event.ExplorationId);
    const token = createToken(context, explorationMap);
    callback(
      null,
      render(context, {
        mapSid: explorationMap.sid,
        token,
      })
    );
  } catch(err) {
    callback(err);
  }
};