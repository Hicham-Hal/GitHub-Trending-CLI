#!/usr/bin/env node

import {argv, exit} from 'node:process'

const handleError = (message) => {
    console.error(`Error: ${message}`)
    exit(1)
}

const dayMap = {
    day: 1,
    week: 7,
    month: 30,
    year: 365
}

const getFlagValue = (flagName) => {
    const isExist = argv.find(item => item === flagName)
    if(!isExist){
        return
    }
    let flagValue = argv[argv.indexOf(flagName)+1]
    if(flagValue === undefined || flagValue.startsWith('--')){
        handleError('Flags must be followed by a value')
    }
    if(flagName === '--duration' && flagValue && !dayMap[flagValue]){
        handleError(`--duration must be: day, week, month, year`)
    }
    if(flagName === '--limit' && flagValue && !Number.isInteger(Number(flagValue)) || flagValue <= 0){
        handleError(`--limit must be a valid number and greater than 0`)
    }
    return flagValue
}



const date = new Date()
date.setDate(date.getDate() - (getFlagValue('--duration') ? dayMap[getFlagValue('--duration')] : dayMap['week']))
const dateStr = date.toISOString().split('T')[0]
const limit = getFlagValue('--limit') ? getFlagValue('--limit') : 10

const API = `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=${limit}`

async function main(){
    try{
        const response = await fetch(API)
        if(!response.ok){
            throw new Error(`Github API erro: ${response.status} ${response.statusText}`)
        }
        const dataRes = await response.json()
        const upData = dataRes.items.map(item => ({
            name: item.full_name,
            description: item.description || 'No description',
            stars: item.stargazers_count,
            language: item.language || 'Unknown'
        }));

        upData.map((item) => {
            console.log(`Name: ${item.name}`)
            console.log(`Description: ${item.description || 'No description'}`)
            console.log(`Stars: ${item.stars}`)
            console.log(`Language: ${item.language || 'Unknown'}`)
            console.log(`*----------------*\n`)
        })

        return upData

    }catch(err){
        console.log('Failed to fetch trending repos: ', err.message)
        return [];
    }
}

main()
