var shoppingCart = {

    _key: "SHOPPINGCART",

    _getDataFromStorage() {
        return wx.getStorageSync(this._key);
    },

    _setDataToStorage(value) {
        wx.setStorageSync(this._key, value);
    },

    //增加物品
    add(opt) {
        if (!opt.images || !opt.name || !opt.price || !opt.num || !opt.id) return false;
        var lastData = this._getDataFromStorage();
        if (!lastData) lastData = {};
        lastData[opt.id] = {
            images: opt.images, //商品图片
            name: opt.name, //商品名称
            price: opt.price, //商品价格
            num: opt.num, //商品数量
            id: opt.id, //商品id
            uid: opt.uid //用户id
        };
        this._setDataToStorage(lastData);
        return true;
    },

    //移除物品
    remove(id) {
        var lastData = this._getDataFromStorage();
        if (!lastData) return false;
        delete lastData[id];
        this._setDataToStorage(lastData);
        return true;
    },

    //清空购物车
    clear() {
        this._setDataToStorage("");
        return true;
    },

    //修改信息
    alter(id, num) {
        var lastData = this._getDataFromStorage();
        if (lastData[id]) {
            lastData[id]["num"] = num;
            this._setDataToStorage(lastData);
            return true;
        }
    },

    //获取数据
    getData() {
        var lastData = this._getDataFromStorage();
        if (!lastData) lastData = {};
        var newArr = [];
        for (var key in lastData) {
            newArr.push(lastData[key])
        }
        return newArr;
    }

}

module.exports = shoppingCart;