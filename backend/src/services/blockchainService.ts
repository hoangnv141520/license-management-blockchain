import { FabricClient, getFabricConfig } from '../config/fabric';

export class BlockchainService {
    private fabricClient: FabricClient;

    constructor() {
        const config = getFabricConfig();
        this.fabricClient = new FabricClient(config);
    }

    async init() {
        await this.fabricClient.connect();
    }

    /**
     * Query a license from the blockchain
     */
    async queryLicense(licenseId: string): Promise<any> {
        try {
            const result = await this.fabricClient.evaluateTransaction('QueryLisence', licenseId);
            return JSON.parse(result.toString());
        } catch (error: any) {
            if (error.message.includes('does not exist')) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Check if a license exists on the blockchain
     */
    async licenseExists(licenseId: string): Promise<boolean> {
        try {
            const result = await this.fabricClient.evaluateTransaction('AssetExists', licenseId);
            return result.toString() === 'true';
        } catch (error) {
            console.error('Error checking license existence:', error);
            return false;
        }
    }

    /**
     * Submit a license to the blockchain
     */
    async submitLicense(licenseId: string, h1Hash: string, h2Hash: string): Promise<any> {
        try {
            await this.fabricClient.submitTransaction('SubmitLisence', licenseId, h1Hash, h2Hash);
            return {
                success: true,
                licenseId,
                message: 'License submitted successfully to blockchain'
            };
        } catch (error: any) {
            throw new Error(`Failed to submit license: ${error.message}`);
        }
    }

    /**
     * Get all data for a license (from database and blockchain)
     */
    async getLicenseWithBlockchainData(licenseId: string) {
        const exists = await this.licenseExists(licenseId);

        if (!exists) {
            return {
                onBlockchain: false,
                data: null
            };
        }

        const blockchainData = await this.queryLicense(licenseId);

        return {
            onBlockchain: true,
            data: blockchainData
        };
    }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
