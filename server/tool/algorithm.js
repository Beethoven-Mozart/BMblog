/**
 * Created by wangyi on 2016/11/29.
 */
import crypto from 'crypto';

export let md5 = function (str, type) {
    return crypto.createHash('md5').update(str, 'binary').digest(type || 'binary');
};

export let randomString = function (len) {
    len = len || 32;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

export let encode64 = ($input, $count) => {
    let ord = (v) => {
        return v.charCodeAt(0);
    };
    let $itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let $i, $output, $value;
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