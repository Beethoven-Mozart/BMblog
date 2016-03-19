import styles from './styles.styl';

import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { language } from '../../i18n/select.js';

@CSSModules(styles)
export default class SinglePost extends React.Component {
  static propTypes = {
    post: PropTypes.object
  };

  render() {
    const { post } = this.props;

    if (!post) return null;

    const { title, content, userId } = post;

    return (
      <div styleName="wrapper">
        <div styleName="title">{title}</div>
        <p>{content}</p>
        <small>{language.written_by} {userId}</small>
      </div>
    );
  }
}
