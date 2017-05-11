const app = require('hadron-app');
const Reflux = require('reflux');
const React = require('react');
const PropTypes = require('prop-types');
// const MediaPlayerActions = require('../actions');
const MediaPlayerStore = require('../stores');

// const debug = require('debug')('mongodb-compass:media-player');

class MediaPlayerComponent extends React.Component {
  constructor(props) {
    super(props)
    this.queryBar = global.hadronApp.appRegistry.getComponent('Query.QueryBar');

    this.state = {videoURL: null, error: null};
  }

  componentDidMount() {
    this.unsubscribeStore = MediaPlayerStore.listen(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }

  handleStoreChange(storeState) {
    global.window.videoBlob = storeState.videoBlob;
    console.log('Store change')

    if (this.state.videoURL) {
      URL.revokeObjectURL(this.state.videoURL);
    }

    this.setState({
      videoURL: URL.createObjectURL(storeState.videoBlob),
      error: null
    });
  }

  renderContent() {
    if (this.state.error) {
      return (
        <StatusRow style="error">
          {this.state.error.message}
        </StatusRow>
      );
    }

    if (!this.state.videoURL) {
      return null;
    }

    console.log(this.state.videoURL)

    return (
      <div className="column-container">
        <div className="column main">
          <video controls src={this.state.videoURL}>No video support</video>
        </div>
      </div>
    );
  }

  /**
   * Render MediaPlayer component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <div className="media-player content-container content-container-documents compass-documents">
        <div className="controls-container">
          <this.queryBar />
        </div>

        {this.renderContent()}
      </div>
    );
  }
}

MediaPlayerComponent.propTypes = {};
MediaPlayerComponent.defaultProps = {};
MediaPlayerComponent.displayName = 'MediaPlayerComponent';

module.exports = MediaPlayerComponent;
