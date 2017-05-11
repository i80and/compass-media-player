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

    this.state = {videoURLs: [], error: null};
  }

  componentDidMount() {
    this.unsubscribeStore = MediaPlayerStore.listen(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }

  handleStoreChange(storeState) {
    console.log('Store change')

    for (const url of this.state.videoURLs) {
      URL.revokeObjectURL(url);
    }

    this.setState({
      videoURLs: storeState.videoBlobs.map((blob) => (blob === null) ? null : URL.createObjectURL(blob)),
      error: null
    });

    console.log(this.state.videoURLs)
  }

  renderContent() {
    if (this.state.error) {
      return (
        <StatusRow style="error">
          {this.state.error.message}
        </StatusRow>
      );
    }

    if (this.state.videoURLs.length === 0) {
      return null;
    }

    return (
      <div className="column-container">
        <div className="column main">
          {this.state.videoURLs.map((url) => {
            if (url === null) {
              return <div>Does not contain a playable video</div>
            } else {
              return <video controls src={url}>No video support</video>
            }
          })}
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
