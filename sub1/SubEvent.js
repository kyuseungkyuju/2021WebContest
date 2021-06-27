let score = 0;
let canvas
let ctx
let bufCanvas
let drawObject = []
let playerBullet = []
let bossBullet = []
let inputKey = []
let isStart = false;
let interval = []

const playerImg = []
const bossImg = []
const img1 = new Image()
img1.src = "../source/img.jpg"

window.onload = () => {

    for (let i = 1; i <= 24; i += 1) {
        // 플레이어 (레이센 우동게인 이나바) 사진 준비
        let img = new Image()
        img.src = './imgs/player/images/' + '우동게인_' + (i <= 9 ? '0' + i : i) + '.png'
        playerImg[i - 1] = img
    }

    for (let i = 1; i <= 28; i += 1) {
        // 적 보스 (야타데라 나루미)) 사진 준비
        let img = new Image()
        img.src = './imgs/boss/images/' + '1_' + (i <= 9 ? '0' + i : i) + '.png'
        bossImg[i - 1] = img
    }

    console.log("load")

    canvas = document.querySelector('canvas')
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    } else {
        document.querySelector('#interface').innerHTML = `<p>현재 브라우저에서 게임을 실행할 수 없습니다`
        return
    }

    // 버퍼 캔버스
    bufCanvas = document.createElement("canvas");
    bufCtx = bufCanvas.getContext("2d");

    bufCanvas.width = canvas.width;
    bufCanvas.height = canvas.height;

    gameSet()

    window.addEventListener("keydown", (e) => inputKey.push(e.code == 'ArrowUp' || e.code == 'ArrowDown' || e.code == 'ArrowRight' || e.code == 'ArrowLeft' || e.code == 'KeyZ' || e.code == 'ShiftLeft' ? e.code : ''));
    window.addEventListener("keyup", (e) => {
        inputKey = inputKey.filter(x => {
            return x != e.code && x != '';
        })
        if (e.code == 'KeyZ') {
            if (!isStart) {
                isStart = true
                gameStart()
            }
        }
    });
}

function gameSet() {
    drawObject = [
        {
            'name': 'player',
            'hp': 99999999999,
            'score': 0,
            'speed': 5,
            'x': 220,
            'y': 650,
            'sizeX': 40,
            'sizeY': 60,
            'image': playerImg[0]
        },
        {
            'name': 'boss',
            'hp': 1200,
            'score': 0,
            'speed': 3,
            'x': 225,
            'y': 50,
            'sizeX': 50,
            'sizeY': 80,
            'image': bossImg[0]
        },
    ]
}

function gameStart() {
    isStart = true;
    interval[0] = setInterval(drawFrame, 10)
    interval[1] = setInterval(playerMove, 10)
    interval[2] = setInterval(cleaning, 2000)
    interval[3] = setInterval(bulletControl, 10);
    interval[4] = setInterval(playerBulletShooting, 80)
    interval[5] = setInterval(isContant, 10)
    interval[6] = setInterval(bossControl, 3000)

    bulletSet1()
    playerImageChange(0)
    bossImageChange(0, false)
}

function gameOver() {
    interval.forEach(x => {
        clearInterval(x)
    })
}

function cleaning() {
    for (let i = 0; i < playerBullet.length; i += 1) {
        if (playerBullet[i].isContant) {
            // 적에게 닿은 탄환 삭제
            playerBullet.splice(i, 1)
        } else if (playerBullet[i].x > canvas.width + 20 || playerBullet[i].y > canvas.height + 20 || playerBullet[i].x < -20 || playerBullet[i].y < -20) {
            //화면 밖으로 나간 오브젝트 삭제
            playerBullet.splice(i, 1)
        }
    }
    for (let i = 0; i < bossBullet.length; i += 1) {
        if (bossBullet[i].x > canvas.width + 20 || bossBullet[i].y > canvas.height + 20 || bossBullet[i].x < -20 || bossBullet[i].y < -20) {
            //화면 밖으로 나간 오브젝트 삭제
            bossBullet.splice(i, 1)
        }
        else if (bossBullet[i].isContant) {
            // 플레이어에게 닿은 탄환 삭제
            bossBullet.splice(i, 1)
        }
    }
    for (let i = 0; i < drawObject.length; i += 1) {
        // 화면 밖으로 나간 오브젝트 삭제
        if (drawObject[i].x > canvas.width + 150 || drawObject[i].y > canvas.height + 150 || drawObject[i].x < -150 || drawObject[i].y < -150) {
            drawObject.splice(i, 1)
        }
    }
}

