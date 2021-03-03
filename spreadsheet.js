const { GoogleSpreadsheet } = require('google-spreadsheet');

const NameMC = require('./namemc');
const creds = require('./client_secret.json');
const utils = require('./utils.js');

const fs = require('fs');

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function getLastCounts(ign, type, sheet){
        let max = 5;
        let asdf = 5;
        while(sheet["_cells"][max][1].value != "Total"){
            max++;
        }
        switch (type){
            case "GXP":
                while(sheet["_cells"][asdf][1].value != ign && asdf < max - 1){
                    asdf++;
                }
                console.log(ign, type, sheet["_cells"][asdf][11].value)
                return sheet["_cells"][asdf][11].value;
            case "EMS":
                while(sheet["_cells"][asdf][1].value != ign && asdf < max - 1){
                    asdf++;
                }
                console.log(ign, type, sheet["_cells"][asdf][5].value)
                return sheet["_cells"][asdf][5].value;
            } 
}

function getData(uuid, type, resTextGStats){
    return new Promise(resolve => {
    let i = 0;
    try{
    while(resTextGStats.data[i].uuid != uuid && i < resTextGStats.data.length - 1){
        i++;
    }
}catch(e){
    resolve(null)
    return;
}
    switch(type){
        case "currentGXP":
            resolve(resTextGStats.data[i].currentGXP);
            return;
        case "currentEMS":
            resolve(resTextGStats.data[i].currentEMS);
            return;
        case "slData":
            resolve(resTextGStats.data[i].slData);
            return;
        case "lastJoin":
            resolve(resTextGStats.data[i].lastJoin);
            return;
        case "joinDate":
            resolve(resTextGStats.data[i].dateJoined);
            return;
        case "alreadyAddedGXP":
            resolve(resTextGStats.data[i].alreadyAddedGXP);
            return;
        case "alreadyAddedEMS":
            resolve(resTextGStats.data[i].alreadyAddedEMS);
            return; 
    }
})
}
let resTextUUID = "";
async function getUUID(ign){
    return new Promise(resolve => {
        let xmlUUID = new XMLHttpRequest();
        xmlUUID.open("GET", "https://mc-heads.net/minecraft/profile/" + ign);
        xmlUUID.onreadystatechange = async () => {
            if(xmlUUID.status == 200 && xmlUUID.readyState == 4){
                try{
                    resTextUUID = JSON.parse(xmlUUID.responseText);
                    resolve(resTextUUID.id);
                    return;
                }catch(e){
                    throw e;
                    }
                }else if(xmlUUID.status == 204 && xmlUUID.readyState == 4){
                    const possibleUsers = await NameMC.lookupName(ign);
                    uuid = possibleUsers[0].uuid.replace(/-/g, "");
                    resolve(uuid)
                    return;
            }
        }
        xmlUUID.send();
    })
}
async function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
let data = [];
let uuidList = [];
const accessSpreadsheet = async (type, slData) =>{
    //const doc = new GoogleSpreadsheet(process.env.testingSpreadsheet);
    const doc = new GoogleSpreadsheet(process.env.spreadsheet)
    //await doc.useApiKey(process.env.googleSpreadsheetAPI_KEY);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();   
    
    const sheet = doc.sheetsByIndex[0];
    const slSheet = doc.sheetsByIndex[1];
    //const warCount = doc.sheetsByIndex[2];
    const pCount = doc.sheetsByIndex[3];
    //const mileSheet = doc.sheetsByIndex[3];
    /*
    sheetByIndex[0] -> PUN Member Roles
    sheetByIndex[1] -> Shore Leave
    sheetByIndex[2] -> War Counts
    sheetByIndex[3] -> Pillagers
    sheetByIndex[4] -> Milestones
    */
    let resTextGStats = "";
    let xmlGetStats = new XMLHttpRequest();
    xmlGetStats.open("GET", process.env.guildStatsURL);
    xmlGetStats.setRequestHeader("Content-Type", "application/json");
    xmlGetStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
    xmlGetStats.setRequestHeader("versioning", false)
    xmlGetStats.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            try{
                resTextGStats = JSON.parse(this.responseText);
                fs.writeFile('./guildstatscache.json', JSON.stringify(resTextGStats), () => {
                    console.log('Success!')
                    });
            }catch(e){
                throw e;
                }      
            }
        }
    xmlGetStats.send();
    
     switch(type){
        case "updateSL":
            await sheet.loadCells('A2:M200').then(async () => {
                let w = 3;
                while(sheet["_cells"][w][2].value != null){
                    w++;
                }
                utils.getData().then(async response => {
                    guildStats = response.data
                    for(i=3;i<w;i++){
                        let member = guildStats.find(user => user.ign == sheet["_cells"][i][2].value.replace(/(\\n) /g, ""));
                        if(member == undefined){
                            uuid = await getUUID(sheet["_cells"][i][2].value.replace(/(\\n) /g, ""));
                            member = guildStats.find(user => user.uuid == uuid);
                            console.log(member)
                            if(member != undefined){
                                member.sl = sheet["_cells"][i][5].value;
                            }
                           
                        }else{
                            member.sl = sheet["_cells"][i][5].value;
                        }
                    }
                    let stats = {
                        "data": guildStats,
                        "timestamp": Date.now()
                    };
                    fs.writeFile("data/guildStats.json", JSON.stringify(stats), (err) => {
                        if (err) throw err;
                        console.log("Saved!");
                        console.log(stats.data.length);
                    });
            })
            }); 
            break;
        case "update":
            await pCount.loadCells('A5:N200').then(console.log("pCount loaded."))
            await sheet.loadCells('A2:M200').then(async () => {
                let w = 3;
                while(sheet["_cells"][w][2].value != null){
                    w++;
                }
                for(i=3;i < w; i++){
                    gUUID = await getUUID(sheet["_cells"][i][2].value.replace("\n", ""));
                    gMember = new Object();
                    gMember.dateJoined = await getData(gUUID, "joinDate", resTextGStats) == null || (await getData(gUUID, "joinDate", resTextGStats)).replace(" ", "") == "(not in the guild yet)"?  sheet["_cells"][i][1].value == null ? null : sheet["_cells"][i][1].value.replace(/[a-z]+/, "") : await getData(gUUID, "joinDate", resTextGStats);
                    gMember.ign = sheet["_cells"][i][2].value.replace("\n", "").replace(" ", "");
                    gMember.uuid = await getUUID(gMember.ign);
                    gMember.region = sheet["_cells"][i][3].value;
                    gMember.sl = sheet["_cells"][i][5].value;
                    gMember.slData = await getData(gMember.uuid, "slData", resTextGStats);
                    gMember.ahh = sheet["_cells"][i][7].value;
                    gMember.potsct = sheet["_cells"][i][8].value;
                    gMember.pillager = sheet["_cells"][i][9].value;
                    gMember.lastCountsGXP = sheet["_cells"][i][9].value == true ? getLastCounts(gMember.ign, "GXP", pCount) == null ? console.log(gMember.ign) : getLastCounts(gMember.ign, "GXP", pCount) : undefined;
                    gMember.lastCountsEMS = sheet["_cells"][i][9].value == true ? getLastCounts(gMember.ign, "EMS", pCount) == null ? console.log(gMember.ign) : getLastCounts(gMember.ign, "EMS", pCount) : undefined;
                    gMember.currentGXP = await getData(gMember.uuid, "currentGXP", resTextGStats);
                    gMember.currentEMS = await getData(gMember.uuid, "currentEMS", resTextGStats);
                    gMember.shoreTrader = sheet["_cells"][i][11].value;
                    gMember.outfitter = sheet["_cells"][i][12].value;
                    gMember.inGuild = true;
                    gMember.inGuildSpreadsheet = true;
                    gMember.lastJoin = await getData(gMember.uuid, "lastJoin", resTextGStats);
                    gMember.alreadyAddedGXP = await getData(gMember.uuid, "alreadyAddedGXP", resTextGStats) == null ? 0 : await getData(gMember.uuid, "alreadyAddedGXP", resTextGStats);
                    gMember.alreadyAddedEMS = await getData(gMember.uuid, "alreadyAddedEMS", resTextGStats) == null ? 0 : await getData(gMember.uuid, "alreadyAddedEMS", resTextGStats);
                    uuidList.push(gMember.uuid);
                    data.push(gMember);
                    }     
            });
            resTextGStats.data.forEach(obj => {
                if(uuidList.indexOf(obj.uuid) == -1){
                    obj.inGuildSpreadsheet = false;
                    data.push(obj)
                }
            })
            let outputJSON = {
                "data": data,
                "timestamp": Date.now()
            }
            console.log(outputJSON)
            let xmlStats = new XMLHttpRequest();
            xmlStats.open("PUT", process.env.guildStatsURL);
            xmlStats.setRequestHeader("Content-Type", "application/json");
            xmlStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
            xmlStats.setRequestHeader("versioning", false)
            xmlStats.send(JSON.stringify(outputJSON))
            break;
        case "counts":
            let date = new Date();
            let dateString = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear().toString().replace(date.getUTCFullYear().toString().substr(0, 2), "")}`;
            fs.readFile('./guildstatscache.json', async (err, data) => {
                if(err) return;
                try {
                    resTextGStats = JSON.parse(data);
                    await pCount.loadCells('A4:N200').then(async () => {
                
                        let w = 6;
                        while(pCount["_cells"][w][1].value != null){
                            w++;
                        }
                        pCount["_cells"][4][1].value = dateString;
                        pCount.saveUpdatedCells();
                        const rows = await pCount.getRows();
                        for(i=5;i<=w;i++){
                            for(elem in resTextGStats.data){
                                console.log(resTextGStats.data[elem].ign, rows[i]["IGN"])
                                if(resTextGStats.data[elem].ign == rows[i]["IGN"]){
                                    let oldEms = rows[i]["EMSThis Week"]
                                    let oldGxp = rows[i]["GXPThis Week"]
                                    rows[i]["EMSLast Week"] = oldEms;
                                    rows[i]["GXPLast Week"] = oldGxp;
                                    rows[i]["EMSThis Week"] = resTextGStats.data[elem].currentEMS;
                                    rows[i]["GXPThis Week"] = resTextGStats.data[elem].currentGXP;
                                    rows[i]["EMSWeekly Total"]  = `=F${i+2}-D${i+2}`
                                    rows[i]["GXPWeekly Total"]  = `=L${i+2}-J${i+2}`
                                    resTextGStats.data[elem].lastCountsEMS = resTextGStats.data[elem].currentEMS;
                                    resTextGStats.data[elem].lastCountsGXP = resTextGStats.data[elem].currentGXP;
                                    await rows[i].save();
                                    await sleep(500);
                                }
                            }                            
                        }
                        let outputJSON = {
                            "data": resTextGStats.data,
                            "timestamp": Date.now()
                        }
                        let xmlStats = new XMLHttpRequest();
                        xmlStats.open("PUT", process.env.guildStatsURL);
                        xmlStats.setRequestHeader("Content-Type", "application/json");
                        xmlStats.setRequestHeader("secret-key", "$2b$10$" + process.env.AUTH_KEY);
                        xmlStats.setRequestHeader("versioning", false)
                        xmlStats.send(JSON.stringify(outputJSON)) 
                    })
                } catch (e) {
                    throw e;
                }
            })
            break;
        case "sl":
            const slRows = await slSheet.getRows();
            break;
        } 
    } 
exports.accessSpreadsheet = accessSpreadsheet;