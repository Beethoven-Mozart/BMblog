import sequelize from '../lib/sequelize'
import Sequelize from 'sequelize'
import { DB as DBConfig } from '../config'

export let Posts = sequelize.define('posts', {
  ID: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  post_author: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  post_date: {
    type: Sequelize.DATE,
    defaultValue: null
  },
  post_date_gmt: {
    type: Sequelize.DATE,
    defaultValue: null
  },
  post_content: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  post_title: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  post_excerpt: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  post_status: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'publish'
  },
  comment_status: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'open'
  },
  ping_status: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'open'
  },
  post_password: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  post_name: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  to_ping: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  pinged: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  post_modified: {
    type: Sequelize.DATE,
    defaultValue: null
  },
  post_modified_gmt: {
    type: Sequelize.DATE,
    defaultValue: null
  },
  post_content_filtered: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  post_parent: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  guid: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  menu_order: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    defaultValue: 0
  },
  post_type: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'post'
  },
  post_mime_type: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  comment_count: {
    type: Sequelize.BIGINT(20),
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: DBConfig.prefix + 'posts',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  // initialAutoIncrement: 5,
  indexes: [
    {
      name: 'post_name',
      fields: [{attribute: 'post_name', length: 191}]
    },
    {
      name: 'type_status_date',
      fields: ['post_type', 'post_status', 'post_date', 'ID']
    },
    {
      name: 'post_parent',
      fields: ['post_parent']
    },
    {
      name: 'post_author',
      fields: ['post_author']
    }
  ]
})

export let PostMeta = sequelize.define('postmeta', {
  meta_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  post_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  meta_key: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  meta_value: {
    type: Sequelize.TEXT('long'),
    allowNull: true
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: DBConfig.prefix + 'postmeta',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'post_id',
      fields: ['post_id']
    },
    {
      name: 'meta_key',
      fields: [{attribute: 'meta_key', length: 191}]
    }
  ]
})
