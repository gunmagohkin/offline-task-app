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
import { BaseClient } from "./BaseClient";
var PluginClient = /** @class */ (function (_super) {
    __extends(PluginClient, _super);
    function PluginClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PluginClient.prototype.getPlugins = function (params) {
        var path = this.buildPath({ endpointName: "plugins" });
        return this.client.get(path, params);
    };
    PluginClient.prototype.getRequiredPlugins = function (params) {
        var path = this.buildPath({ endpointName: "plugins/required" });
        return this.client.get(path, params);
    };
    PluginClient.prototype.getApps = function (params) {
        var path = this.buildPath({ endpointName: "plugin/apps" });
        return this.client.get(path, params);
    };
    PluginClient.prototype.updatePlugin = function (params) {
        var path = this.buildPath({ endpointName: "plugin" });
        return this.client.put(path, params);
    };
    PluginClient.prototype.installPlugin = function (params) {
        var path = this.buildPath({ endpointName: "plugin" });
        return this.client.post(path, params);
    };
    PluginClient.prototype.uninstallPlugin = function (params) {
        var path = this.buildPath({ endpointName: "plugin" });
        return this.client.delete(path, params);
    };
    return PluginClient;
}(BaseClient));
export { PluginClient };
//# sourceMappingURL=PluginClient.js.map