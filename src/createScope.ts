import prompts from 'prompts';
import { ScopeInfo } from './db';
import { kvChoices, underScore, point } from './util';
import k from 'kleur';
import ora from 'ora';
import * as R from 'rambda';

const createScope = async () => {
  const scope = await prompts([
    {
      type: 'select',
      name: 'type',
      message: `Select one of types`,
      choices: kvChoices(['page', 'component']),
    },
    {
      type: 'text',
      name: 'name',
      message: `Input the name`,
      format: underScore,
      validate: async (name) => {
        const v = await ScopeInfo.findOne({ where: { name }, attributes: ['name'] });
        if (v === null) return true;
        return `The same name ${point(name)} already exists`;
      },
    },
    {
      type: 'confirm',
      name: 'ok',
      message: (_, values) =>
        `Create ${point(k.cyan(values.name))} in scope ${point(k.blue(values.type))}?`,
    },
  ]);

  if (scope.ok) {
    const info = `${point(scope.type)}:${point(scope.name)}`;
    const spin = ora(`Creating ${info}`).start();
    await ScopeInfo.create(R.omit('ok', scope)).then((v) => {
      if (v instanceof ScopeInfo) {
        spin.succeed(`Created ${info}`);
      } else {
        spin.fail(`Failed, check log please`);
      }
    });
  }
};

export default createScope;
