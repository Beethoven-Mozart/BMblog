// import sequelize from '../lib/sequelize'
import Sequelize from 'sequelize'
import models from './index'

export default async() => {
  console.log(Sequelize.NOW)
  await models.user.Users.sync()
  await models.user.UserMeta.sync()
  await models.terms.Terms.sync()
  await models.terms.TermMeta.sync()
  await models.terms.TermTaxonomy.sync()
  await models.terms.TermRelationships.sync()
  await models.posts.Posts.sync()
  await models.posts.PostMeta.sync()
  await models.options.Options.sync()
  await models.links.Links.sync()
  await models.comments.Comments.sync()
  await models.comments.CommentMeta.sync()
  // alter table TABLE_NAME convert to character set utf8mb4 collate utf8mb4_bin;
  return 'ok'
}
