import { isEqual } from 'lodash';
import { PluginContext, createPlugin } from 'react-plugin';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { PlaygroundUrlParams } from 'react-cosmos-shared2/url';
import {
  getUrlParams,
  pushUrlParams,
  subscribeToLocationChanges
} from '../../shared/url';
import { RouterSpec } from './public';

type Context = PluginContext<RouterSpec>;

const { onLoad, register } = createPlugin<RouterSpec>({
  name: 'router',
  initialState: {
    urlParams: {}
  },
  methods: {
    getSelectedFixtureId,
    isFullScreen,
    selectFixture,
    unselectFixture
  }
});

onLoad(context => {
  const { setState } = context;
  setState({ urlParams: getUrlParams() });

  return subscribeToLocationChanges((urlParams: PlaygroundUrlParams) => {
    const { fixtureId } = context.getState().urlParams;
    const fixtureChanged = !isEqual(urlParams.fixtureId, fixtureId);

    setState({ urlParams }, () => {
      if (fixtureChanged) {
        emitFixtureChangeEvent(context);
      }
    });
  });
});

export { register };

function getSelectedFixtureId({ getState }: Context) {
  return getState().urlParams.fixtureId || null;
}

function isFullScreen({ getState }: Context) {
  return getState().urlParams.fullScreen || false;
}

function selectFixture(
  context: Context,
  fixtureId: FixtureId,
  fullScreen: boolean
) {
  setUrlParams(context, { fixtureId, fullScreen });
}

function unselectFixture(context: Context) {
  setUrlParams(context, {});
}

function setUrlParams(context: Context, nextUrlParams: PlaygroundUrlParams) {
  const { urlParams } = context.getState();
  const fixtureChanged = !isEqual(nextUrlParams.fixtureId, urlParams.fixtureId);
  const urlParamsEqual = isEqual(nextUrlParams, urlParams);

  context.setState({ urlParams: nextUrlParams }, () => {
    // Setting identical url params is considered a "reset" request
    if (fixtureChanged || urlParamsEqual) {
      emitFixtureChangeEvent(context);
    }

    if (!urlParamsEqual) {
      pushUrlParams(context.getState().urlParams);
    }
  });
}

function emitFixtureChangeEvent(context: Context) {
  context.emit('fixtureChange', getSelectedFixtureId(context));
}
