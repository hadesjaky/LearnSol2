import {defineConfig} from '@wagmi/cli'
import {erc, react} from '@wagmi/cli/plugins'
import * as chains from '@wagmi/chains'

import {vaultAbi} from "./src/abis/Vault";
import {erc20Permit} from "./src/abis/Erc20Permit";

export default defineConfig({
    out: 'src/generated.ts',
    plugins: [erc(), react()],
    contracts: [
        {
            abi: vaultAbi,
            name: 'Vault',
            address: {
                [chains.sepolia.id]: '0x81B3ee1277a0a83F3776949540a0c5360b298140'
            }
        }, {
            abi: erc20Permit,
            name: 'JK Coin',
            address: {
                [chains.sepolia.id]: '0x81ED87C072E3B83E01c9C2438BA515809515efe7'
            }
        }
    ]
})
