import { AptosClient, TokenClient,HexString } from "aptos";
import axios from 'axios'
import { Wallet} from './wallet'

const APT_UNIT = 100_000_000
// 使用微秒，无需修改
// const TIME_UNIT = 1  

class NetType {
    static MAIN_NET = {
        NODE_URL: "https://fullnode.mainnet.aptoslabs.com/v1",
        GRAPHQL_URL: "https://indexer.mainnet.aptoslabs.com/v1/graphql",
    }

    static TEST_NET = {
        NODE_URL: "https://fullnode.testnet.aptoslabs.com/v1",
        GRAPHQL_URL: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
    }

    static DEV_NET = {
        NODE_URL: "https://fullnode.devnet.aptoslabs.com/v1",
        GRAPHQL_URL: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
    }
}

const jsonp = (url) => {
    return new Promise((resolve, reject) => {
        window.jsonCallBack =(result) => {
            resolve(result)
        }
        const JSONP = document.createElement('script');
        JSONP.type = 'text/javascript';
        JSONP.src = url;
        document.getElementsByTagName('head')[0].appendChild(JSONP);
        setTimeout(() => {
            document.getElementsByTagName('head')[0].removeChild(JSONP)

        },500)
    })
}

class MintNFT {
    constructor(netType,moduleAddress) {
        this.netType = netType
        this.client = new AptosClient(netType.NODE_URL)
        this.tokenClient = new TokenClient(this.client)
        this.moduleAddress = moduleAddress
    }

    /**
     * 提交配置修改请求
     * @param {Object{     
     *               collection_name: String,       集合名称
     *               token_pre: String,             token名称前缀
     *               pre_uri: String,               uri路径前缀                
     *               presale_timestamp: u64,        预售时间 unix时间戳，毫秒
     *               sale_timestamp: u64,           正式开售时间 unix时间戳，毫秒
     *               total_supply: u64,             总计提供的nft数量
     *               mint_random: bool,             是否随机token数字
     *               minting_enabled: bool,         是否启用合约
     *               strategys: Array<{
     *                              id: u64,        合约策略id，不可重复
     *                              type: u8,       约策略类型：0 owner自留， 1 白名单用户， 2 收费mint
     *                              supply: u64,    合约策略供应数量： 本策略提供的nft数量
     *                              fee: u64        合约策略费用： 本策略对应的费用，可以为0，单位为APT
     *                          }>
     *               whitelist: String              白名单账户地址列表,英文逗号(,)分割
     *         }} params 
     * @returns 
     */
     async configModule(params) {
        let white_list = params.whitelist.split(",")
        let strategys = params.strategys.sort((a,b)=> { if(a.type != b.type){ return a.type - b.type } return a.fee - b.fee})
        let strategy_id = strategys.map(v=>v.id)
        let strategy_supply = strategys.map(v=>v.supply)
        let strategy_types = strategys.map(v=>v.type)
        let strategy_fee = strategys.map(v=>v.fee * APT_UNIT)
        let funName = `${this.moduleAddress}::minting::modify_module_by_owner`
        let args =  [params.collection_name,params.token_pre,params.pre_uri,
        Number(params.presale_timestamp),Number(params.sale_timestamp),params.total_supply,params.mint_random,params.minting_enabled,
        strategy_id,strategy_types,strategy_supply,strategy_fee,white_list]
        return await Wallet.getWallet()?.runTransAction(funName,args,this.client)
    }

