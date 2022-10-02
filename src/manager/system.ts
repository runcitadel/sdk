import {ApiConnection} from '../common/connection.js';
import {joinUrl} from '../common/utils.js';
import type {
  backupStatus,
  connectionDetails,
  debugStatus,
  systemStatus,
  LndConnectionDetails,
  memUsage,
  RpcConnectionDetails,
  updateStatus,
  versionFile,
} from '../common/types';

export class ManagerSystem extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `v2/system`));
  }

  /**
   * Get system information
   *
   * @returns Information about the software on the system
   */
  async info(): Promise<versionFile> {
    return await this.get<versionFile>('info');
  }

  async getHiddenServiceUrl(): Promise<string> {
    return (await this.get<{url: string}>('dashboard-hidden-service')).url;
  }

  async getElectrumConnectionDetails(): Promise<connectionDetails> {
    return await this.get<connectionDetails>('electrum-connection-details');
  }

  async getBitcoinP2PConnectionDetails(): Promise<connectionDetails> {
    return await this.get<connectionDetails>('bitcoin-p2p-connection-details');
  }

  async getBitcoinRPConnectionDetails(): Promise<RpcConnectionDetails> {
    return await this.get<RpcConnectionDetails>(
      'bitcoin-rpc-connection-details',
    );
  }

  async getLndConnectUrls(): Promise<LndConnectionDetails> {
    return await this.get<LndConnectionDetails>('lndconnect-urls');
  }

  async getUpdate(): Promise<false | versionFile> {
    const data = await this.get<{update: versionFile | string}>(
      'get-update-details',
    );
    return typeof data.update === 'string' ? false : data.update;
  }

  async startUpdate(): Promise<void> {
    await this.post('update');
  }

  async startQuickUpdate(): Promise<void> {
    await this.post('quick-update');
  }

  async updateStatus(): Promise<updateStatus> {
    return await this.get<updateStatus>('update-status');
  }

  async backupStatus(): Promise<backupStatus> {
    return await this.get<backupStatus>('backup-status');
  }

  async debugResult(): Promise<debugStatus> {
    return await this.get<debugStatus>('debug-result');
  }

  async debug(): Promise<debugStatus> {
    return await this.post<debugStatus>('debug');
  }

  async shutdown(): Promise<systemStatus> {
    return await this.post<systemStatus>('shutdown');
  }

  async reboot(): Promise<systemStatus> {
    return await this.post<systemStatus>('reboot');
  }

  async storage(): Promise<memUsage> {
    return await this.get<memUsage>('storage');
  }

  async memory(): Promise<memUsage> {
    return await this.get<memUsage>('memory');
  }

  async temperature(): Promise<number> {
    return (await this.get<{temperature: number}>('temperature')).temperature;
  }

  async uptime(): Promise<number> {
    return (await this.get<{uptime: number}>('uptime')).uptime;
  }

  async disk(): Promise<'unknown' | 'nvme'> {
    return (await this.get<{externalStorage: 'unknown' | 'nvme'}>('disk-type'))
      .externalStorage;
  }

  async getUpdateChannel(): Promise<string> {
    return (await this.get<{channel: string}>('update-channel')).channel;
  }

  async setUpdateChannel(channel: string): Promise<void> {
    return this.put('update-channel', {
      channel,
    });
  }

  async isCitadelOS(): Promise<boolean> {
    return (
      (await this.get<{os: 'Citadel OS' | 'unknown'}>('/')).os === 'Citadel OS'
    );
  }
}
