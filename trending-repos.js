import {argv} from 'node:process'

const getFlagValue = (flagName) => {
    let flagValue = argv[argv.indexOf(flagName)+1]
    if(flagValue === undefined || flagValue.startsWith('--')){
        flagValue = null
    }
    return flagValue
}

const dayMap = {
    day: 1,
    week: 7,
    month: 30,
    year: 365
}


const date = new Date()
date.setDate(date.getDate() - (dayMap[getFlagValue('--duration')] ? dayMap[getFlagValue('--duration')] : dayMap['week']))
const dateStr = date.toISOString().split('T')[0]

const API = `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=${getFlagValue('--limit') || 10}`

async function main(){
    try{
        const response = await fetch(API)
        if(!response.ok){
            throw new Error(`Github API erro: ${response.status} ${response.statusText}`)
        }
        const dataRes = await response.json()
        const upData = dataRes.items.map(item => ({
            name: item.full_name,
            description: item.description,
            stars: item.stargazers_count,
            language: item.language || 'Unknown'
        }));
        return upData

    }catch(err){
        console.log('Failed to fetch trending repos: ', err.message)
        return [];
    }
}

main().then(items => {
    console.log(items)
})