    /**
     * @returns 
     * {     
     *               collection_name: String,       集合名称
     *               token_pre: String,             token名称前缀
     *               pre_uri: String,               uri路径前缀                
     *               presale_timestamp: u64,        预售时间 unix时间戳，毫秒
     *               sale_timestamp: u64,           正式开售时间 unix时间戳，毫秒
     *               total_supply: u64,             总计提供的nft数量
     *               mint_random: bool,             是否随机token数字
     *               minting_enabled: bool,         是否启用合约
     *               strategys: Array<{
     *                              id: u64,        合约策略id，不可重复
     *                              type: u8,       约策略类型：0 owner自留， 1 白名单用户， 2 收费mint
     *                              supply: u64,    合约策略供应数量： 本策略提供的nft数量
     *                              fee: u64        合约策略费用： 本策略对应的费用
     *                          }>
     *               whitelist: String              白名单账户地址列表,英文逗号(,)分割
     *         }} params 
     */
    getModuleConfig() {
        return new Promise((resolve,reject) => {
            this.client.getAccountResource(this.moduleAddress,`${this.moduleAddress}::minting::CollectionTokenMinter`)
            .then((res) => {
                let configData = res.data
                configData.whitelist = configData.white_list?.join(",")
                configData.presale_timestamp = Number(configData.presale_timestamp)
                configData.sale_timestamp = Number(configData.sale_timestamp)
                configData.total_supply = Number(configData.total_supply)
                configData.used = Number(configData.used)
                let strategyids = configData.strategy_ids
                configData.strategys = []
                let sLen = strategyids?.length
                if (!sLen || sLen == 0){
                    configData.total_supply = 15
                    configData.strategys = [
                        {id:0,type:0,supply:2,used:0,fee:0},{id:1,type:1,supply:3,used:0,fee:0},{id:2,type:2,supply:2,used:0,fee:0},
                        {id:3,type:2,supply:3,used:0,fee:0.00069},{id:4,type:2,supply:5,used:0,fee:0.00099},
                    ]
                    resolve(configData)
                }
                strategyids?.forEach(v => {
                    this.getStrategys(configData.mint_strategys.handle,v)
                    .then(s=>{
                        s.id = Number(v)
                        s.fee = s.fee/APT_UNIT
                        s.supply = Number(s.supply)
                        configData.strategys.push(s)
                        // configData.total_supply += Number(s.supply)
                        // configData.used += Number(s.used)
                        if(configData.strategys.length == sLen) {
                            configData.strategys = configData.strategys.sort((a,b)=> { if(a.type != b.type){ return a.type - b.type }return a.fee - b.fee})
                            resolve(configData)
                        }
                    })
                    .catch(e => {
                        reject(e)
                    })
                });
            }).catch(e => {
                reject(e)
            })
        });
    }

    /**
     * mint操作，返回成功失败
     * {bool} @returns 
     */
    async mint() {
        let funName = `${this.moduleAddress}::minting::mint_nft`
        let args =  []
        try{
            await Wallet.getWallet()?.runTransAction(funName,args,this.client)
            return true
        }catch(e){
            console.log(e)
            return false   
        } 
    };

    
    /**
     * 获取当前钱包账户的地址、APTCoins余额、NFT列表信息（列表按照交易时间倒序排列，通过nftLimit参数控制最大个数，默认为5）
     * @param {Number} nftLimit 用户NFT列表最大个数，默认为5
     * @returns {
     *      address: String  钱包账户地址
     *      coins: Number  APT余额，浮点数
     *      tokens: Array<Object> NFT列表 对象字段示例参考如下：
     *              {
     *                  "name": "token1",       token名称
                        "amount": 10,           拥有数量
                        "collection_name": "Ron's test",  collection名称
                        "creator_address": "0x7b516e77daff31895f43847b9733661b270297608b4fc42e5a327ee98e679722",  创建者地址
                        "property_version": 0,  token属性版本号
                        "transaction_timestamp": "2022-11-04T14:42:24"  交易时间
                        "image": ""                图片url地址
                        "uri": "https://ipfs.io/ipfs/xxxxxxx/0.json"  token的内容描述文件json，界面展示时可以解析本json内容，其中包含image字段为图片地址，json格式参见如下
     *              }
                    uri json格式示例：
                    {
                        "name": "MyCollection1",
                        "description": "Remember to replace this description",
                        "image": "ipfs://QmdxRVS6wumVQZsVWZrtXRkGLE2yx95KtVCVb43rsmSRbb",  图片地址
                        "attributes": [
                            {
                            "trait_type": "Background",
                            "value": "Black"
                            },
                            {
                            "trait_type": "Eyeball",
                            "value": "White"
                            },
                            {
                            "trait_type": "Eye color",
                            "value": "Yellow"
                            },
                            {
                            "trait_type": "Iris",
                            "value": "Medium"
                            },
                            {
                            "trait_type": "Shine",
                            "value": "Shapes"
                            },
                            {
                            "trait_type": "Bottom lid",
                            "value": "Low"
                            },
                            {
                            "trait_type": "Top lid",
                            "value": "Middle"
                            }
                        ]
                    }
     * }
     */
    getAccountInfo(nftLimit = 5) {
        return new Promise((resolve,reject) => {
            let account = {
                address: Wallet.getWallet()?.getAddress()
            }
            this.client.getAccountResource(account.address,"0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>")
            .then((res)=>{
                account.coins = Number(res.data.coin.value)/APT_UNIT
                axios.post(this.netType.GRAPHQL_URL,{
                        "query": `query MyQuery {
                            token_ownerships(
                            limit: ${nftLimit}
                            order_by: {transaction_timestamp: desc}
                            where: {owner_address: {_eq: "${account.address}"}}
                            ) {
                            name
                            amount
                            collection_name
                            creator_address
                            property_version
                            transaction_timestamp
                            }
                        }`,
                        "variables": {},
                        "operationName": "MyQuery",
                }).then((r)=>{
                    account.tokens = []
                    account.tokens = r.data.data.token_ownerships
                    let l = 0
                    account.tokens.forEach(v=>{
                        this.tokenClient.getTokenData(v.creator_address,v.collection_name,v.name).then((token)=>{
                            v.uri = token.uri
                            if(v.uri.endsWith("json")){
                                // 注意json地址服务器要配置同源策略，否则跨域访问失败
                                axios.get(v.uri)
                                .then((res)=>{
                                    v.image = res.data.image
                                    l++
                                    if(l == account.tokens.length){
                                        resolve(account)
                                    }
                                })
                            }else{
                                v.image = v.uri
                                l++
                                if(l == account.tokens.length){
                                    resolve(account)
                                }
                            }
                        })
                    })
                }).catch((e)=>{
                    reject(e)
                })
            }).catch((e)=>{
                reject(e)
            })
        })
    }

