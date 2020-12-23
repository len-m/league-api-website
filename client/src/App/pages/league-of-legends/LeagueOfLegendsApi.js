const getArabicNumber = async (romanNumber) => {
    switch (romanNumber) {
        case "IV":
            return "4";
        case "III":
            return "3";
        case "II":
            return "2";
        case "I":
            return "1";
        default:
            return "unknown";
    }
}

export const getRank = async (leagueInfo, rankType) => {
    for (let i = 0; i < leagueInfo.length; i++) {
        if (leagueInfo[i].queueType === rankType) {
            const arabicNumber = await getArabicNumber(leagueInfo[i].rank);
            return `${leagueInfo[i].tier.toLowerCase()}_${arabicNumber}`;
        }
    }
    return "default";
}

const getLane = async (matchJSON) => {
    const lane = matchJSON.lane;
    const role = matchJSON.role;
//    Role: DUO, DUO_CARRY, DUO_SUPPORT, NONE, and SOLO
//    Lane: MID, TOP, BOTTOM, JUNGLE, NONE
    if (lane === "MID" && role === "SOLO") {
        return "mid";
    } else if (lane === "TOP" && role === "SOLO") {
        return "top";
    } else if (lane === "JUNGLE" && role === "NONE") {
        return "jgl";
    } else if (lane === "BOTTOM" && role === "DUO_SUPPORT") {
        return "sup";
    } else if (lane === "BOTTOM" && role === "DUO_CARRY") {
        return "adc";
    } else {
        return "none";
    }
}

export const getOverallLane = async (matchlist) => {
    let laneMap = new Map();
    laneMap.set("mid", 0);
    laneMap.set("top", 0); 
    laneMap.set("jgl", 0);
    laneMap.set("sup", 0); 
    laneMap.set("adc", 0);
    let overallLane = "none";

    let i = 0;
    let data = 0;
    while (data < 11) {
        if (matchlist.matches !== undefined && matchlist.matches[i] !== undefined && i < 30) {
            const currentLane = await getLane(matchlist.matches[i]);
            if (currentLane !== "none") {
                laneMap.set(currentLane, laneMap.get(currentLane) + 1);
                data++;
            }
        }
        i++;
    }
    let overallLaneValue = laneMap.get("mid");
    for (let lane of laneMap.keys()) {
        if (laneMap.get(lane) > overallLaneValue) {
            overallLane = laneMap.get(lane);
        }
    }
    return overallLane;
}