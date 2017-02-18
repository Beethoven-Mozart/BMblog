import sequelize from '../lib/sequelize'
import Sequelize from 'sequelize'
import { DB as DBConfig } from '../config'

export let Options = sequelize.define('options', {
  option_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  option_name: {
    type: Sequelize.STRING(191),
    allowNull: false
  },
  option_value: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  autoload: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'yes'
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: DBConfig.prefix + 'options',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'option_name',
      unique: true,
      fields: ['option_name']
    }
  ]
})
