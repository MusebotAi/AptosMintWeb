import { Wallet } from './wallet'

class EthWallet {
    constructor(){
        this.accountAddr = ""
        this.walletObj = null
        this.isConnect = false;
    }

    getAddress() {
        return this.accountAddr
    }

    async connect() {
        try{
            let accounts = await this.walletObj.request({ method: 'eth_requestAccounts' })
            this.accountAddr = accounts[0];
        }catch(err) {
            if (err.code === 4001) {
                console.log('Please connect to MetaMask.');
            } else {
                console.error(err);
            }
        };
    }
}

class MetaMask extends EthWallet {
    constructor() {
        super()
        this.walletObj = window.ethereum
    }
    static info() {
        return {
            img: 'https://metamask.io/icons/icon-144x144.png?v=48400a28770e10dd52a8c0e539aeb282',
            url: 'https://metamask.io/',
            name: 'MetaMask',
            detected: ethereum.isMetaMask,
            index: 0,
        }
    }
}

export { MetaMask } 

