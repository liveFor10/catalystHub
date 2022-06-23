
//db connectivity
exports.mongoURL = 'mongodb://127.0.0.1';
/* exports.mongoURL = 'mongodb+srv://admin:adminASDpoi)(*123@mdbcluster00.ezr4k.mongodb.net?retryWrites=true&w=majority'; */

//query customization
exports.MAX_ITEMS_PER_QUERY = 119;
exports.ITEMS_PER_PAGE = 3;
exports.REQUESTED_PAGE_NUMBER = 0;

exports.SORT_ORDER_ASC = 1
exports.SORT_ORDER_DESC = -1

//query filter operators
exports.QO_EQUAL_TO = '$eq';
exports.QO_GREATER_THAN = '$gt';
exports.QO_GREATER_THAN_OR_EQUAL_TO = '$gte';
exports.QO_IN_ARRAY = '$in';
exports.QO_LESS_THAN = '$lt';
exports.QO_LESS_THAN_OR_EQUAL_TO = '$lte';
exports.QO_NOT_EQUAL_TO = '$ne';
exports.QO_NOT_IN_ARRAY = '$nin';

//itemsPerPage, requestedPageNumber, searchOrder
exports.NOT_SEARCH_PARAMS = ['ipp', 'rpn', 'so' ];
