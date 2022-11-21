import { ref } from 'vue'
import moment from "moment/moment";
import { NetType,MintNFT } from './nftmint'

const moduleAddress = "0x8d766817feaf415972392de156716641f238fc8cdbba1e85d83308f81356495f"
// const moduleAddress = "0x7b516e77daff31895f43847b9733661b270297608b4fc42e5a327ee98e679722"
const mintNFT = new MintNFT(NetType.TEST_NET,moduleAddress)

const model = ref({
    collection_name: "nft_collections",
    token_pre: "token #",
    pre_uri: "https://stacktrace.top/imgs/",
    presale_timestamp: moment("2022-11-11 00:00:00").unix(),
    sale_timestamp: moment("2022-11-11 10:00:00").unix(),
    total_supply: 0,
    mint_random: false,
    minting_enabled: true,
    strategys:[],
    Whitelist: "0x0a6f65c5389cb25206b0778b0411728663f1533da8a51f36d5b14db16b18dbc4,0x7b516e77daff31895f43847b9733661b270297608b4fc42e5a327ee98e679722",
})

const userConfig = ref({
    collection_name: "nft_collections",
    token_pre: "token #",
    pre_uri: "https://stacktrace.top/imgs/",
    total_supply: 0,
    used: 0,
    price: 0.0099,
    isInit: false,
})

const account = ref({})
const loading = ref(false)


const setModule = async () => {
    loading.value = true
    try{
        await mintNFT.configModule(model.value)
        return true
    }catch(e){
        console.log(e)
    }
    finally{
        loading.value = false
    }
    return false
};


const getModuleConfig = async ()=>{
    model.value = await mintNFT.getModuleConfig()
    console.log(model.value)
}

const setUserConfig = async () => {
    loading.value = true
    try{
        await mintNFT.setUserConfig(userConfig.value)
        return true
    }catch(e){
        console.log(e)
    }
    finally{
        loading.value = false
    }
    return false
};


const getUserConfig = async ()=>{
    try{
        let config = await mintNFT.getUserConfig()
        userConfig.value.isInit = false
        if(config){
            userConfig.value = config
            userConfig.value.isInit = true
        }
    }catch(e){
        userConfig.value.isInit = false
    }
    console.log(userConfig.value)
}
  
const mint_nft = async () => {
    loading.value = true
    try{
        await mintNFT.mint()
        await getModuleConfig()
    }catch(e){

    }
    finally{
        loading.value = false
    }
    
};

const mint_users = async (address) => {
    loading.value = true
    try{
        const mn = new MintNFT(NetType.TEST_NET,address);
        await mn.mint()
    }catch(e){
        console.error(e)
    }
    finally{
        loading.value = false
    }
}

const publishPackage = async() => {
    if(!userConfig.value.isInit) {
        await mintNFT.publishPackage(userConfig.value);
    }else{
        await mintNFT.setUserConfig(userConfig.value);
    }
    await getUserConfig();
}

const getAccountInfo = async () =>{
    account.value = await mintNFT.getAccountInfo()
    console.log(account.value)
}

export { publishPackage, setModule, mint_nft, getModuleConfig, getAccountInfo,setUserConfig,getUserConfig,mint_users, model, account, loading, userConfig }