const React = require('react');
const { StoreConnector } = require('hadron-react-components');
const MediaPlayerComponent = require('./media-player');
const Store = require('../stores');
const Actions = require('../actions');

// const debug = require('debug')('mongodb-compass:media-player:index');

class ConnectedMediaPlayerComponent extends React.Component {
  /**
   * Connect MediaPlayerComponent to store and render.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <StoreConnector store={Store}>
        <MediaPlayerComponent actions={Actions} {...this.props} />
      </StoreConnector>
    );
  }
}

ConnectedMediaPlayerComponent.displayName = 'ConnectedMediaPlayerComponent';

module.exports = ConnectedMediaPlayerComponent;
