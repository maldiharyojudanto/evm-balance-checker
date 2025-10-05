import { Web3 } from "web3";
import fs from "fs";
import chalk from "chalk";

console.log("🔷 EVM Native Coin Balance Checker")

const web3 = new Web3("https://base.llamarpc.com") // your RPC here

try {
    const data = fs.readFileSync('address.txt', 'utf-8');
    const addressData = data.split('\n')

    for (const address of addressData) {
        const getbalancewei = web3.utils.fromWei(await web3.eth.getBalance(address.trim()), 'ether') // saldo eth saya
        // console.log(`EVM address: ${address}\nBalance: ${getbalancewei}`)
        console.log(`\n🔑 EVM address: ${chalk.green(address)}\n🏦 Saldo: ${chalk.yellow(`${Number(getbalancewei)}`)}`)

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