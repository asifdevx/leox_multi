export const shortenAddress =(address:string)=>{
    return `${address.slice(0,4)}...${address.slice(address.length-4,address.length )}`
}