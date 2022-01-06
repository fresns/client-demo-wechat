Component({
    observers: {
        "value": function (value) {
            if (!value) {
                return
            }
            this._initDateTimePickerFn()
        }
    },
    /**
     * 组件相关配置项
     */
    options: {
        multipleSlots: true // 开启使用多个插槽
    },
    /**
     * 组件的属性列表
     */
    properties: {
        mode: String,
        value: String,
    },
    /**
     * 组件的初始数据
     */
    data: {
        rangeList: [],
        rangeValue: [],
        dateDetails: ['年', '月', '时', '分', '秒']
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 初始化时间选择器
         */
        _initDateTimePickerFn() {
            try {
                const { value, mode } = this.data
                if (mode != 'dateminute' && mode != 'datetime') {
                    throw new CommonException('请输入合法的时间选择器类型！', -1)
                }
                //====获取到当前时间===
                let showTimeValue = this._validateShowTime(value, mode)

                // ====获取年份====
                const currentYear = showTimeValue.substring(0, showTimeValue.indexOf('-'))
                const currentMouth = showTimeValue.split(" ")[0].split('-')[1]
                const yearList = this._gotDateTimeList({
                    _start: Number(currentYear) - 100,
                    _end: Number(currentYear) + 100, _type: 0
                })
                // ====获取月份===
                const monthList = this._gotDateTimeList({ _start: 1, _end: 12, _type: 1 })
                //====获取天数===
                const dayList = this._gotDayList(currentYear, currentMouth)
                // ====获取小时===
                const hourList = this._gotDateTimeList({ _start: 0, _end: 23, _type: 2 })
                // ====获取分钟===
                const munithList = this._gotDateTimeList({ _start: 0, _end: 59, _type: 3 })
                // ====获取秒===
                const secondList = this._gotDateTimeList({ _start: 0, _end: 59, _type: 4 })

                let rangeList = new Array()
                rangeList.push(yearList)
                rangeList.push(monthList)
                rangeList.push(dayList)
                rangeList.push(hourList)
                rangeList.push(munithList)
                mode === "datetime" && rangeList.push(secondList)

                this.setData({
                    rangeList
                }, () => {
                    this._echoDateTime(showTimeValue) // 初始化时间显示
                })
            } catch (err) {
                console.log(err)
            }
        },
        /**
         * 验证显示的时间是否合法
         * @param {Number} _value 要验证的时间
         * @param {Number} _mode  选择器类型
         */
        _validateShowTime(_value, _mode) {
            let currentTime = formatTime(new Date()).replace(/\//g, "-")
            let showTimeValue = _value.trim() || currentTime
            const secondReg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/
            const munithReg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/
            if (_mode === 'dateminute') { // yyyy-MM-dd HH:mm
                // 验证是否合法
                secondReg.test(showTimeValue) && (showTimeValue = showTimeValue.substring(0, showTimeValue.lastIndexOf(':')))
                munithReg.test(showTimeValue) || (showTimeValue = currentTime.substring(0, currentTime.lastIndexOf(':')))
            } else { // yyyy-MM-dd HH:mm:ss
                munithReg.test(showTimeValue) && (showTimeValue += ':00')
                secondReg.test(showTimeValue) || (showTimeValue = currentTime)
            }
            return showTimeValue
        },

        /**
         * 获取年份、月份、小时、分钟、秒
         * @param {Number} _start 开始值
         * @param {Number} _end   结束值
         * @param {Number} _type  类型
         */
        _gotDateTimeList({ _start, _end, _type }) {
            let resultDataList = new Array()
            for (let i = _start; i <= _end; i++) {
                resultDataList.push(this._addZore(i) + this.data.dateDetails[_type])
            }
            return resultDataList
        },
        /**
         * 获取天数
         * @param {Number} _year  年份
         * @param {Number} _mouth  月份
         */
        _gotDayList(_year, _mouth) {
            let now = new Date(_year, _mouth, 0)
            const dayLength = now.getDate()
            let dayList = new Array()
            for (let i = 1; i <= dayLength; i++) {
                dayList.push(this._addZore(i) + '日')
            }
            return dayList
        },
        /**
         * 补零
         * @param {Number} _num  数值
         */
        _addZore(_num) {
            return _num < 10 ? '0' + _num : _num.toString()
        },
        /**
         * 回显时间
         * @param {Number} _showTimeValue  初始化时要显示的时间
         */
        _echoDateTime(_showTimeValue) {
            const rangeList = this.data.rangeList
            let rangeValue = new Array()
            const list = _showTimeValue.split(/[\-|\:|\s]/)
            list.map((el, index) => {
                rangeList[index].map((item, itemIndex) => {
                    item.indexOf(el) !== -1 && rangeValue.push(itemIndex)
                })
            })
            this.setData({
                rangeValue
            })
        },
        /**
         * 点击确定时触发的回调函数
         * @param {Number} ev
         */
        selectChangeFn(ev) {
            const selectValues = ev.detail.value
            const rangeList = this.data.rangeList
            let dateTime = ''
            selectValues.map((el, index) => {
                dateTime += rangeList[index][el].substring(0, rangeList[index][el].length - 1)
                if (index == 0 || index == 1) {
                    dateTime += '-'
                } else if (index == 3 || (index == 4 && index != selectValues.length - 1)) {
                    dateTime += ':'
                } else if (index == 2 && index != selectValues.length - 1) {
                    dateTime += ' '
                }
            })
            // ====触发父组件把值传递给父组件====
            this.triggerEvent('change', { value: dateTime })
        },
        /**
         *  当具体的一项的值发生改变时触发
         *  @param {Number} ev
         */
        selectColumnChangeFn(ev) {
            const { column, value } = ev.detail
            let { rangeList, rangeValue } = this.data
            let selectValue = Number(rangeList[column][value]
                .substring(0, rangeList[column][value].length - 1))
            if (column === 1) { // 改变月份 
                const currentYear = Number(rangeList[0][rangeValue[0]]
                    .substring(0, rangeList[0][rangeValue[0]].length - 1))
                const dayList = this._gotDayList(currentYear, selectValue)
                rangeList[column + 1] = dayList
            }
            this.setData({
                rangeList
            })
        }
    }
})

// 自定义异常
function CommonException(errMsg, code) {
    this.errMsg = errMsg
    this.code = code
}

// =====格式化日期===
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
