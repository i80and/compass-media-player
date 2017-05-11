import React from 'react';
import { storiesOf } from '@kadira/storybook';
import MediaPlayerComponent from '../src/components/media-player';
import ConnectedMediaPlayerComponent from '../src/components/';

storiesOf('MediaPlayerComponent', module)
  .add('connected to store', () => <ConnectedMediaPlayerComponent />)
  .add('enabled', () => <MediaPlayerComponent status="enabled" />)
  .add('disabled', () => <MediaPlayerComponent status="disabled" />);
