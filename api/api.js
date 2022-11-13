/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
const Api = {
    account: require('./detail/account'),
    content: require('./detail/content'),
    editor: require('./detail/editor'),
    info: require('./detail/info'),
    message: require('./detail/message'),
    user: require('./detail/user'),
};

module.exports = Api;
