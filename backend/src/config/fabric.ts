import { Gateway, Wallets, X509Identity } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface FabricConfig {
  channelName: string;
  chaincodeName: string;
  walletPath: string;
  ccpPath: string;
  identity: string;
  mspId: string;
  credPath: string;
}

export const getFabricConfig = (): FabricConfig => {
  return {
    channelName: process.env.FABRIC_CHANNEL || 'mychannel',
    chaincodeName: process.env.FABRIC_CHAINCODE || 'lisencecc',
    walletPath: process.env.FABRIC_WALLET_PATH || path.join(process.cwd(), 'wallet'),
    ccpPath: process.env.FABRIC_CCP_PATH || path.join(process.cwd(), 'config', 'connection-org1.yaml'),
    identity: process.env.FABRIC_IDENTITY || 'admin',
    mspId: process.env.FABRIC_MSP_ID || 'Org1MSP',
    credPath: process.env.FABRIC_ADMIN_CRED_PATH || '',
  };
};

export class FabricClient {
  private config: FabricConfig;
  private gateway: Gateway | null = null;
  private network: any = null;
  private contract: any = null;

  constructor(config: FabricConfig) {
    this.config = config;
  }

  public async connect(): Promise<void> {
    if (process.env.FABRIC_ENABLED !== "true") {
      console.log("Fabric disabled");
      return;
    }
    try {
      const wallet = await Wallets.newFileSystemWallet(this.config.walletPath);

      // Import identity if not exists
      const identityExists = await wallet.get(this.config.identity);
      if (!identityExists) {
        if (!this.config.credPath) {
          console.warn('No identity in wallet and missing FABRIC_ADMIN_CRED_PATH. Fabric disabled.');
          return;
        }

        const certPath = path.join(this.config.credPath, 'signcerts', 'cert.pem');
        const keyDir = path.join(this.config.credPath, 'keystore');
        const keyFiles = fs.readdirSync(keyDir);
        if (keyFiles.length === 0) {
          throw new Error('No private key found in keystore');
        }
        const keyPath = path.join(keyDir, keyFiles[0]);

        const cert = fs.readFileSync(certPath).toString();
        const key = fs.readFileSync(keyPath).toString();

        const identity: X509Identity = {
          credentials: {
            certificate: cert,
            privateKey: key,
          },
          mspId: this.config.mspId,
          type: 'X.509',
        };

        await wallet.put(this.config.identity, identity);
        console.log('✅ Imported identity into wallet');
      }

      // Load connection profile
      let connectionProfile;
      if (this.config.ccpPath.endsWith('.yaml') || this.config.ccpPath.endsWith('.yml')) {
        connectionProfile = yaml.load(fs.readFileSync(this.config.ccpPath, 'utf8')) as Record<string, unknown>;
      } else {
        connectionProfile = JSON.parse(fs.readFileSync(this.config.ccpPath, 'utf8'));
      }

      this.gateway = new Gateway();
      await this.gateway.connect(connectionProfile, {
        wallet,
        identity: this.config.identity,
        discovery: { enabled: true, asLocalhost: true },
      });

      this.network = await this.gateway.getNetwork(this.config.channelName);
      this.contract = this.network.getContract(this.config.chaincodeName);

      console.log('✅ Connected to Fabric network');
    } catch (error) {
      console.error('⚠️ Failed to connect to Fabric (running in offline mode):', error);
      this.contract = null;
    }
  }

  public getContract() {
    return this.contract;
  }

  public async submitTransaction(funcName: string, ...args: string[]): Promise<Buffer> {
    if (!this.contract) {
      throw new Error('Fabric contract not initialized');
    }
    console.log(`FABRIC SUBMIT: ${funcName}, Args: ${args}`);
    return await this.contract.submitTransaction(funcName, ...args);
  }

  public async evaluateTransaction(funcName: string, ...args: string[]): Promise<Buffer> {
    if (!this.contract) {
      throw new Error('Fabric contract not initialized');
    }
    console.log(`FABRIC EVALUATE: ${funcName}, Args: ${args}`);
    return await this.contract.evaluateTransaction(funcName, ...args);
  }

  public disconnect() {
    this.gateway?.disconnect();
  }
}
