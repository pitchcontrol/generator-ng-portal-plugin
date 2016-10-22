'use strict';
let changeCase = require('change-case');

class BasePage {
    constructor(fields) {
        this.title = '';
        if (fields) {
            for (let f of fields) {
                this[changeCase.lowerCaseFirst(f)] = '';
            }
        }
    }
}


module.exports.EditPage = class EditPage extends BasePage {
    constructor(fields) {
        super(fields);
        this.pageTitleAdd = '';
        this.pageTitleEdit = '';
        this.notifications = {
            load: {
                fail: ''
            },
            update: {
                fail: '',
                success: ''
            },
            save: {
                fail: '',
                success: ''
            }
        };
    }
}
module.exports.ListPage = class ListPage extends BasePage {
    constructor(fields) {
        super(fields);
        this.notifications = {
            load: {
                fail: ''
            },
            delete: {
                fail: '',
                success: ''
            }
        };
    }
}