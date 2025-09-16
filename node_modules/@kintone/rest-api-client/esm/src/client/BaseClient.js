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
import { buildPath } from "../url";
var BaseClient = /** @class */ (function () {
    function BaseClient(client, guestSpaceId) {
        this.client = client;
        this.guestSpaceId = guestSpaceId;
    }
    BaseClient.prototype.buildPathWithGuestSpaceId = function (params) {
        return buildPath(__assign(__assign({}, params), { guestSpaceId: this.guestSpaceId }));
    };
    /**
     * This method is used to build the endpoint for the API that does not support the guest space URL.
     * Otherwise, please use `buildPathWithGuestSpaceId` instead.
     * @param params
     * @protected
     */
    BaseClient.prototype.buildPath = function (params) {
        return buildPath(params);
    };
    return BaseClient;
}());
export { BaseClient };
//# sourceMappingURL=BaseClient.js.map