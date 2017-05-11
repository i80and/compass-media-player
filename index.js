const MediaPlayerComponent = require('./lib/components');
const MediaPlayerActions = require('./lib/actions');
const MediaPlayerStore = require('./lib/stores');

/**
 * A sample role for the component.
 */
const ROLE = {
  name: 'MediaPlayer',
  component: MediaPlayerComponent
};

/**
 * Activate all the components in the Media Player package.
 */
function activate() {
  // Register the MediaPlayerComponent as a role in Compass
  //
  // Available roles are:
  //   - Instance.Tab
  //   - Database.Tab
  //   - Collection.Tab
  //   - CollectionHUD.Item
  //   - Header.Item

  global.hadronApp.appRegistry.registerRole('Collection.Tab', ROLE);
  global.hadronApp.appRegistry.registerAction('MediaPlayer.Actions', MediaPlayerActions);
  global.hadronApp.appRegistry.registerStore('MediaPlayer.Store', MediaPlayerStore);
}

/**
 * Deactivate all the components in the Media Player package.
 */
function deactivate() {
  global.hadronApp.appRegistry.deregisterRole('Collection.Tab', ROLE);
  global.hadronApp.appRegistry.deregisterAction('MediaPlayer.Actions');
  global.hadronApp.appRegistry.deregisterStore('MediaPlayer.Store');
}

module.exports = MediaPlayerComponent;
module.exports.activate = activate;
module.exports.deactivate = deactivate;
