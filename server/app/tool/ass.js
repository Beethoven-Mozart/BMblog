import crypto from 'crypto';

var md5 = function (str, type) {
    return crypto.createHash('md5').update(str, 'binary').digest(type || 'binary');
};

var randomString = function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

var ord = (v) => {
    return v.charCodeAt(0);
};

var encode64 = ($input, $count) => {
    var $itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var $i, $output, $value;
    $output = '';
    $i = 0;
    while ($i < $count) {
        $value = ord($input[$i++]);
        $output += $itoa64[$value & 0x3f];
        if ($i < $count) {
            $value |= ord($input[$i]) << 8;
        }
        $output += $itoa64[($value >> 6) & 0x3f];
        if ($i++ >= $count) {
            break;
        }
        if ($i < $count) {
            $value |= ord($input[$i]) << 16;
        }
        $output += $itoa64[($value >> 12) & 0x3f];
        if ($i++ >= $count) {
            break;
        }
        $output += $itoa64[($value >> 18) & 0x3f];
    }
    return $output;
};

/**
 * @return {boolean}
 */
export var CheckPassword = (pass, old_pass) => {
    var salt = "";
    if (old_pass == null) {
        salt = randomString(8);
    } else {
        salt = old_pass.substring(4, 12);
    }

    console.log(salt);

    var hash = md5(salt + pass);
    var count = 1 << 13;
    while (count--) {
        hash = md5(hash + pass);
    }

    if (old_pass == null) {
        return '$P$B' + salt + encode64(hash, 16);
    } else {
        return ('$P$B' + salt + encode64(hash, 16)) === old_pass;
    }
};