    /**
     * 获取用户合约信息
     * @returns 
     * {     
     *               collection_name: String,       集合名称
     *               token_pre: String,             token名称前缀
     *               pre_uri: String,               uri路径前缀                
     *               total_supply: u64,             总计提供的nft数量
     *               price: u64,                    合约策略费用： 本策略对应的费用
     *               used: u64,                     已铸造的nft数量
     *         }} 
     */
     getUserConfig() {
        return new Promise((resolve,reject) => {
            let address = Wallet.getWallet().getAddress();
            this.client.getAccountResource(address,`${address}::minting::CollectionTokenMinter`)
            .then((res) => {
                let configData = res.data
                configData.total_supply = Number(configData.total_supply)
                configData.used = Number(configData.used)
                configData.price = Number(configData.price)/APT_UNIT
                resolve(configData)
            }).catch(e => {
                resolve(null)
                console.error(e)
            })
        });
    }

    /**
     * 提交用户合约配置修改请求
     * @param {Object{     
     *               collection_name: String,       集合名称
     *               token_pre: String,             token名称前缀
     *               pre_uri: String,               uri路径前缀                
     *               total_supply: u64,             总计提供的nft数量
     *               price: u64,                    合约策略费用： 本策略对应的费用
     *               used: u64,                     已铸造的nft数量
     *         }} params 
     * @returns 
     */
     async setUserConfig(params) {
        let address = Wallet.getWallet().getAddress();
        let price = Number(params.price)*APT_UNIT
        let funName = `${address}::minting::modify_module_by_owner`
        let args =  [params.collection_name,params.token_pre,params.pre_uri,params.total_supply,price,params.used]
        return await Wallet.getWallet()?.runTransAction(funName,args,this.client)
    }

     /**
     * 发布合约并初始配置
     * @param {Object{     
      *               collection_name: String,       集合名称
      *               token_pre: String,             token名称前缀
      *               pre_uri: String,               uri路径前缀                
      *               total_supply: u64,             总计提供的nft数量
      *               price: u64,                    合约策略费用： 本策略对应的费用
      *               used: u64,                     已铸造的nft数量
      *         }} params 
      * @returns 
      */
    async publishPackage(params) {
        let address = Wallet.getWallet().getAddress();
        let res = await axios.post('/api/move/'+address,{
            "preUri":params.pre_uri,
            "totalSupply":params.total_supply,
            "price": Number(params.price)*APT_UNIT,
        });
        let packageContent = res.data
        let funName = "0x1::code::publish_package_txn"
        let args =  [packageContent.meta,packageContent.code]
        try{
            await Wallet.getWallet()?.runTransAction(funName,args,this.client)
            return true
        }catch(e){
            console.log(e)
            return false   
        } 
    }

    /**
     * 修改demo网站一键生成NFT的配置
     * @param {Object{     
     *               collection_name: String,       集合名称
     *               token_pre: String,             token名称前缀
     *         }} params 
     * @returns 
     */
     async setMintOneConfig(params) {
        let funName = `${this.moduleAddress}::mintone::modify_module_by_owner`
        let args =  [params.collection_name,params.token_pre]
        return await Wallet.getWallet()?.runTransAction(funName,args,this.client)
    }

    /**
     * mintone操作，返回成功失败 （用于demo网站一键生成NFT)
     * @param {String} tokenUri 
     * @returns 
     */
     async mintOne(tokenUri) {
        let funName = `${this.moduleAddress}::mintone::mint_nft`
        let args =  [tokenUri]
        try{
            await Wallet.getWallet()?.runTransAction(funName,args,this.client)
            return true
        }catch(e){
            console.log(e)
            return false   
        } 
    };

    async getAccounts() {
        let ac = await this.client.getAccountResources(this.moduleAddress)
        console.log(ac)
    }

    async getStrategys(handle,keyvalue) {
        return await this.client.getTableItem(handle,{
            key_type: "u64",
            value_type: `${this.moduleAddress}::minting::MintStrategy`,
            key: keyvalue
        })
    }
}

export { NetType, MintNFT }
