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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileClient = void 0;
var form_data_1 = __importDefault(require("form-data"));
var platform_1 = require("../platform");
var UnsupportedPlatformError_1 = require("../platform/UnsupportedPlatformError");
var BaseClient_1 = require("./BaseClient");
var FileClient = /** @class */ (function (_super) {
    __extends(FileClient, _super);
    function FileClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileClient.prototype.uploadFile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var path, formData, _a, name_1, data, e_1, _b, name_2, data, fileData;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        path = this.buildPathWithGuestSpaceId({
                            endpointName: "file",
                        });
                        formData = new form_data_1.default();
                        if (!("path" in params.file)) return [3 /*break*/, 5];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, platform_1.platformDeps.readFileFromPath(params.file.path)];
                    case 2:
                        _a = _c.sent(), name_1 = _a.name, data = _a.data;
                        formData.append("file", data, name_1);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        if (e_1 instanceof UnsupportedPlatformError_1.UnsupportedPlatformError) {
                            throw new Error("uploadFile doesn't allow to accept a file path in ".concat(e_1.platform, " environment."));
                        }
                        throw e_1;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        _b = params.file, name_2 = _b.name, data = _b.data;
                        fileData = platform_1.platformDeps.buildFormDataValue(data, name_2);
                        formData.append("file", fileData, name_2);
                        _c.label = 6;
                    case 6: return [2 /*return*/, this.client.postData(path, formData)];
                }
            });
        });
    };
    FileClient.prototype.downloadFile = function (params) {
        var path = this.buildPathWithGuestSpaceId({
            endpointName: "file",
        });
        return this.client.getData(path, params);
    };
    return FileClient;
}(BaseClient_1.BaseClient));
exports.FileClient = FileClient;
//# sourceMappingURL=FileClient.js.map