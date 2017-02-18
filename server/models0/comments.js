import sequelize from '../lib/sequelize'
import Sequelize from 'sequelize'
import { DB as DBConfig } from '../config'

export let Comments = sequelize.define('comments', {
  comment_ID: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  comment_post_ID: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  comment_author: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false
  },
  comment_author_email: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  comment_author_url: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  comment_author_IP: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  comment_date: {
    type: Sequelize.DATE,
    defaultValue: null
  },
  comment_date_gmt: {
    type: Sequelize.DATE,
    defaultValue: null
  },
  comment_content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  comment_karma: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    defaultValue: 0
  },
  comment_approved: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 1
  },
  comment_agent: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  comment_type: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  comment_parent: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  user_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: DBConfig.prefix + 'comments',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'comment_post_ID',
      fields: ['comment_post_ID']
    },
    {
      name: 'comment_approved_date_gmt',
      fields: ['comment_approved', 'comment_date_gmt']
    },
    {
      name: 'comment_date_gmt',
      fields: ['comment_date_gmt']
    },
    {
      name: 'comment_parent',
      fields: ['comment_parent']
    },
    {
      name: 'comment_author_email',
      fields: [{attribute: 'comment_author_email', length: 10}]
    }
  ]
})

export let CommentMeta = sequelize.define('commentmeta', {
  meta_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  comment_id: {
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
  tableName: DBConfig.prefix + 'commentmeta',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'comment_id',
      fields: ['comment_id']
    },
    {
      name: 'meta_key',
      fields: [{attribute: 'meta_key', length: 191}]
    }
  ]
})
