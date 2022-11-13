/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
const Api = require('../api');

export const getConfigItemByItemKey = async (itemKey) => {
    const result = await Api.info.infoConfigs({
        itemKey: itemKey,
    });
    if (result.code === 0 && result.data.list.length > 0) {
        return result.data.list[0];
    } else {
        return null;
    }
};

export const getConfigItemValue = async (itemKey) => {
    const configItem = await getConfigItemByItemKey(itemKey);
    if (configItem !== null) {
        return configItem.itemValue;
    } else {
        return null;
    }
};

export const getConfigsByItemTag = async (itemTag) => {
    const result = await Api.info.infoConfigs({
        itemTag: itemTag,
    });

    if (result.code === 0) {
        return result.data.list;
    } else {
        return null;
    }
};
