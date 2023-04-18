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
                [chains.goerli.id]: '0x371bB96598623Ae47532ECfD755e94EA54825740'
            }
        }, {
            abi: erc20Permit,
            name: 'JK Coin',
            address: {
                [chains.goerli.id]: '0x5B35CB953469Bc66874325711C1ac50cEcBFe46d'
            }
        }
    ]
})
