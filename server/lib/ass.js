import {md5, randomString, encode64} from '../tool/algorithm';

/**
 * 检查密码是否匹配
 * @return {boolean}
 */
export let CheckPassword = (pass, old_pass) => {
    let salt = "";
    if (old_pass == null) {
        salt = randomString(8);
    } else {
        salt = old_pass.substring(4, 12);
    }
    let hash = md5(salt + pass);
    let count = 1 << 13;
    while (count--) {
        hash = md5(hash + pass);
    }

    if (old_pass == null) {
        return '$P$B' + salt + encode64(hash, 16);
    } else {
        return ('$P$B' + salt + encode64(hash, 16)) === old_pass;
    }
};