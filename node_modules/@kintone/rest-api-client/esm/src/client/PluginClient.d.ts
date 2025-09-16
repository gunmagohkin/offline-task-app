import { BaseClient } from "./BaseClient";
import type { GetAppsForRequest, GetAppsForResponse, GetPluginsForRequest, GetPluginsForResponse, GetRequiredPluginsForRequest, GetRequiredPluginsForResponse, UpdatePluginForRequest, UpdatePluginForResponse, InstallPluginForRequest, InstallPluginForResponse, UninstallPluginForRequest } from "./types/plugin";
export declare class PluginClient extends BaseClient {
    getPlugins(params: GetPluginsForRequest): Promise<GetPluginsForResponse>;
    getRequiredPlugins(params: GetRequiredPluginsForRequest): Promise<GetRequiredPluginsForResponse>;
    getApps(params: GetAppsForRequest): Promise<GetAppsForResponse>;
    updatePlugin(params: UpdatePluginForRequest): Promise<UpdatePluginForResponse>;
    installPlugin(params: InstallPluginForRequest): Promise<InstallPluginForResponse>;
    uninstallPlugin(params: UninstallPluginForRequest): Promise<{}>;
}
