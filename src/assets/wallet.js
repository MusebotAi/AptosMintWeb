class Wallet {
    static walletInstance = null;

    constructor(){
        this.accountAddr = ""
        this.walletObj = null
    }

    static getWallet() {
        return Wallet.walletInstance
    }

    getAddress() {
        return this.accountAddr
    }

    async connect() {
        let ac = await this.walletObj.connect()
        this.accountAddr = ac.address
    }

    onAccountChange(func) {
        this.walletObj.onAccountChange((account) =>{
            if(account){
                this.accountAddr = account.address
            }
            if(func){
                func(account)
            }
        })
    }

    async runTransAction(funName,args,aptosClient){
        const transaction = {
          function: funName,
          arguments: args,
          type_arguments: [],
        };          
          const pendingTransaction = await this.signAndSubmitTransaction(transaction);
          const txn = await aptosClient.waitForTransactionWithResult(pendingTransaction);
          return txn
    };
}

class Petra extends Wallet {
    constructor() {
        super()
        this.walletObj = window.aptos
    }
    static info() {
        return {
            img: 'https://petra.app/favicon.ico',
            url: 'https://petra.app/',
            name: 'Petra Wallet',
            detected: 'aptos' in window,
            index: 0,
        }
    }

    async signAndSubmitTransaction(transaction) {
        transaction.type = "entry_function_payload"
        let txn = await this.walletObj.signAndSubmitTransaction(transaction)
        return txn.hash
    }
}

class Martain extends Wallet {
    constructor() {
        super()
        this.walletObj = window.martian
    }
    static info() {
        return {
            img: 'https://martianwallet.xyz/favicon.ico',
            url: 'https://martianwallet.xyz/',
            name: 'Martain Wallet',
            detected: 'martian' in window,
            index: 1,
        }
    }

    async signAndSubmitTransaction(transaction) {
        let txn = await this.walletObj.generateSignAndSubmitTransaction(this.accountAddr, transaction);
        return txn
    }
}

/**
 * {
 *      img: 'https://martianwallet.xyz/favicon.ico',  钱包图标
        url: 'https://martianwallet.xyz/',             钱包安装地址，如果检测到钱包没有安装，界面可以引导用户点击安装
        name: 'Martain Wallet',                        钱包名称
        detected: 'martian' in window,                 bool，返回本钱包是否安装
        index: 1,                                      钱包索引，使用本索引来作为调用connect函数的参数，可以链接对应的钱包
 * }
 * @returns 返回支持的钱包信息列表
 */
const getList = () => {
    return [
        Petra.info(),Martain.info()
    ]
}

/**
 * 通过索引链接钱包
 * @param {Number} idx  list返回信息里的index字段作为参数
 * @returns 
 */
const connect = async (idx) => {
    switch(idx){
        case 0:
            Wallet.walletInstance = new Petra()
            break;
        case 1:
            Wallet.walletInstance = new Martain()
            break;
    }
    await Wallet.walletInstance.connect()
    return Wallet.walletInstance
}

export { Wallet,getList,connect } 

