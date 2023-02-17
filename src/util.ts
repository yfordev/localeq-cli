import prompts from 'prompts';
import * as R from 'rambda';
import k from 'kleur';

export const printInfo = (str: string) => {
  console.log(k.bold().bgGreen('|❯❯ ' + str + ' '));
};

export const printError = (str: string) => {
  console.log(k.bold().bgRed(str));
};

export const point = (nxt: string) => `"${k.bold(nxt)}"`;

export const underScore = (str: string) => str.replace(/[\s-.\/]/g, '_');

export const kvChoices = R.map<string, prompts.Choice>((v) => ({
  title: v,
  value: underScore(v),
}));
