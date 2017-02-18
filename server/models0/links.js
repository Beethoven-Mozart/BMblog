import sequelize from '../lib/sequelize'
import Sequelize from 'sequelize'
import { DB as DBConfig } from '../config'

export let Links = sequelize.define('links', {
  link_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  link_url: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  link_name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  link_image: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  link_target: {
    type: Sequelize.STRING(25),
    allowNull: false
  },
  link_description: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  link_visible: {
    type: Sequelize.STRING(255),
    allowNull: false,
    defaultValue: 'Y'
  },
  link_owner: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    defaultValue: 1
  },
  link_rating: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    defaultValue: 0
  },
  link_updated: {
    type: Sequelize.DATE,
    defaultValue: null
  },
  link_rel: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  link_notes: {
    type: Sequelize.TEXT('medium'),
    allowNull: false
  },
  link_rss: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: DBConfig.prefix + 'links',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'link_visible',
      fields: ['link_visible']
    }
  ]
})
