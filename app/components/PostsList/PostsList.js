import styles from './styles.styl';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';

//截取字符串，多余的部分用...代替
function setString(str, len) {
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            strlen += 2;
        } else {
            strlen++;
        }
        s += str.charAt(i);
        if (strlen >= len) {
            return s+"...";
        }
    }
    return s;
}

@CSSModules(styles)
export default class PostsList extends React.Component {
  static propTypes = {
    posts: PropTypes.array
  };

  render() {
    return (
      <div styleName="wrapper">
        {this.props.posts
          .filter(item => item.published)
          .map(post => {
            return (
              <div key={post.id}>
                <Link to={`/posts/${post.id}`}>
                  <h2 className="post-header-link">{post.title}</h2>
                    <div>{setString(post.content,200)}</div>
                </Link>
              </div>
            );
          })}
      </div>
    );
  }
}
