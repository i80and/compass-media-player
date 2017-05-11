const expect = require('chai').expect;
const MediaPlayerStore = require('../../lib/stores');

describe('MediaPlayerStore', function() {
  beforeEach(function() {
    // reset the store to initial values
    MediaPlayerStore.setState(MediaPlayerStore.getInitialState());
  });

  it('should have an initial state of {status: \'enabled\'}', function() {
    expect(MediaPlayerStore.state.status).to.be.equal('enabled');
  });

  describe('toggleStatus()', function() {
    it('should switch the state to {status: \'disabled\'}', function() {
      MediaPlayerStore.toggleStatus();
      expect(MediaPlayerStore.state.status).to.be.equal('disabled');
    });

    it('should switch the state back to {status: \'enabled\'} when used a second time', function() {
      MediaPlayerStore.toggleStatus();
      MediaPlayerStore.toggleStatus();
      expect(MediaPlayerStore.state.status).to.be.equal('enabled');
    });
  });
});
