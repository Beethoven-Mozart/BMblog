import sequelize from '../lib/sequelize'
import Sequelize from 'sequelize'
import { DB as DBConfig } from '../config'

export let Terms = sequelize.define('terms', {
  term_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  term_group: {
    type: Sequelize.BIGINT(10),
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: DBConfig.prefix + 'terms',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'slug',
      fields: [{attribute: 'slug', length: 191}]
    },
    {
      name: 'name',
      fields: [{attribute: 'name', length: 191}]
    }
  ]
})

export let TermMeta = sequelize.define('termmeta', {
  meta_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  term_id: {
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
  tableName: DBConfig.prefix + 'termmeta',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'term_id',
      fields: ['term_id']
    },
    {
      name: 'meta_key',
      fields: [{attribute: 'meta_key', length: 191}]
    }
  ]
})

export let TermTaxonomy = sequelize.define('term_taxonomy', {
  term_taxonomy_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  term_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  taxonomy: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  parent: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  count: {
    type: Sequelize.BIGINT(20),
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: DBConfig.prefix + 'term_taxonomy',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'term_id_taxonomy',
      unique: true,
      fields: ['term_id', 'taxonomy']
    },
    {
      name: 'taxonomy',
      fields: ['taxonomy']
    }
  ]
})

export let TermRelationships = sequelize.define('term_relationships', {
  object_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    defaultValue: 0
  },
  term_taxonomy_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    defaultValue: 0
  },
  term_order: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: DBConfig.prefix + 'term_relationships',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'term_taxonomy_id',
      fields: ['term_taxonomy_id']
    }
  ]
})
