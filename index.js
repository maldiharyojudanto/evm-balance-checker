import { Web3 } from "web3";
import fs from "fs";
import chalk from "chalk";

async function main() {
    console.log("🔷 EVM Token Balance Checker")

    // connect RPC
    const web3 = new Web3("https://base.llamarpc.com") // RPC here
    const sc_token = "xxxxxx" // Your token smart contract
    
    const TOKEN_ABI = [
        {
            "constant":true,
            "inputs":[
                {
                    "internalType":"address",
                    "name":"account",
                    "type":"address"
                }
            ],
            "name":"balanceOf",
            "outputs":[
                {
                    "internalType":"uint256",
                    "name":"",
                    "type":"uint256"
                }
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "constant":true,
            "inputs":[],
            "name":"decimals",
            "outputs":[
                {
                    "name":"",
                    "type":"uint256"
                }
            ],
            "payable":false,
            "stateMutability":"view",
            "type":"function"
        }
    ]

    // contract inisialisasi
    const contract = new web3.eth.Contract(TOKEN_ABI, sc_token)

    try {
        const data = fs.readFileSync('address.txt', 'utf-8');
        const addressData = data.split('\n')
        
        console.log("\n⤿ SC Token:", sc_token)

        for (const address of addressData) {
            // get balance address coin
            const balanceAcc = await web3.eth.getBalance(address)
            let saldo = web3.utils.fromWei(balanceAcc, 'ether')
            // console.log(saldo)

            console.log(`\n🔑 EVM address: ${chalk.green(address)}\n🏦 Saldo: ${chalk.yellow(`${Number(saldo)}`)}`)
            
            const getbalancewei = await contract.methods.balanceOf(address).call()
            const getdecimal = await contract.methods.decimals().call()
            console.log(`💎 Saldo token: ${chalk.yellow(Number(getbalancewei) * 10 ** -Number(getdecimal))}`)
            await new Promise(resolve => setTimeout(resolve, 2000))
        }

    } catch (e) {
        if (e.code == 'ENOENT') {
            console.log('📝 Fill the address.txt first!');
            fs.writeFileSync('address.txt', "0x123123\n0x123123\netc...")
            process.exit()
        } else {
            throw e
        }
    }
}

main()