import prompts from 'prompts';
import { ScopeInfo, sequelize } from './db';
import * as R from 'rambda';
import k from 'kleur';
import ora from 'ora';
import createScope from './createScope';
import { printInfo, printError, kvChoices } from './util';

(async () => {
  try {
    await sequelize.authenticate();
    printInfo('Connection has been established successfully');
  } catch (error) {
    printError('Unable to connect to the database:');
    console.error(error);
    process.exit(1);
  }

  // Danger: sync can be destructive operations
  printInfo('Start checking data base');
  await sequelize.sync({ alter: true });

  printInfo(`LOCALEQ started`);

  const createLabel = () =>
    prompts([
      {
        type: 'select',
        name: 'page_scope',
        message: `Select one of global or page scopes`,
        choices: kvChoices(['global', 'test1']), // global 和其它所有
      },
      {
        type: (prev) => (prev === 'global' ? null : 'select'),
        name: 'component_scope',
        message: `Select in or not in component?`,
        choices: kvChoices(['no compoent', 'comp1']),
      },
      {
        type: 'text',
        name: 'label',
        message: `Input the key label`,
      },
    ]);

  const menu = () =>
    prompts({
      type: 'select',
      name: 'select',
      message: `Do what?`,
      choices: kvChoices([/* 'search', 'createLabel',  */ 'createScope', /* 'output', */ 'quit']),
    });

  let running = true;
  while (running) {
    const { select } = await menu();

    await {
      search: () => {},
      createLabel,
      createScope,
      output: () => {},
      quit: () => {
        running = false;
        return Promise.resolve();
      },
    }[select]();

    console.log('\n');
  }
})();