function drawFrame() {
    // 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawObject.forEach(x => {
        bufCtx.drawImage(x.image, x.x, x.y, x.sizeX, x.sizeY);
    })
    playerBullet.forEach(x => {
        bufCtx.drawImage(x.image, x.x, x.y, x.sizeX, x.sizeY);
    })
    bossBullet.forEach(x => {
        bufCtx.drawImage(x.image, x.x, x.y, x.sizeX, x.sizeY);
    })

    // 화면에 출력
    ctx.drawImage(bufCanvas, 0, 0);
    bufCtx.clearRect(0, 0, bufCanvas.width, bufCanvas.height);
}

function playerImageChange(n) {
    if (inputKey.find(x => x == 'ArrowRight') == 'ArrowRight') {
        setTimeout(playerRightImageChange, 10, 17)
    } else if (inputKey.find(x => x == 'ArrowLeft') == 'ArrowLeft') {
        setTimeout(playerLeftImageChange, 10, 9)
    } else {
        drawObject.forEach(x => {
            if (x.name == 'player') {
                x.image = playerImg[n]
            }
        })
        setTimeout(playerImageChange, 70, n > 8 ? 0 : n + 1)
    }
}

function playerLeftImageChange(n) {
    if (inputKey.find(x => x == 'ArrowLeft') == 'ArrowLeft') {
        drawObject.forEach(x => {
            if (x.name == 'player') {
                x.image = playerImg[n]
            }
        })
        setTimeout(playerLeftImageChange, 70, n > 14 ? 12 : n + 1)
    } else {
        playerImageChange(1)
    }
}

function playerRightImageChange(n) {
    if (inputKey.find(x => x == 'ArrowRight') == 'ArrowRight') {
        drawObject.forEach(x => {
            if (x.name == 'player') {
                x.image = playerImg[n]
            }
        })
        setTimeout(playerRightImageChange, 70, n > 22 ? 19 : n + 1)
    } else {
        playerImageChange(1)
    }
}

function playerMove() {
    let x = 0;
    let y = 0;
    let point = -1

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'player') {
            point = i
            break
        }
    }

    let speed = drawObject[point].speed
    // 캔버스는 아래로 갈 수록 y값이 증가
    if (inputKey.find(x => x == 'ArrowUp') == 'ArrowUp') {
        y = -1 * speed
    }
    else if (inputKey.find(x => x == 'ArrowDown') == 'ArrowDown') {
        y = speed
    }

    if (inputKey.find(x => x == 'ArrowRight') == 'ArrowRight') {
        x = speed
    }
    else if (inputKey.find(x => x == 'ArrowLeft') == 'ArrowLeft') {
        x = -1 * speed
    }

    if (x != 0 && y != 0) {
        y /= 1.7
        x /= 1.7
    }

    if (inputKey.find(x => x == 'ShiftLeft') == 'ShiftLeft') {
        x /= 2
        y /= 2
    }

    if (0 < drawObject[point].x + x && drawObject[point].x + x < canvas.width - 30) {
        drawObject[point].x += x
    }

    if (0 < drawObject[point].y + y && drawObject[point].y + y < canvas.height - 30) {
        drawObject[point].y += y
    }
}

function playerBulletShooting() {
    if (inputKey.find(x => x == 'KeyZ') != 'KeyZ') {
        return
    }

    let point = -1;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'player') {
            point = i
            break
        }
    }

    playerBullet.push({
        'name': 'playerBullet',
        'speed': 15,
        'x': drawObject[point].x + drawObject[point].sizeX / 2 - 4,
        'y': drawObject[point].y,
        'sizeX': 8,
        'sizeY': 8,
        'image': img1,
        'isContant': false
    })
}

function bulletControl() {
    playerBullet.forEach(x => {
        // 플레이어 탄환은 앞으로만 이동
        x.y -= x.speed
    })
    bossBullet.forEach(x => {
        // 나아가던 방향으로 계속 나아감
        x.x -= x.speedX
        x.y -= x.speedY

        if (x.name == 'bossBullet2') {
            console.log(x.sizeX)
            if (x.patternCheck) {
                x.sizeX += 1
                x.sizeY -= 1
                if (x.sizeY <= 10) {
                    x.patternCheck = false
                }
            } else {
                x.sizeX -= 1
                x.sizeY += 1
                if (x.sizeX <= 10) {
                    x.patternCheck = true
                }
            }
        }
    })
}

