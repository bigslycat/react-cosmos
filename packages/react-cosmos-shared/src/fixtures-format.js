// @flow

import { importModule } from './import-module';

import type { Modules, FixtureFile, Component } from 'react-cosmos-flow/module';

// Old fixtures don't have a `component` property. To support both old & new
// fixtures simultaneously, old style fixtures are altered on the fly by
// adding each fixture's corresponding component in the fixture body.
// FYI: deprecatedComponentModules is empty when using new style fixtures
// exclusively.
export function getNormalizedFixtureModules(
  fixtureModules: Modules,
  fixtureFiles: Array<FixtureFile>,
  deprecatedComponentModules: Modules = {}
) {
  const alteredFixtures: Set<string> = new Set();
  const invalidFixtures: Set<string> = new Set();

  const modules = Object.keys(fixtureModules).reduce((acc, next) => {
    const fixtureModule = importModule(fixtureModules[next]);

    // Component seems to be up to date, no alteration needed
    // Warn: Since multi fixtures weren't supported before v3, we assume multi
    // fixtures (Array default export) to be legit new style fixtures
    if (Array.isArray(fixtureModule) || fixtureModule.component) {
      return {
        ...acc,
        [next]: fixtureModule
      };
    }

    try {
      const fixtureFile = fixtureFiles.find(f => f.filePath === next);
      if (!fixtureFile) {
        throw new Error(`Missing fixture file for path: ${next}`);
      }

      const { components } = fixtureFile;
      const [component1] = components;
      if (!component1 || !component1.filePath) {
        throw new Error(`Missing component data for fixture path: ${next}`);
      }

      const componentModule = deprecatedComponentModules[component1.filePath];
      const component = importModule(componentModule);

      alteredFixtures.add(next);

      return {
        ...acc,
        [next]: {
          ...fixtureModule,
          component
        }
      };
    } catch (err) {
      invalidFixtures.add(next);

      return acc;
    }
  }, {});

  if (alteredFixtures.size > 0) {
    console.log(
      `[Cosmos] Successfully read ${alteredFixtures.size} old school fixtures:`
    );
    console.log(getPrintableListFromPaths(alteredFixtures));
  }

  if (invalidFixtures.size > 0) {
    console.warn(`[Cosmos] Failed to read ${invalidFixtures.size} fixtures:`);
    console.warn(getPrintableListFromPaths(invalidFixtures));
  }

  if (alteredFixtures.size > 0 || invalidFixtures.size > 0) {
    console.log(
      '[Cosmos] Upgrade these fixtures by adding the `component` property.'
    );
    console.log(
      '[Cosmos] More details at https://github.com/react-cosmos/react-cosmos/issues/440'
    );
  }

  return modules;
}

// TEMP: The new data structures are ready on the server, but are not
// yet adopted on the client. This conversion will be removed when the Loader
// and CP start working with the types from react-cosmos-voyager2
export function getOldSchoolFixturesFromNewStyleComponents(
  newStyleComponents: Array<Component>
) {
  const fixtures = {};

  newStyleComponents.forEach(c => {
    const componentName = getObjectPath(c);
    fixtures[componentName] = {};

    c.fixtures.forEach(f => {
      const fixtureName = getObjectPath(f);
      fixtures[componentName][fixtureName] = f.source;
    });
  });

  return fixtures;
}

function getPrintableListFromPaths(set: Set<string>): string {
  return [...set.values()].map(f => `- ${f}`).join('\n');
}

function getObjectPath(obj) {
  return obj.namespace ? `${obj.namespace}/${obj.name}` : obj.name;
}
