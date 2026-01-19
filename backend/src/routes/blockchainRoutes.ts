import { Router, Request, Response } from 'express';
import { blockchainService } from '../services/blockchainService';

const router = Router();

/**
 * @route   GET /api/v1/blockchain/license/:id
 * @desc    Query a license from blockchain
 * @access  Public
 */
router.get('/license/:id', async (req: Request, res: Response) => {
    try {
        const licenseId = req.params.id;
        const data = await blockchainService.queryLicense(licenseId);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `License ${licenseId} not found on blockchain`
            });
        }

        res.json({
            success: true,
            data
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * @route   GET /api/v1/blockchain/license/:id/exists
 * @desc    Check if a license exists on blockchain
 * @access  Public
 */
router.get('/license/:id/exists', async (req: Request, res: Response) => {
    try {
        const licenseId = req.params.id;
        const exists = await blockchainService.licenseExists(licenseId);

        res.json({
            success: true,
            licenseId,
            exists
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * @route   POST /api/v1/blockchain/license
 * @desc    Submit a license to blockchain
 * @access  Public
 */
router.post('/license', async (req: Request, res: Response) => {
    try {
        const { id, h1Hash, h2Hash } = req.body;

        if (!id || !h1Hash || !h2Hash) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: id, h1Hash, h2Hash'
            });
        }

        const result = await blockchainService.submitLicense(id, h1Hash, h2Hash);

        res.json(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * @route   GET /api/v1/blockchain/license/:id/full
 * @desc    Get license with blockchain verification
 * @access  Public
 */
router.get('/license/:id/full', async (req: Request, res: Response) => {
    try {
        const licenseId = req.params.id;
        const result = await blockchainService.getLicenseWithBlockchainData(licenseId);

        res.json({
            success: true,
            licenseId,
            ...result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
