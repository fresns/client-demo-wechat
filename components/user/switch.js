import { getCurPage } from '../../util/getCurPage';

Component({
    properties: {
        user: Object,
    },
    data: {
        curRoute: '',
    },
    lifetimes: {
        attached() {
            this.setData({
                curRoute: getCurPage().route,
            });
        },
    },
    methods: {},
});
