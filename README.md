#  学习作业


## W1-1作业
* 安装Metamask，并创建好账号
* 执行一次转账
* 使用Remix创建一个Counter合约并部署：
*   Counter合约有一个add（x）的方法

![w1_1_1](https://github.com/hadesjaky/LearnSol2/blob/master/w1_1/w1_1.png)
![w1_1_2](https://github.com/hadesjaky/LearnSol2/blob/master/w1_1/w1_1_2.png)

## W1-2作业
* 修改Counter合约，仅有部署者可以调用count（）；
* 使用Hardhat部署修改后的Counter
* 使用Hardhat测试Counter：
* 代码开源到区块链浏览器（npx hardhat verify ）/写上合约地址
(注意：npx hardhat verify  ethscan接口在国内被墙了，拿到国外的vps上执行成功)

![w1_2](https://github.com/hadesjaky/LearnSol2/blob/master/w1_2/w1_2.png)

## W2-1作业
* 编写一个Bank合约：
*  通过Metamask向Bank合约转账ETH
*  在Bank合约记录每个地址转账金额
*  编写Bank合约withdraw（），实现提取出所有的ETH

[w2_1](https://github.com/hadesjaky/LearnSol2/tree/master/w2_1)

## w3-1作业
* 发行一个 ERC20Tken (用自己的名字) ， 发行 100000 token
* 编写一个金库Vault 合约:
* 编写 deposite 方法，实现 ERC20 存入Vaut，并记录每个用户存款金额 approve/transferFrom)
* 编写 withdraw 方法，提取用户自己的存款0
* 进阶练习:
* 使用 ERC2612 标准Tken ， 使用签名的方式 deposite
### 第二个作业
* 发行一个 ERC721 Token (用自己的名字)。
* 铸造 一个 NFT，在测试网上发行，在 Opensea 上查看。
* 编写一个合约: 使用自己发行的ERC20 Token 来买卖NFT。
* NFT 持有者可上架 NFT (设置价格 多少个TOKEN 购买 NFT )。
* 编写购买NFT 方法，转入对应的TOKEN，获取对应的 NFT。

[w3_1](https://github.com/hadesjaky/LearnSol2/tree/master/w3_1)

## w3-2作业
* 部署一个可升级的 ERC20 Token
* 第一版本
* 第二版本，加入方法: function transferWithCallback(address recipient, uint256amount) external returns (bool)

[w3_2](https://github.com/hadesjaky/LearnSol2/tree/master/w3_2)

## w4-1作业
* 编写前端使用之前的Vault合约：
用户可通过前端进行存款
  两个方式： Approve+deposit
  最好使用ERC2612（Permit）方式更好  （permitDeposit）
  前端显示用户存款金额
  用户可通过前端提取用户自己的存款（withdraw）

* 发行一个ERC721 Token：
  使用ethers.js解析ERC721转账时间
  加分项： 记录到数据库中，可方便查询用户持有的所有NFT

[w4_1](https://github.com/hadesjaky/LearnSol2/tree/master/w4_1)

## w4_2作业
*  发行一个ERC721 Token （使用之前发布的就可以）
*  用TheGraph 索引ERC721的转账事件
*  在playground可查询到数据（截图）
*  用Dune查询过去30天USDC的价格变化

[w4_2](https://github.com/hadesjaky/LearnSol2/tree/master/w4_2)

## w5_1作业
* 修改 Vault合约：
*  用户可以通过deposit进行存款（先Approve）-之前已经实现
*  当存款超过100时，转移一半的存款到指定的地址，如owner
*  可使用ChainLink Automation、Gelato、OpenZeeplin Defender

[w5_1](https://github.com/hadesjaky/LearnSol2/tree/master/w5_1)

## w5_2作业
* 完成代币兑换后，直接质押MasterChef
* withdraw（）：从MasterChef提取Token方法

[w5_2](https://github.com/hadesjaky/LearnSol2/tree/master/w5_2)

##w6_1
