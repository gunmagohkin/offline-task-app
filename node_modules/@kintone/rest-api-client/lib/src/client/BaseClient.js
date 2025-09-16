"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
var url_1 = require("../url");
var BaseClient = /** @class */ (function () {
    function BaseClient(client, guestSpaceId) {
        this.client = client;
        this.guestSpaceId = guestSpaceId;
    }
    BaseClient.prototype.buildPathWithGuestSpaceId = function (params) {
        return (0, url_1.buildPath)(__assign(__assign({}, params), { guestSpaceId: this.guestSpaceId }));
    };
    /**
     * This method is used to build the endpoint for the API that does not support the guest space URL.
     * Otherwise, please use `buildPathWithGuestSpaceId` instead.
     * @param params
     * @protected
     */
    BaseClient.prototype.buildPath = function (params) {
        return (0, url_1.buildPath)(params);
    };
    return BaseClient;
}());
exports.BaseClient = BaseClient;
//# sourceMappingURL=BaseClient.js.map