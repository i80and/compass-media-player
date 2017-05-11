const Reflux = require('reflux');
const MediaPlayerActions = require('../actions');
const StateMixin = require('reflux-state-mixin');
const toNS = require('mongodb-ns');

const debug = require('debug')('mongodb-compass:stores:media-player');

function isEBML(bin) {
  const view = new Uint8Array(bin);
  return view[0] === 0x1a &&
         view[1] === 0x45 &&
         view[2] === 0xdf &&
         view[3] === 0xa3;
}

/**
 * Media Player store.
 */
const MediaPlayerStore = Reflux.createStore({
  /**
   * adds a state to the store, similar to React.Component's state
   * @see https://github.com/yonatanmn/Super-Simple-Flux#reflux-state-mixin
   *
   * If you call `this.setState({...})` this will cause the store to trigger
   * and push down its state as props to connected components.
   */
  // mixins: [StateMixin.store],

  /**
   * listen to all actions defined in ../actions/index.jsx
   */
  // listenables: MediaPlayerActions,

  /**
   * Initialize everything that is not part of the store's state.
   */
  init() {
    this.state = {videoBlobs: []};
  },

  /**
   * This method is called when all plugins are activated. You can register
   * listeners to other plugins' stores here, e.g.
   *
   * appRegistry.getStore('OtherPlugin.Store').listen(this.otherStoreChanged.bind(this));
   *
   * If this plugin does not depend on other stores, you can delete the method.
   *
   * @param {Object} appRegistry   app registry containing all stores and components
   */
  onActivated(appRegistry) {
    appRegistry.getStore('Query.ChangedStore').listen(this.onQueryChanged.bind(this));
  },

  /**
   * This method is called when the data service is finished connecting. You
   * receive either an error or the connected data service object, and if the
   * connection was successful you can now make calls to the database, e.g.
   *
   * dataService.command('admin', {connectionStatus: 1}, this.handleStatus.bind(this));
   *
   * If this plugin does not need to talk to the database, you can delete this
   * method.
   *
   * @param {Object} error         the error object if connection was unsuccessful
   * @param {Object} dataService   the dataService object if connection was successful
   *
   */
  onConnected(error, dataService) {
  },

  /**
   * Initialize the Media Player store state. The returned object must
   * contain all keys that you might want to modify with this.setState().
   *
   * @return {Object} initial store state.
   */
  getInitialState() {
    return {
      videoBlobs: []
    };
  },

  onQueryChanged(state) {
    console.log('Query changed')
    const newQuery = _.pick(state,
      ['filter', 'sort', 'project', 'skip', 'limit', 'maxTimeMS', 'ns']);
    this._refreshDataCache(newQuery);
  },

  _refreshDataCache(query) {
    const ns = toNS(query.ns);
    if (!ns.collection) {
      return;
    }

    const findOptions = {
      sort: _.isEmpty(query.sort) ? null : _.pairs(query.sort),
      fields: query.project,
      skip: query.skip,
      limit: Math.min(5, (query.limit === undefined) ? 1 : query.limit),
      maxTimeMS: query.maxTimeMS,
    };

    global.hadronApp.dataService.find(ns.ns, query.filter, findOptions, (error, documents) => {
      if (error) {
        // @todo handle error better? what kind of errors can happen here?
        throw error;
      }

      if (documents.length === 0) {
        this.state = {videoBlobs: []};
        this.trigger(this.state);
        return;
      }

      const blobs = []
      for (const doc of documents) {
        if (isEBML(doc.data.buffer)) {
          blobs.push(new Blob([doc.data.buffer], {type: 'video/webm'}))
        } else {
          blobs.push(null)
        }
      }

      this.state = {videoBlobs: blobs};
      this.trigger(this.state);
    });
  },

  /**
   * log changes to the store as debug messages.
   * @param  {Object} prevState   previous state.
   */
  storeDidUpdate(prevState) {
    debug('MediaPlayer store changed from', prevState, 'to', this.state);
  }
});

module.exports = MediaPlayerStore;