function bulletSet1() {
    // 패턴 1
    let point = 0;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    // 원형으로 발사
    for (let i = Math.random() * 6; i <= 360; i += 6) {
        x = Math.cos(i) * 3.5;
        y = Math.sin(i) * 3.5;

        bossBullet.push({
            'name': 'bossBullet',
            'speedX': x,
            'speedY': y,
            'x': drawObject[point].x + drawObject[point].sizeX / 2 - 4,
            'y': drawObject[point].y + drawObject[point].sizeY / 2,
            'sizeX': 8,
            'sizeY': 8,
            'image': img1,
            'isContant': false
        })
    }

    if (drawObject[point].hp > 1050) {
        setTimeout(bulletSet1, 600)
    } else {
        setTimeout(bulletSet2, 600)
    }
}
function bulletSet2() {
    // 패턴 2
    let point = 0;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    // 아래로 발사
    bossBullet.push({
        'name': 'bossBullet',
        'speedX': 0,
        'speedY': -2,
        'x': Math.random() * 510,
        'y': -10,
        'sizeX': 8,
        'sizeY': 8,
        'image': img1,
        'isContant': false
    })

    if (drawObject[point].hp > 900) {
        setTimeout(bulletSet2, 70)
    } else if (drawObject[point].hp > 750) {
        setTimeout(bulletSet2, 100)
        setTimeout(bulletSet3, 100)
    } else {
        setTimeout(bulletSet4, 100)
    }
}

function bulletSet3() {
    // 패턴 3 (패턴 2와 같이 나감)
    let point = 0;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    // 옆으로
    bossBullet.push({
        'name': 'bossBullet',
        'speedX': -1,
        'speedY': 0,
        'x': 0,
        'y': Math.random() * 810,
        'sizeX': 5,
        'sizeY': 5,
        'image': img1,
        'isContant': false
    })
}

function bulletSet4() {
    // 패턴 4
    let point = 0;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    bossBullet.push({
        'name': 'bossBullet2',
        'speedX': Math.random() * 1,
        'speedY': Math.random() * 5 * -1,
        'x': Math.random() * 510,
        'y': -10,
        'sizeX': 200,
        'sizeY': 10,
        'image': img1,
        'patternCheck': false,
        'isContant': false
    })

    if (drawObject[point].hp > 550) {
        setTimeout(bulletSet4, 500)
    } else {
        setTimeout(bulletSet2, 600)
    }
}


function isContant() {
    // 충돌체크
    drawObject.forEach(item => {
        if (item.name == 'boss') {
            playerBullet.forEach(item2 => {
                positionChecking(item, item2)
            })
        }
        if (item.name == 'player') {
            bossBullet.forEach(item2 => {
                positionChecking(item, item2)
            })
        }
    })
}

function positionChecking(item, item2) {
    if (item2.x + item2.sizeX >= item.x + 10 && item2.x <= item.x + item.sizeX - 10 && item2.y + item2.sizeY >= item.y + 20 && item2.y <= item.y + item.sizeY - 20) {
        if (item2.isContant) {
            return
        }
        item2.isContant = true;

        item.hp -= 10
        if (item.name == 'player') {
            document.querySelector('#life').innerHTML = 'life : ' + item.hp
            bossBullet = []
        } else {
            score += 100
            document.querySelector('#score').innerHTML = 'score : ' + score
        }

        if (item.hp <= 0) {
            for (let i = 0; i < drawObject.length; i += 1) {
                if (drawObject[i].name == item.name) {
                    drawObject.splice(i, 1);
                }
                if (item.name == 'player') {
                    gameOver()
                    document.querySelector('#life').innerHTML = 'Game Over'
                }
            }
        }
        cleaning()
    }
}

let bossDirection = 0
let isBossMove = false

function bossControl() {
    let point = -1
    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    isBossMove = true
    bossMove(point, drawObject[point].speed)

    bossDirection = bossDirection > 3 ? 0 : bossDirection + 1
}

function bossMove(point, n) {
    drawObject[point].x += n * (bossDirection == 0 ? 1 : bossDirection == 1 ? -1 : bossDirection == 2 ? -1 : 1)

    if (n > 0) {
        setTimeout(bossMove, 10, point, n - 0.05)
    } else {
        isBossMove = false
    }
}

function bossImageChange(n, replay) {
    if (!isBossMove) {
        drawObject.forEach(x => {
            if (x.name == 'boss') {
                x.image = bossImg[n]
            }
        })
        if(n>5){
            replay = true
        } else if(n < 1){
            replay = false
        }

        setTimeout(bossImageChange, 70, replay ? n - 1 : n + 1, replay)
    } else if (bossDirection == 1 || bossDirection == 2) {
        setTimeout(bossLeftImageChange, 10, 14)
    } else {
        setTimeout(bossRightImageChange, 10, 7)
    }
}

function bossLeftImageChange(n) {
    if (isBossMove) {
        console.log(n+1 +"##")
        drawObject.forEach(x => {
            if (x.name == 'boss') {
                x.image = bossImg[n]
            }
        })
        setTimeout(bossLeftImageChange, 70, n > 17 ? 16 : n + 1)
    } else {
        bossImageChange(1)
    }
}

function bossRightImageChange(n) {
    if (isBossMove) {
        console.log(n+1)
        drawObject.forEach(x => {
            if (x.name == 'boss') {
                x.image = bossImg[n]
            }
        })
        setTimeout(bossRightImageChange, 70, n > 10 ? 9 : n + 1)
    } else {
        bossImageChange(1)
    }
}