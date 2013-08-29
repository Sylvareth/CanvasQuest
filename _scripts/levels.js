var level1JSON;

function constructJSON(){
    level1JSON = {
        "walls": [
            { "color": "black" , "type": "static" , "x":0 , "y": 0 , "height": 50 , "width": 0.5 },
            { "color": "red" , "type": "static" , "x": 200 , "y": -100 , "height": 0.5 , "width": 400 },
            { "color": "black" , "type": "static" , "x": 200 , "y": 0 , "height": 50 ,  "width": 0.5 }
        ],
        "floor": [
            { image:gameFloorTexture1 , "imgWidth":140 , "imgHeight":3.33, "imgPosX":-70 , "imgPosY": -2.5 , "type":"static" , "x":207, "y":23 , "width":138 , "height":2 },
            { image:gameFloorTexture1 , "imgWidth":140 , "imgHeight":3.33, "imgPosX":-70 , "imgPosY": -2.5 , "type":"static" , "x":69, "y":23 , "width":138 , "height":2 },
            { image:gameStepStones1 , "imgWidth":4 , "imgHeight":1.8, "imgPosX":-2 , "imgPosY": -1.1 , "type":"static" , "x":64, "y":15 , "width":3 , "height":1 },
            { image:gameStepStones1 , "imgWidth":4 , "imgHeight":1.8, "imgPosX":-2 , "imgPosY": -1.1 , "type":"static" , "x":58, "y":10 , "width":3 , "height":1 },
            { image:gameStepStones1 , "imgWidth":4 , "imgHeight":1.8, "imgPosX":-2 , "imgPosY": -1.1 , "type":"static" , "x":98, "y":10 , "width":3 , "height":1 },
            { image:gameStepStones1 , "imgWidth":4 , "imgHeight":1.8, "imgPosX":-2 , "imgPosY": -1.1 , "type":"static" , "x":108, "y":8 , "width":3 , "height":1 },
            { image:gamePlatform1 , "imgWidth":27 , "imgHeight":9, "imgPosX":-13 , "imgPosY": -2 , "type":"static" , "x":78, "y": 5.5 , "width":25 , "height":0.7 },
            { image:gameHill1 , "imgWidth":23 , "imgHeight":6, "imgPosX":-11 , "imgPosY": -3 , "type":"static" , "x":80, "y": 21 , "width":20 , "height":4 },
            { image:gameRockTexture , "imgWidth":40 , "imgHeight":30 , "imgPosX":-13 , "imgPosY":-28 , "type":"static" , "x":173 , "y":20 , "width": 21.3, "height":8.13 },
            { "type":"static" , "x":177 , "y":13 , "width": 7, "height":5.27 },
            { "type":"static" , "x":184 , "y":17 , "width": 9.5, "height":5.27 },
            { "type":"static" , "x":193 , "y":11.5 , "width": 6.16, "height":5.27 },
            { "type":"static" , "x":196 , "y":7 , "width": 6.16, "height":2 }
        ],
        "treasure": [
            { image: gameTreasureChest , type: "static" , imgWidth: 4 , imgHeight: 2.2 ,
                imgPosX: -2 , imgPosY: -1.3 , x: 78 , y:4 , height: 2.2 , width: 4 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , type:"chest" }
        ],
        "collectibles": [
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 39 , y: 20 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , display:true },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 64 , y: 13 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , display: true },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 80 , y: 17 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , display: true },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 90 , y: 3.4 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , display: true },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 98 , y: 8 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , display: true },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 120 , y: 8 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , display: true }
        ]
    }
}

