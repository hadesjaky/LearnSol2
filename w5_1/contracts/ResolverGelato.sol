//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IVault {
    function valueToCold() external;
}

contract Resolver {
    address public immutable valutAddr;
    address public immutable atoken;

    constructor(address _atoken, address _vault) {
        atoken = _atoken;
        valutAddr = _vault;
    }

    function toBytes1(uint256 x) public pure returns (bytes memory b) {
        b = new bytes(32);
        assembly {
            mstore(add(b, 32), x)
        }
    }

    function checker()
        external
        view
        returns (bool canExec, bytes memory execPayload)
    {
        uint256 value = IERC20(atoken).balanceOf(valutAddr);
        if (value > 1e18) {
            execPayload = abi.encodeCall(IVault.valueToCold, ());
            return (true, execPayload);
        }
        return (false, toBytes1(value));
    }
}
