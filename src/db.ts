import { Model, Sequelize, DataTypes } from 'sequelize';
import { createWriteStream } from 'fs';

const dataFolder = (strs: TemplateStringsArray) => './data' + strs[0];

const logStream = createWriteStream(dataFolder`/sql.log`, { flags: 'a' });

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dataFolder`/data.sqlite`,
  logging: (msg) => logStream.write(msg + '\n'),
});

export class TranslationInfo extends Model {}
export const LOCALES = ['zh', 'en'] as const;

TranslationInfo.init(
  {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    locale: {
      type: DataTypes.ENUM,
      values: LOCALES,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

export class ScopeInfo extends Model {}
export const SCOPES = ['global', 'page', 'component'] as const;

ScopeInfo.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: SCOPES,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

export class LabelInfo extends Model {}

LabelInfo.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // can be global or page
    page_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ScopeInfo,
        key: 'id',
      },
      allowNull: false,
    },
    component_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ScopeInfo,
        key: 'id',
      },
      allowNull: true,
    },
    translation_id: {
      type: DataTypes.INTEGER,
      references: {
        model: TranslationInfo,
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);
