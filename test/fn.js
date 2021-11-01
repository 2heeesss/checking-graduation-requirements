const userData = require('./mydata');

const fn = {
    isOneOrTwoMajor: (data) => {
        for (const cell of data) {
            if (!cell.__EMPTY_28) {
                continue;
            }

            if (cell.__EMPTY_28.includes('복수전공')) {
                return '복수전공';
            } else if (cell.__EMPTY_28.includes('부전공')) {
                return '부전공';
            }
        }
        return '전공';
    },
};

module.exports = fn;