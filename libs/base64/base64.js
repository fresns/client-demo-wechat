/**
 * base64 编码
 * @param str
 * @return {string}
 */
function base64_encode(str) {
    let c1, c2, c3;
    const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let i = 0;
    const len = str.length;
    let strin = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i === len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
            strin += '==';
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i === len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
            strin += base64EncodeChars.charAt((c2 & 0xf) << 2);
            strin += '=';
            break;
        }
        c3 = str.charCodeAt(i++);
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
        strin += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
        strin += base64EncodeChars.charAt(c3 & 0x3f);
    }
    return strin;
}

/**
 * base64 解码
 * @param input
 * @return {string}
 */
function base64_decode(input) {
    // 解码，配合decodeURIComponent使用
    const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    while (i < input.length) {
        enc1 = base64EncodeChars.indexOf(input.charAt(i++));
        enc2 = base64EncodeChars.indexOf(input.charAt(i++));
        enc3 = base64EncodeChars.indexOf(input.charAt(i++));
        enc4 = base64EncodeChars.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    return utf8_decode(output);
}

/**
 * utf8 解码
 * @param utfText
 * @return {string}
 */
function utf8_decode(utfText) {
    let string = '';
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utfText.length) {
        c = utfText.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if (c > 191 && c < 224) {
            c1 = utfText.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        } else {
            c1 = utfText.charCodeAt(i + 1);
            c2 = utfText.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }
    return string;
}

module.exports = {
    base64_encode,
    base64_decode,
};
