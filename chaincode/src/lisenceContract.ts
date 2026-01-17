/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';

@Info({title: 'LisenceContract', description: 'Smart Contract for managing Lisence Assets'})
export class LisenceContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async AssetExists(ctx: Context, id: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async SubmitLisence(ctx: Context, id: string, h1Hash: string, h2Hash: string): Promise<void> {
        const exists = await this.AssetExists(ctx, id);
        
        const asset = {
            id,
            h1Hash,
            h2Hash,
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(id, buffer);
        
        if (exists) {
            console.log(`Asset ${id} updated.`);
        } else {
            console.log(`Asset ${id} created.`);
        }
    }

    @Transaction(false)
    @Returns('string')
    public async QueryLisence(ctx: Context, id: string): Promise<string> {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }
}
