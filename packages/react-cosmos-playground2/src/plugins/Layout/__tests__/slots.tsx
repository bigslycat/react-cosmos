import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { Slot, loadPlugins, resetPlugins } from 'react-plugin';
import { mockPlug } from '../../../testHelpers/plugin';
import {
  mockStorage,
  mockRouter,
  mockCore,
  mockRendererCore
} from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(resetPlugins);

function registerTestPlugins() {
  mockStorage({
    loadCache: () => Promise.resolve(null)
  });
  mockRouter({
    isFullScreen: () => false
  });
  mockCore();
  mockRendererCore({
    isValidFixtureSelected: () => true
  });
  register();
}

async function loadTestPlugins() {
  loadPlugins();
  const utils = render(<Slot name="root" />);
  await waitForElement(() => utils.getByTestId('layout'));
  return utils;
}

it('renders "nav" slot', async () => {
  registerTestPlugins();
  mockPlug('nav', () => <>we are the robots</>);

  const { getByText } = await loadTestPlugins();
  getByText(/we are the robots/i);
});

it('renders "rendererHeader" slot', async () => {
  registerTestPlugins();
  mockPlug('rendererHeader', () => <>we are the robots</>);

  const { getByText } = await loadTestPlugins();
  getByText(/we are the robots/i);
});

it('renders "rendererPreview" slot', async () => {
  registerTestPlugins();
  mockPlug('rendererPreview', () => <>we are the robots</>);

  const { getByText } = await loadTestPlugins();
  getByText(/we are the robots/i);
});

it('renders "contentOverlay" slot', async () => {
  registerTestPlugins();
  mockPlug('contentOverlay', () => <>we are the robots</>);

  const { getByText } = await loadTestPlugins();
  getByText(/we are the robots/i);
});

it('renders "panel" slot', async () => {
  registerTestPlugins();
  mockPlug('panel', () => <>we are the robots</>);

  const { getByText } = await loadTestPlugins();
  getByText(/we are the robots/i);
});

it('renders "global" plugs', async () => {
  mockPlug('global', () => <>first</>);
  mockPlug('global', () => <>second</>);
  mockPlug('global', () => <>third</>);
  registerTestPlugins();

  const { getByText } = await loadTestPlugins();
  getByText(/first/i);
  getByText(/second/i);
  getByText(/third/i);
});
