"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkRequestClient = void 0;
var BaseClient_1 = require("./BaseClient");
var BulkRequestClient = /** @class */ (function (_super) {
    __extends(BulkRequestClient, _super);
    function BulkRequestClient(client, guestSpaceId) {
        var _this = _super.call(this, client, guestSpaceId) || this;
        _this.REQUESTS_LENGTH_LIMIT = 20;
        return _this;
    }
    BulkRequestClient.prototype.send = function (params) {
        var _this = this;
        var requestsParam = params.requests;
        var requests = requestsParam.map(function (request) {
            if ("endpointName" in request) {
                var endpointName = request.endpointName, rest = __rest(request, ["endpointName"]);
                return __assign({ api: _this.buildPathWithGuestSpaceId({ endpointName: endpointName }) }, rest);
            }
            return request;
        });
        var path = this.buildPathWithGuestSpaceId({
            endpointName: "bulkRequest",
        });
        return this.client.post(path, { requests: requests });
    };
    return BulkRequestClient;
}(BaseClient_1.BaseClient));
exports.BulkRequestClient = BulkRequestClient;
//# sourceMappingURL=BulkRequestClient.js.map