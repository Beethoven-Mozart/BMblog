import { CheckPassword, GeneratePassword } from '../lib/ass'
import sequelize from '../lib/sequelize'
import Sequelize from 'sequelize'
import { DB as DBConfig } from '../config'

export let Users = sequelize.define('users', {
  ID: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_login: {
    type: Sequelize.STRING(60),
    allowNull: false
  },
  user_pass: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  user_nicename: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  user_phone: {
    type: Sequelize.STRING(15),
    allowNull: false
  },
  user_email: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  user_url: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  user_registered: {
    type: Sequelize.DATE,
    defaultValue: null
  },
  user_activation_key: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  user_status: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    defaultValue: 0
  },
  display_name: {
    type: Sequelize.STRING(250),
    allowNull: false
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: DBConfig.prefix + 'users',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'user_login_key',
      fields: ['user_login']
    },
    {
      name: 'user_nicename',
      fields: ['user_nicename']
    },
    {
      name: 'user_email',
      fields: ['user_email']
    }
  ]
})

export let UserMeta = sequelize.define('usermeta', {
  umeta_id: {
    type: Sequelize.BIGINT(20).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
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
  tableName: DBConfig.prefix + 'usermeta',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_520_ci',
  indexes: [
    {
      name: 'user_id',
      fields: ['user_id']
    },
    {
      name: 'meta_key',
      fields: [{attribute: 'meta_key', length: 191}]
    }
  ]
})

export let Model = async() => {
  await sequelize.sync()
}

let getUserInfo = async(username) => {
  const project = await Users.findOne({
    where: {
      $or: [
        {username: username},
        {phone: username},
        {email: username}
      ]
    }
  })
  return project.dataValues
}

/**
 * 检查授权是否合法
 * @param {[type]} username [description]
 * @param {[type]} password [description]
 */
export let CheckAuth = (username, password) => {
  return getUserInfo(username).then(userInfo => {
    if (userInfo.password !== '' && CheckPassword(password, userInfo.password)) {
      // Auth Success
      userInfo.password = null
      delete userInfo.password
      return {
        status: 0,
        result: userInfo
      }
    } else {
      return {
        status: 403,
        result: 'no_acc'
      }
    }
  })
}

export let CreateUser = (username, phone, email, password) => {
  return Users.create({
    username: username,
    phone: phone,
    email: email,
    password: GeneratePassword(password)
  })
}
