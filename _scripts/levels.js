var level1JSON;

function constructJSON(){
    level1JSON = {
        "walls": [
            { "type": "static" , "x":0 , "y": 0 , "height": 50 , "width": 0.5 },
            { "color": "red" , "type": "static" , "x": 200 , "y": -100 , "height": 0.5 , "width": 400 },
            { "color": "black" , "type": "static" , "x": 205 , "y": 0 , "height": 50 ,  "width": 10 }
        ],
        "floor": [
            { image:gameFloorTexture1 , "imgWidth":140 , "imgHeight":3.33, "imgPosX":-70 , "imgPosY": -2.5 , "type":"static" , "x":207, "y":23 , "width":138 , "height":2 },
            { image:gameFloorTexture1 , "imgWidth":140 , "imgHeight":3.33, "imgPosX":-70 , "imgPosY": -2.5 , "type":"static" , "x":69, "y":23 , "width":138 , "height":2 },
            { image:gameRock0 , "imgWidth":7.33 , "imgHeight":3.2, "imgPosX":-3.5 , "imgPosY": -1.1 , "type":"static" , "x":64, "y":15 , "width":3.5 , "height":1 },
            { image:gameRock0 , "imgWidth":7.33 , "imgHeight":3.2, "imgPosX":-3.5 , "imgPosY": -1.1 , "type":"static" , "x":58, "y":10 , "width":3.5 , "height":1 },
            { image:gameRock0 , "imgWidth":7.33 , "imgHeight":3.2, "imgPosX":-3.5 , "imgPosY": -1.1 , "type":"static" , "x":98, "y":10 , "width":3.5 , "height":1 },
            { image:gameRock0 , "imgWidth":7.33 , "imgHeight":3.2, "imgPosX":-3.5 , "imgPosY": -1.1 , "type":"static" , "x":108, "y":8 , "width":3.5 , "height":1 },
            { image:gamePlatform1 , "imgWidth":27 , "imgHeight":9, "imgPosX":-13 , "imgPosY": -2 , "type":"static" , "x":78, "y": 5.5 , "width":25 , "height":0.7 },
            { image:gameHill1 , "imgWidth":23 , "imgHeight":6, "imgPosX":-11 , "imgPosY": -3 , "type":"static" , "x":80, "y": 21 , "width":20 , "height":4 },
            { image:gameRockTexture , "imgWidth":40 , "imgHeight":30 , "imgPosX":-13 , "imgPosY":-28 , "type":"static" , "x":173 , "y":20 , "width": 21.3, "height":8.13 },
            { "type":"static" , "x":177 , "y":13 , "width": 7, "height":5.27 },
            { "type":"static" , "x":184 , "y":17 , "width": 9.5, "height":5.27 },
            { "type":"static" , "x":193 , "y":11.5 , "width": 6.16, "height":5.27 },
            { "type":"static" , "x":196 , "y":7 , "width": 6.16, "height":2 },
            { image:gamePalmtree, "imgWidth": 33.33, "imgHeight":34.6, "imgPosX": -16, "imgPosY":-10, "type":"static", "x":1, "y":2, "width":3, "height":40},
            { image:gameRock4, "imgWidth":7.23, "imgHeight":5.87, "imgPosX":-3.5, "imgPosY":-2, "type":"static", "width":5, "height":2, "x":39, "y":11 },
            { image:gameRock5, "imgWidth":6.87, "imgHeight":6.27, "imgPosX":-3.8, "imgPosY":-2.2, "type":"static", "width":4.5, "height":2, "x":48.5, "y":8 },
            { image:gameRock1, "imgWidth":14.63, "imgHeight":9.03, "imgPosX":-7.5, "imgPosY":-5.2, "type":"static", "width":12, "height":2, "x":26, "y":6 },
            { "type":"static" , "x":26 , "y":3 , "width": 4.5, "height":2.5 },
            { image:gameRock4, "imgWidth":7.23, "imgHeight":5.87, "imgPosX":-3.5, "imgPosY":-2, "type":"static", "width":5, "height":2, "x":38, "y":-1.5 },
            { image:gameRock3, "imgWidth":14.4, "imgHeight":9.4, "imgPosX":-8, "imgPosY":-5.5, "type":"static", "width":10, "height":1, "x":62, "y":-3 },
            { "type":"static" , "x":62.25 , "y":-5 , "width":2.5, "height":2 },
            { "type":"static" , "x":59.5 , "y":-4.5 , "width":3, "height":3 },
            { "type":"static" , "x":62.5 , "y":-5.5 , "width":2.5, "height":3 },
            { image:gameRock5, "imgWidth":6.87, "imgHeight":6.27, "imgPosX":-3.8, "imgPosY":-2.2, "type":"static", "width":4.5, "height":2, "x":49, "y":-4 }
        ],
        "treasure": [
            { image: gameTreasureChest , type: "static" , imgWidth: 4 , imgHeight: 2.2 ,
                imgPosX: -2 , imgPosY: -1.3 , x: 78 , y:4 , height: 2.2 , width: 4 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , subtype:"chest" }
        ],
        "collectibles": [
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 39 , y: 20 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , subtype:"common" },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 64 , y: 13 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , subtype:"common" },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 80 , y: 17 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , subtype:"common" },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 90 , y: 3.4 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , subtype:"common" },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 98 , y: 8 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , subtype:"common" },
            { image: gameDarknessPickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 120 , y: 8 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , subtype:"common" },
            { image: gameDarknessRarePickup , type: "static" , imgWidth: 2 , imgHeight: 2 ,
                imgPosX: -1 , imgPosY: -1 , x: 62.5 , y: -9.5 , height: 2 , width: 2 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER , subtype:"rare" }
        ]
    }
}

