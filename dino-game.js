"use strict";
function padScore(t) {
    var i = Math.max(t.toString().length, 5);
    return ("00000" + t).substr(-i, i)
}
function Runner(t, i) {
    if (Runner.instance_)
        return Runner.instance_;
    (Runner.instance_ = this).outerContainerEl = document.querySelector(t),
    this.containerEl = null,
    this.snackbarEl = null,
    this.touchController = null,
    this.config = i || Runner.config,
    this.dimensions = Runner.defaultDimensions,
    this.canvas = null,
    this.canvasCtx = null,
    this.goldKills = 0,
    this.personalHighscore = 0,
    this.score = 0,
    this.tRex = null,
    this.distanceMeter = null,
    this.distanceRan = 0,
    this.highestScore = 0,
    this.syncHighestScore = !1,
    this.time = 0,
    this.runningTime = 0,
    this.msPerFrame = 1e3 / FPS,
    this.currentSpeed = this.config.SPEED,
    this.obstacles = [],
    this.activated = !1,
    this.playing = !1,
    this.crashed = !1,
    this.paused = !1,
    this.timeMulti = 1,
    this.noClip = !1,
    this.inverted = !1,
    this.invertTimer = 0,
    this.resizeTimerId_ = null,
    this.playCount = 0,
    this.record = [],
    this.audioBuffer = null,
    this.soundFx = {},
    this.audioContext = null,
    this.images = {},
    this.imagesLoaded = 0,
    this.pollingGamepads = !1,
    this.gamepadIndex = void 0,
    this.previousGamepad = null,
    this.isDisabled() ? this.setupDisabledRunner() : (this.loadImages(),
    window.initializeEasterEggHighScore = this.initializeHighScore.bind(this))
}
var DEFAULT_WIDTH = 600
  , FPS = 60
  , IS_HIDPI = 1 < window.devicePixelRatio
  , IS_IOS = /CriOS/.test(window.navigator.userAgent)
  , IS_MOBILE = /Android/.test(window.navigator.userAgent) || IS_IOS
  , ARCADE_MODE_URL = "chrome://dino/";
Runner.config = {
    ACCELERATION: .001,
    BG_CLOUD_SPEED: .2,
    BOTTOM_PAD: 10,
    CANVAS_IN_VIEW_OFFSET: -10,
    CLEAR_TIME: 3e3,
    CLOUD_FREQUENCY: .5,
    GAMEOVER_CLEAR_TIME: 750,
    GAP_COEFFICIENT: .6,
    GRAVITY: .1,
    INITIAL_JUMP_VELOCITY: 12,
    INVERT_FADE_DURATION: 12e3,
    INVERT_DISTANCE: 700,
    MAX_BLINK_COUNT: 3,
    MAX_CLOUDS: 6,
    MAX_OBSTACLE_LENGTH: 3,
    MAX_OBSTACLE_DUPLICATION: 2,
    MAX_SPEED: 13,
    MIN_JUMP_HEIGHT: 35,
    MOBILE_SPEED_COEFFICIENT: 1.2,
    RESOURCE_TEMPLATE_ID: "audio-resources",
    SPEED: 6,
    SPEED_DROP_COEFFICIENT: 3,
    ARCADE_MODE_INITIAL_TOP_POSITION: 35,
    ARCADE_MODE_TOP_POSITION_PERCENT: .1
};
var ObstacleType, additionalHeight = 50;
function getRandomNum(t, i) {
    return Math.floor(Math.random() * (i - t + 1)) + t
}
function vibrate(t) {}
function createCanvas(t, i, e, s) {
    var n = document.createElement("canvas");
    return n.className = s ? Runner.classes.CANVAS + " " + s : Runner.classes.CANVAS,
    n.width = i,
    n.height = e,
    t.appendChild(n),
    n
}
function decodeBase64ToArrayBuffer(t) {
    for (var i = t.length / 4 * 3, e = atob(t), s = new ArrayBuffer(i), n = new Uint8Array(s), o = 0; o < i; o++)
        n[o] = e.charCodeAt(o);
    return n.buffer
}
function getTimeStamp() {
    return IS_IOS ? (new Date).getTime() : performance.now()
}
function GameOverPanel(t, i, e, s) {
    this.canvas = t,
    this.canvasCtx = t.getContext("2d"),
    this.canvasDimensions = s,
    this.textImgPos = i,
    this.restartImgPos = e,
    this.draw()
}
function checkForCollision(t, i, e) {
    if (!t.destroyed) {
        Runner.defaultDimensions.WIDTH,
        t.xPos;
        var s = new CollisionBox(i.xPos + 1,i.yPos + 1,i.config.WIDTH - 2,i.config.HEIGHT - 2)
          , n = createAdjustedCollisionBox(t.collisionBoxes[0], {
            x: t.xPos,
            y: t.yPos
        });
        if (e && drawCollisionBoxes(e, s, n),
        boxCompare(s, n))
            for (var o = i.ducking ? Trex.collisionBoxes.DUCKING : Trex.collisionBoxes.RUNNING, h = 0; h < o.length; h++) {
                var a = createAdjustedCollisionBox(o[h], s)
                  , r = boxCompare(a, n);
                if (e && drawCollisionBoxes(e, a, n),
                r)
                    return [a, n]
            }
    }
}
function createAdjustedCollisionBox(t, i) {
    return new CollisionBox(t.x + i.x,t.y + i.y,t.width,t.height)
}
function drawCollisionBoxes(t, i, e) {
    t.save(),
    t.strokeStyle = "#f00",
    t.strokeRect(i.x, i.y, i.width, i.height),
    t.strokeStyle = "#0f0",
    t.strokeRect(e.x, e.y, e.width, e.height),
    t.restore()
}
function boxCompare(t, i) {
    var e = !1
      , s = (t.x,
    t.y,
    i.x);
    i.y;
    return t.x < s + i.width && t.x + t.width > s && t.y < i.y + i.height && t.height + t.y > i.y && (e = !0),
    e
}
function CollisionBox(t, i, e, s) {
    this.x = t,
    this.y = i,
    this.width = e,
    this.height = s
}
function Obstacle(t, i, e, s, n, o, h) {
    this.canvasCtx = t,
    this.spritePos = e,
    this.typeConfig = i,
    this.gapCoefficient = n,
    this.dimensions = s,
    this.remove = !1,
    this.xPos = s.WIDTH + (h || 0),
    this.yPos = 0,
    this.width = 0,
    this.collisionBoxes = [],
    this.gap = 0,
    this.speedOffset = 0,
    this.currentFrame = 0,
    this.timer = 0,
    this.image = new Image,
    this.destroyed = !1,
    this.state = "normal",
    this.ascend = !1,
    this.init(o)
}
function Trex(t, i) {
    this.canvas = t,
    this.canvasCtx = t.getContext("2d"),
    this.spritePos = i,
    this.xPos = 0,
    this.yPos = 0,
    this.xInitialPos = 0,
    this.groundYPos = 0,
    this.currentFrame = 0,
    this.currentAnimFrames = [],
    this.blinkDelay = 0,
    this.blinkCount = 0,
    this.animStartTime = 0,
    this.timer = 0,
    this.msPerFrame = 1e3 / FPS,
    this.config = Trex.config,
    this.status = Trex.status.WAITING,
    this.jumping = !1,
    this.ducking = !1,
    this.jumpVelocity = 0,
    this.reachedMinHeight = !1,
    this.speedDrop = !1,
    this.jumpCount = 0,
    this.jumpspotX = 0,
    this.hideDino = !1,
    this.hideDeath = !1,
    this.init()
}
function DistanceMeter(t, i, e) {
    this.canvas = t,
    this.canvasCtx = t.getContext("2d"),
    this.image = Runner.imageSprite,
    this.spritePos = i,
    this.x = 0,
    this.y = 5,
    this.currentDistance = 0,
    this.maxScore = 0,
    this.highScore = "0",
    this.container = null,
    this.digits = [],
    this.achievement = !1,
    this.defaultString = "",
    this.flashTimer = 0,
    this.flashIterations = 0,
    this.invertTrigger = !1,
    this.flashingRafId = null,
    this.highScoreBounds = {},
    this.highScoreFlashing = !1,
    this.config = DistanceMeter.config,
    this.maxScoreUnits = this.config.MAX_DISTANCE_UNITS,
    this.init(e)
}
function Cloud(t, i, e) {
    this.canvas = t,
    this.canvasCtx = this.canvas.getContext("2d"),
    this.spritePos = i,
    this.containerWidth = e,
    this.xPos = e,
    this.yPos = 0,
    this.remove = !1,
    this.cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP),
    this.init()
}
function NightMode(t, i, e) {
    this.spritePos = i,
    this.canvas = t,
    this.canvasCtx = t.getContext("2d"),
    this.xPos = e - 50,
    this.yPos = 30 + additionalHeight,
    this.currentPhase = 0,
    this.opacity = 0,
    this.containerWidth = e,
    this.stars = [],
    this.drawStars = !1,
    this.placeStars()
}
function HorizonLine(t, i) {
    this.spritePos = i,
    this.canvas = t,
    this.canvasCtx = t.getContext("2d"),
    this.sourceDimensions = {},
    this.dimensions = HorizonLine.dimensions,
    this.sourceXPos = [this.spritePos.x, this.spritePos.x + this.dimensions.WIDTH],
    this.xPos = [],
    this.yPos = 0,
    this.bumpThreshold = .5,
    this.setSourceDimensions(),
    this.draw()
}
function Horizon(t, i, e, s) {
    this.canvas = t,
    this.canvasCtx = this.canvas.getContext("2d"),
    this.config = Horizon.config,
    this.dimensions = e,
    this.gapCoefficient = s,
    this.obstacles = [],
    this.obstacleHistory = [],
    this.horizonOffsets = [0, 0],
    this.cloudFrequency = this.config.CLOUD_FREQUENCY,
    this.spritePos = i,
    this.nightMode = null,
    this.clouds = [],
    this.cloudSpeed = this.config.BG_CLOUD_SPEED,
    this.horizonLine = null,
    this.init()
}
Runner.defaultDimensions = {
    WIDTH: DEFAULT_WIDTH,
    HEIGHT: 150 + additionalHeight
},
Runner.classes = {
    ARCADE_MODE: "arcade-mode",
    CANVAS: "runner-canvas",
    CONTAINER: "runner-container",
    CRASHED: "crashed",
    ICON: "icon-offline",
    INVERTED: "inverted",
    SNACKBAR: "snackbar",
    SNACKBAR_SHOW: "snackbar-show",
    TOUCH_CONTROLLER: "controller"
},
Runner.spriteDefinition = {
    LDPI: {
        CACTUS_LARGE: {
            x: 332,
            y: 2
        },
        CACTUS_SMALL: {
            x: 228,
            y: 2
        },
        CLOUD: {
            x: 86,
            y: 2
        },
        HORIZON: {
            x: 2,
            y: 54
        },
        MOON: {
            x: 484,
            y: 2
        },
        PTERODACTYL: {
            x: 134,
            y: 2
        },
        RESTART: {
            x: 2,
            y: 2
        },
        TEXT_SPRITE: {
            x: 655,
            y: 2
        },
        TREX: {
            x: 848,
            y: 2
        },
        STAR: {
            x: 645,
            y: 2
        }
    },
    HDPI: {
        CACTUS_LARGE: {
            x: 652,
            y: 2
        },
        CACTUS_SMALL: {
            x: 446,
            y: 2
        },
        CLOUD: {
            x: 166,
            y: 2
        },
        HORIZON: {
            x: 2,
            y: 104
        },
        MOON: {
            x: 954,
            y: 2
        },
        PTERODACTYL: {
            x: 260,
            y: 2
        },
        RESTART: {
            x: 2,
            y: 2
        },
        TEXT_SPRITE: {
            x: 1294,
            y: 2
        },
        TREX: {
            x: 1678,
            y: 2
        },
        STAR: {
            x: 1276,
            y: 2
        }
    }
},
Runner.sounds = {
    BUTTON_PRESS: "offline-sound-press",
    HIT: "offline-sound-hit",
    SCORE: "offline-sound-reached"
},
Runner.keycodes = {
    JUMP: {
        38: 1,
        32: 1
    },
    DUCK: {
        40: 1
    },
    RESTART: {
        13: 1
    }
},
Runner.events = {
    ANIM_END: "webkitAnimationEnd",
    CLICK: "click",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    POINTERDOWN: "pointerdown",
    POINTERUP: "pointerup",
    RESIZE: "resize",
    TOUCHEND: "touchend",
    TOUCHSTART: "touchstart",
    VISIBILITY: "visibilitychange",
    BLUR: "blur",
    FOCUS: "focus",
    LOAD: "load",
    GAMEPADCONNECTED: "gamepadconnected"
},
Runner.prototype = {
    isDisabled: function() {
        return !1
    },
    setupDisabledRunner: function() {
        this.containerEl = document.createElement("div"),
        this.containerEl.className = Runner.classes.SNACKBAR,
        this.containerEl.textContent = loadTimeData.getValue("disabledEasterEgg"),
        this.outerContainerEl.appendChild(this.containerEl),
        document.addEventListener(Runner.events.KEYDOWN, function(t) {
            Runner.keycodes.JUMP[t.keyCode] && (this.containerEl.classList.add(Runner.classes.SNACKBAR_SHOW),
            document.querySelector(".icon").classList.add("icon-disabled"))
        }
        .bind(this))
    },
    updateConfigSetting: function(t, i) {
        if (t in this.config && void 0 !== i)
            switch (this.config[t] = i,
            t) {
            case "GRAVITY":
            case "MIN_JUMP_HEIGHT":
            case "SPEED_DROP_COEFFICIENT":
                this.tRex.config[t] = i;
                break;
            case "INITIAL_JUMP_VELOCITY":
                this.tRex.setJumpVelocity(i);
                break;
            case "SPEED":
                this.setSpeed(i)
            }
    },
    loadImages: function() {
        IS_HIDPI ? (Runner.imageSprite = document.getElementById("offline-resources-2x"),
        this.spriteDef = Runner.spriteDefinition.HDPI) : (Runner.imageSprite = document.getElementById("offline-resources-1x"),
        this.spriteDef = Runner.spriteDefinition.LDPI),
        Runner.imageSprite.complete ? this.init() : Runner.imageSprite.addEventListener(Runner.events.LOAD, this.init.bind(this))
    },
    loadSounds: function() {},
    setSpeed: function(t) {
        var i = t || this.currentSpeed;
        this.dimensions.WIDTH < DEFAULT_WIDTH ? this.currentSpeed = i : t && (this.currentSpeed = t)
    },
    init: function() {
        var i = this;
        this.adjustDimensions(),
        this.setSpeed(),
        this.containerEl = document.createElement("div"),
        this.containerEl.className = Runner.classes.CONTAINER,
        this.canvas = createCanvas(this.containerEl, this.dimensions.WIDTH, this.dimensions.HEIGHT),
        this.canvasCtx = this.canvas.getContext("2d"),
        this.canvasCtx.fillStyle = "#f7f7f7",
        this.canvasCtx.fill(),
        Runner.updateCanvasScaling(this.canvas),
        this.horizon = new Horizon(this.canvas,this.spriteDef,this.dimensions,this.config.GAP_COEFFICIENT),
        this.distanceMeter = new DistanceMeter(this.canvas,this.spriteDef.TEXT_SPRITE,this.dimensions.WIDTH),
        this.tRex = new Trex(this.canvas,this.spriteDef.TREX),
        this.outerContainerEl.appendChild(this.containerEl),
        this.startListening(),
        this.update(),
        window.addEventListener(Runner.events.RESIZE, this.debounceResize.bind(this));
        var t = window.matchMedia("(prefers-color-scheme: dark)");
        this.isDarkMode = t && t.matches,
        t.addListener(function(t) {
            i.isDarkMode = t.matches
        })
    },
    createTouchController: function() {
        this.touchController = document.createElement("div"),
        this.touchController.className = Runner.classes.TOUCH_CONTROLLER,
        this.touchController.addEventListener(Runner.events.TOUCHSTART, this),
        this.touchController.addEventListener(Runner.events.TOUCHEND, this),
        this.outerContainerEl.appendChild(this.touchController)
    },
    debounceResize: function() {
        this.resizeTimerId_ || (this.resizeTimerId_ = setInterval(this.adjustDimensions.bind(this), 250))
    },
    adjustDimensions: function() {
        clearInterval(this.resizeTimerId_),
        this.resizeTimerId_ = null;
        var t = window.getComputedStyle(this.outerContainerEl)
          , i = Number(t.paddingLeft.substr(0, t.paddingLeft.length - 2));
        this.dimensions.WIDTH = this.outerContainerEl.offsetWidth - 2 * i,
        this.isArcadeMode() && (this.dimensions.WIDTH = Math.min(DEFAULT_WIDTH, this.dimensions.WIDTH),
        this.activated && this.setArcadeModeContainerScale()),
        this.canvas && (this.canvas.width = this.dimensions.WIDTH,
        this.canvas.height = this.dimensions.HEIGHT,
        Runner.updateCanvasScaling(this.canvas),
        this.distanceMeter.calcXPos(this.dimensions.WIDTH),
        this.clearCanvas(),
        this.horizon.update(0, 0, !0),
        this.tRex.update(0),
        this.playing || this.crashed || this.paused ? (this.containerEl.style.width = this.dimensions.WIDTH + "px",
        this.containerEl.style.height = this.dimensions.HEIGHT + "px",
        this.distanceMeter.update(0, Math.ceil(this.distanceRan)),
        this.stop()) : this.tRex.draw(0, 0),
        this.crashed && this.gameOverPanel && (this.gameOverPanel.updateDimensions(this.dimensions.WIDTH),
        this.gameOverPanel.draw()))
    },
    playIntro: function() {
        var t;
        this.activated || this.crashed ? this.crashed && this.restart() : (this.playingIntro = !0,
        this.tRex.playingIntro = !0,
        t = "@-webkit-keyframes intro { from { width:" + Trex.config.WIDTH + "px }to { width: " + this.dimensions.WIDTH + "px }}",
        document.styleSheets[0].insertRule(t, 0),
        this.containerEl.addEventListener(Runner.events.ANIM_END, this.startGame.bind(this)),
        this.containerEl.style.webkitAnimation = "intro .4s ease-out 1 both",
        this.containerEl.style.width = this.dimensions.WIDTH + "px",
        this.setPlayStatus(!0),
        this.activated = !0)
    },
    startGame: function() {
        weaponManager.reset(),
        this.isArcadeMode() && this.setArcadeMode(),
        this.runningTime = 0,
        this.playingIntro = !1,
        this.tRex.playingIntro = !1,
        this.containerEl.style.webkitAnimation = "",
        this.playCount++;
        var t = document.getElementById("title-box");
        t && (t.style.opacity = 0),
        document.addEventListener(Runner.events.VISIBILITY, this.onVisibilityChange.bind(this)),
        window.addEventListener(Runner.events.BLUR, this.onVisibilityChange.bind(this)),
        window.addEventListener(Runner.events.FOCUS, this.onVisibilityChange.bind(this)),
        this.gameStartCallback && this.gameStartCallback()
    },
    clearCanvas: function() {
        this.canvasCtx.clearRect(0, 0, this.dimensions.WIDTH, this.dimensions.HEIGHT)
    },
    isCanvasInView: function() {
        return this.containerEl.getBoundingClientRect().top > Runner.config.CANVAS_IN_VIEW_OFFSET
    },
    update: function() {
        this.updatePending = !1;
        var t, i, e = getTimeStamp(), s = e - (this.time || e);
        s *= this.timeMulti,
        this.time = e,
        this.playing && (this.clearCanvas(),
        this.tRex.jumping && this.tRex.updateJump(s),
        this.runningTime += s,
        t = this.runningTime > this.config.CLEAR_TIME,
        1 !== this.tRex.jumpCount || this.playingIntro || this.playIntro(),
        this.playingIntro ? this.horizon.update(0, this.currentSpeed, t) : (s = this.activated ? s : 0,
        this.horizon.update(s, this.currentSpeed, t, !1)),
        this.die && (this.gameOver(),
        this.die = !1),
        !this.noClip && t && checkForCollision(this.horizon.obstacles[0], this.tRex, window.debug ? this.canvasCtx : null) ? this.gameOver() : (this.distanceRan += this.currentSpeed * s / this.msPerFrame,
        this.currentSpeed < this.config.MAX_SPEED && (this.currentSpeed += this.config.ACCELERATION)),
        this.distanceMeter.update(s, Math.ceil(this.distanceRan)) && this.playSound(this.soundFx.SCORE),
        this.invertTimer > this.config.INVERT_FADE_DURATION ? (this.invertTimer = 0,
        this.invertTrigger = !1,
        this.invert(!1)) : this.invertTimer ? this.invertTimer += s : 0 < (i = this.distanceMeter.getActualDistance(Math.ceil(this.distanceRan))) && (this.invertTrigger = !(i % this.config.INVERT_DISTANCE),
        this.invertTrigger && 0 === this.invertTimer && (this.invertTimer += s,
        this.invert(!1)))),
        (this.playing || !this.activated && this.tRex.blinkCount < Runner.config.MAX_BLINK_COUNT) && (this.tRex.update(s),
        weaponManager.update(s),
        this.scheduleNextUpdate())
    },
    handleEvent: function(e) {
        return function(t, i) {
            switch (t) {
            case i.KEYDOWN:
            case i.TOUCHSTART:
            case i.POINTERDOWN:
                this.onKeyDown(e);
                break;
            case i.KEYUP:
            case i.TOUCHEND:
            case i.POINTERUP:
                this.onKeyUp(e);
                break;
            case i.GAMEPADCONNECTED:
                this.onGamepadConnected(e)
            }
        }
        .bind(this)(e.type, Runner.events)
    },
    startListening: function() {
        document.addEventListener(Runner.events.KEYDOWN, this),
        document.addEventListener(Runner.events.KEYUP, this),
        this.containerEl.addEventListener(Runner.events.TOUCHSTART, this),
        document.addEventListener(Runner.events.POINTERDOWN, this),
        document.addEventListener(Runner.events.POINTERUP, this),
        this.isArcadeMode() && window.addEventListener(Runner.events.GAMEPADCONNECTED, this)
    },
    stopListening: function() {
        document.removeEventListener(Runner.events.KEYDOWN, this),
        document.removeEventListener(Runner.events.KEYUP, this),
        this.touchController && (this.touchController.removeEventListener(Runner.events.TOUCHSTART, this),
        this.touchController.removeEventListener(Runner.events.TOUCHEND, this)),
        this.containerEl.removeEventListener(Runner.events.TOUCHSTART, this),
        document.removeEventListener(Runner.events.POINTERDOWN, this),
        document.removeEventListener(Runner.events.POINTERUP, this),
        this.isArcadeMode() && window.removeEventListener(Runner.events.GAMEPADCONNECTED, this)
    },
    onKeyDown: function(t) {
        t.target && "INPUT" == t.target.tagName || 13 == t.keyCode || (192 == t.keyCode && (debug = !debug),
        IS_MOBILE && this.playing && t.preventDefault(),
        this.isCanvasInView() && (this.crashed || this.paused ? IS_IOS && this.crashed && t.type === Runner.events.TOUCHSTART && t.currentTarget === this.containerEl && this.handleGameOverClicks(t) : Runner.keycodes.JUMP[t.keyCode] || t.type === Runner.events.TOUCHSTART ? (t.preventDefault(),
        this.playing || (this.touchController || t.type !== Runner.events.TOUCHSTART || this.createTouchController(),
        this.loadSounds(),
        this.setPlayStatus(!0),
        this.update(),
        window.errorPageController && errorPageController.trackEasterEgg()),
        this.tRex.jumping || this.tRex.ducking || (this.playSound(this.soundFx.BUTTON_PRESS),
        this.tRex.startJump(this.currentSpeed))) : this.playing && Runner.keycodes.DUCK[t.keyCode] && (t.preventDefault(),
        this.tRex.jumping ? this.tRex.setSpeedDrop() : this.tRex.jumping || this.tRex.ducking || this.tRex.setDuck(!0))))
    },
    onKeyUp: function(t) {
        var i, e, s;
        t.target && "INPUT" == t.target.tagName || 13 == t.keyCode || (i = String(t.keyCode),
        e = Runner.keycodes.JUMP[i] || t.type === Runner.events.TOUCHEND || t.type === Runner.events.POINTERUP,
        this.isRunning() && e ? this.tRex.endJump() : Runner.keycodes.DUCK[i] ? (this.tRex.speedDrop = !1,
        this.tRex.setDuck(!1)) : this.crashed ? (s = getTimeStamp() - this.time,
        this.isCanvasInView() && (Runner.keycodes.RESTART[i] || this.isLeftClickOnCanvas(t) || s >= this.config.GAMEOVER_CLEAR_TIME && Runner.keycodes.JUMP[i]) && this.handleGameOverClicks(t)) : this.paused && e && (this.tRex.reset(),
        this.play()))
    },
    onGamepadConnected: function() {
        this.pollingGamepads || this.pollGamepadState()
    },
    pollGamepadState: function() {
        var t = navigator.getGamepads();
        this.pollActiveGamepad(t),
        this.pollingGamepads = !0,
        requestAnimationFrame(this.pollGamepadState.bind(this))
    },
    pollForActiveGamepad: function(t) {
        for (var i = 0; i < t.length; ++i)
            if (t[i] && 0 < t[i].buttons.length && t[i].buttons[0].pressed)
                return this.gamepadIndex = i,
                void this.pollActiveGamepad(t)
    },
    pollActiveGamepad: function(t) {
        if (void 0 !== this.gamepadIndex) {
            var i = t[this.gamepadIndex];
            if (!i)
                return this.gamepadIndex = void 0,
                void this.pollForActiveGamepad(t);
            this.pollGamepadButton(i, 0, 38),
            2 <= i.buttons.length && this.pollGamepadButton(i, 1, 40),
            10 <= i.buttons.length && this.pollGamepadButton(i, 9, 13),
            this.previousGamepad = i
        } else
            this.pollForActiveGamepad(t)
    },
    pollGamepadButton: function(t, i, e) {
        var s, n = t.buttons[i].pressed, o = !1;
        this.previousGamepad && (o = this.previousGamepad.buttons[i].pressed),
        n !== o && (s = new KeyboardEvent(n ? Runner.events.KEYDOWN : Runner.events.KEYUP,{
            keyCode: e
        }),
        document.dispatchEvent(s))
    },
    handleGameOverClicks: function(t) {
        t.preventDefault(),
        this.distanceMeter.hasClickedOnHighScore(t) && this.highestScore ? this.distanceMeter.isHighScoreFlashing() ? (this.saveHighScore(0, !0),
        this.distanceMeter.resetHighScore()) : this.distanceMeter.startHighScoreFlashing() : (this.distanceMeter.cancelHighScoreFlashing(),
        this.restart())
    },
    isLeftClickOnCanvas: function(t) {
        return null != t.button && t.button < 2 && t.type === Runner.events.POINTERUP && t.target === this.canvas
    },
    scheduleNextUpdate: function() {
        this.updatePending || (this.updatePending = !0,
        this.raqId = requestAnimationFrame(this.update.bind(this)))
    },
    isRunning: function() {
        return !!this.raqId
    },
    initializeHighScore: function(t) {
        this.syncHighestScore = !0,
        (t = Math.ceil(t)) < this.highestScore ? window.errorPageController && errorPageController.updateEasterEggHighScore(this.highestScore) : (this.highestScore = t,
        this.distanceMeter.setHighScore(this.highestScore))
    },
    saveHighScore: function(t, i) {
        this.highestScore = Math.ceil(t),
        this.distanceMeter.setHighScore(this.highestScore),
        this.syncHighestScore && window.errorPageController && (i ? errorPageController.resetEasterEggHighScore() : errorPageController.updateEasterEggHighScore(this.highestScore))
    },
    gameOver: function() {
        this.playSound(this.soundFx.HIT),
        vibrate(200),
        this.stop(),
        this.crashed = !0,
        this.distanceMeter.achievement = !1,
        this.tRex.update(100, Trex.status.CRASHED),
        weaponManager.update(100),
        runner.score > runner.personalHighscore && (runner.personalHighscore = runner.score),
        this.gameOverCallback && this.gameOverCallback(),
        runner.addRecord("gameover"),
        this.gameOverPanel ? this.gameOverPanel.draw() : this.canvas && (this.gameOverPanel = new GameOverPanel(this.canvas,this.spriteDef.TEXT_SPRITE,this.spriteDef.RESTART,this.dimensions)),
        this.distanceRan > this.highestScore && this.saveHighScore(this.distanceRan),
        this.time = getTimeStamp()
    },
    stop: function() {
        this.setPlayStatus(!1),
        this.paused = !0,
        cancelAnimationFrame(this.raqId),
        this.raqId = 0
    },
    play: function() {
        this.crashed || (this.setPlayStatus(!0),
        this.paused = !1,
        this.tRex.update(0, Trex.status.RUNNING),
        this.time = getTimeStamp(),
        this.update())
    },
    restart: function() {
        weaponManager.reset(),
        this.raqId || (this.playCount++,
        this.goldKills = 0,
        this.score = 0,
        this.record = [],
        this.runningTime = 0,
        this.setPlayStatus(!0),
        this.paused = !1,
        this.crashed = !1,
        this.distanceRan = 0,
        this.setSpeed(this.config.SPEED),
        this.time = getTimeStamp(),
        this.containerEl.classList.remove(Runner.classes.CRASHED),
        this.clearCanvas(),
        this.distanceMeter.reset(),
        this.horizon.reset(),
        this.tRex.reset(),
        this.playSound(this.soundFx.BUTTON_PRESS),
        this.invert(!0),
        this.bdayFlashTimer = null,
        this.update()),
        this.gameStartCallback && this.gameStartCallback()
    },
    setPlayStatus: function(t) {
        this.playing = t
    },
    isArcadeMode: function() {
        return !1
    },
    setArcadeMode: function() {
        document.body.classList.add(Runner.classes.ARCADE_MODE),
        this.setArcadeModeContainerScale()
    },
    setArcadeModeContainerScale: function() {
        var t = window.innerHeight
          , i = t / this.dimensions.HEIGHT
          , e = window.innerWidth / this.dimensions.WIDTH
          , s = Math.max(1, Math.min(i, e))
          , n = this.dimensions.HEIGHT * s
          , o = Math.ceil(Math.max(0, (t - n - Runner.config.ARCADE_MODE_INITIAL_TOP_POSITION) * Runner.config.ARCADE_MODE_TOP_POSITION_PERCENT)) * window.devicePixelRatio;
        this.containerEl.style.transform = "scale(" + s + ") translateY(" + o + "px)"
    },
    onVisibilityChange: function(t) {
        (document.hidden || document.webkitHidden || "blur" === t.type || "visible" !== document.visibilityState) && (this.paused || (runner.die = !0))
    },
    playSound: function(t) {
        var i;
        t && ((i = this.audioContext.createBufferSource()).buffer = t,
        i.connect(this.audioContext.destination),
        i.start(0))
    },
    invert: function() {},
    addRecord: function(t) {
        runner.record.push(performance.now() - weaponManager.startTime, t),
        weaponManager.addRecord(t)
    }
},
Runner.updateCanvasScaling = function(t, i, e) {
    var s = t.getContext("2d")
      , n = Math.floor(window.devicePixelRatio) || 1
      , o = Math.floor(s.webkitBackingStorePixelRatio) || 1
      , h = n / o;
    if (n === o)
        return 1 === n && (t.style.width = t.width + "px",
        t.style.height = t.height + "px"),
        !1;
    var a = i || t.width
      , r = e || t.height;
    return t.width = a * h,
    t.height = r * h,
    t.style.width = a + "px",
    t.style.height = r + "px",
    s.scale(h, h),
    !0
}
,
GameOverPanel.dimensions = {
    TEXT_X: 0,
    TEXT_Y: 13,
    TEXT_WIDTH: 191,
    TEXT_HEIGHT: 11,
    RESTART_WIDTH: 36,
    RESTART_HEIGHT: 32
},
GameOverPanel.prototype = {
    updateDimensions: function(t, i) {
        this.canvasDimensions.WIDTH = t,
        i && (this.canvasDimensions.HEIGHT = i)
    },
    draw: function() {
        var t = GameOverPanel.dimensions
          , i = this.canvasDimensions.WIDTH / 2
          , e = t.TEXT_X
          , s = t.TEXT_Y
          , n = t.TEXT_WIDTH
          , o = t.TEXT_HEIGHT
          , h = Math.round(i - t.TEXT_WIDTH / 2)
          , a = Math.round((this.canvasDimensions.HEIGHT - 25) / 3)
          , r = t.TEXT_WIDTH
          , c = t.TEXT_HEIGHT
          , d = t.RESTART_WIDTH
          , u = t.RESTART_HEIGHT
          , l = i - t.RESTART_WIDTH / 2
          , g = this.canvasDimensions.HEIGHT / 2;
        IS_HIDPI && (s *= 2,
        e *= 2,
        n *= 2,
        o *= 2,
        d *= 2,
        u *= 2),
        e += this.textImgPos.x,
        s += this.textImgPos.y,
        this.canvasCtx.drawImage(Runner.imageSprite, e, s, n, o, h, a, r, c),
        this.canvasCtx.drawImage(Runner.imageSprite, this.restartImgPos.x, this.restartImgPos.y, d, u, l, g, t.RESTART_WIDTH, t.RESTART_HEIGHT)
    }
},
Obstacle.MAX_GAP_COEFFICIENT = 1.5,
Obstacle.prototype = {
    init: function(t) {
        this.cloneCollisionBoxes(),
        this.width = this.typeConfig.width,
        this.height = this.typeConfig.height,
        this.animator = new Animator(this.typeConfig.frameFilenames[this.state],this.typeConfig.frameSpeed,this.typeConfig.animationLoop,!1),
        this.animator.start();
        var i, e = this.typeConfig.yAdjust || 0;
        500 < runner.score && "ptero" == this.typeConfig.type && Math.floor(3 * Math.random()) && (this.sineSpeed = 150 + 100 * Math.random(),
        e -= 25),
        this.yPos = this.typeConfig.yPos,
        e && (this.yPos += Math.floor(Math.random() * e)),
        this.typeConfig.randomResize && (i = .5 * Math.random() + 1,
        this.yPos -= Math.floor(this.width * (i - 1) * .75),
        this.width = Math.floor(this.width * i),
        this.height = Math.floor(this.height * i),
        this.collisionBoxes[0].x = Math.floor(this.collisionBoxes[0].x * i),
        this.collisionBoxes[0].y = Math.floor(this.collisionBoxes[0].y * i),
        this.collisionBoxes[0].width = Math.floor(this.collisionBoxes[0].width * i),
        this.collisionBoxes[0].height = Math.floor(this.collisionBoxes[0].height * i)),
        this.startYPos = this.yPos,
        this.draw(),
        this.typeConfig.speedOffset && (this.speedOffset = .5 < Math.random() ? this.typeConfig.speedOffset : -this.typeConfig.speedOffset),
        this.gap = this.getGap(this.gapCoefficient, t)
    },
    draw: function() {
        this.destroyed && (this.canvasCtx.globalAlpha = .5),
        this.canvasCtx.drawImage(this.animator.getCurrentFrame(), 0, 0, 201, 201, this.xPos, this.yPos, this.width, this.height),
        this.canvasCtx.globalAlpha = 1
    },
    update: function(t, i) {
        this.animator.update(t),
        this.destroyed ? this.ascend ? --this.yPos : "ptero" == this.typeConfig.type && this.yPos < 100 + additionalHeight && (this.yPos += .5) : this.sineSpeed && (this.yPos = 25 * Math.sin(performance.now() / this.sineSpeed) + this.startYPos),
        this.remove || (this.typeConfig.speedOffset && (i += this.speedOffset),
        this.xPos -= Math.floor(i * FPS / 1e3 * t),
        this.typeConfig.numFrames && (this.timer += t,
        this.timer >= this.typeConfig.frameRate && (this.currentFrame = this.currentFrame === this.typeConfig.numFrames - 1 ? 0 : this.currentFrame + 1,
        this.timer = 0)),
        this.draw(),
        this.isVisible() || (this.remove = !0))
    },
    getGap: function(t, i) {
        var e = Math.round(this.width * i + this.typeConfig.minGap * t)
          , s = getRandomNum(e, Math.round(e * Obstacle.MAX_GAP_COEFFICIENT));
        return 1e3 < runner.score && (s *= .3,
        console.log("gap shrink !")),
        s
    },
    isVisible: function() {
        return 0 < this.xPos + this.width
    },
    cloneCollisionBoxes: function() {
        for (var t = this.typeConfig.collisionBoxes, i = t.length - 1; 0 <= i; i--)
            this.collisionBoxes[i] = new CollisionBox(t[i].x,t[i].y,t[i].width,t[i].height)
    },
    setState: function(t) {
        this.state = t,
        this.animator.setFrames(this.typeConfig.frameFilenames[this.state]),
        this.animator.start()
    },
    destroy: function(t) {
        runner.addRecord("destroy " + this.typeConfig.type + " " + this.state),
        "gold" == this.state && runner.goldKills++,
        this.setState(t),
        this.destroyed = !0,
        "holy" == t && (this.ascend = !0),
        -1 < ["holy", "grenade"].indexOf(t) && (this.animator.loop = !0)
    }
},
Obstacle.types = [{
    type: "cacti1",
    width: 50,
    height: 50,
    randomResize: !0,
    yPos: 97 + additionalHeight,
    multipleSpeed: 4,
    minGap: 120,
    minSpeed: 0,
    collisionBoxes: [new CollisionBox(15,10,20,35)],
    frameFilenames: {
        normal: ["cacti1_normal_0.png"],
        sword: ["cacti1_sword_0.png"],
        bat: ["cacti1_bat_0.png", "cacti1_bat_1.png"],
        gun: ["cacti1_gun_0.png", "cacti1_gun_1.png"],
        flipflop: ["cacti1_flipflop_0.png"],
        flame: ["cacti1_flame_0.png", "cacti1_flame_1.png"],
        shuriken: ["cacti1_shuriken_0.png"],
        holy: ["cacti1_holy_0.png", "cacti1_holy_1.png"],
        grenade: ["cacti1_grenade_0.png", "cacti1_grenade_1.png"],
        bow: ["cacti1_bow_0.png"],
        meteor: ["cacti1_meteor_0.png", "cacti1_meteor_1.png"],
        hammer: ["cacti1_hammer_0.png"]
    }
}, {
    type: "cacti2",
    width: 50,
    height: 50,
    randomResize: !0,
    yPos: 97 + additionalHeight,
    multipleSpeed: 4,
    minGap: 120,
    minSpeed: 0,
    collisionBoxes: [new CollisionBox(10,10,33,35)],
    frameFilenames: {
        normal: ["cacti2_normal_0.png"],
        sword: ["cacti2_sword_0.png"],
        bat: ["cacti2_bat_0.png", "cacti2_bat_1.png"],
        gun: ["cacti2_gun_0.png", "cacti2_gun_1.png"],
        flipflop: ["cacti2_flipflop_0.png"],
        flame: ["cacti2_flame_0.png", "cacti2_flame_1.png"],
        shuriken: ["cacti2_shuriken_0.png"],
        holy: ["cacti2_holy_0.png", "cacti2_holy_1.png"],
        grenade: ["cacti2_grenade_0.png", "cacti2_grenade_1.png"],
        bow: ["cacti2_bow_0.png"],
        meteor: ["cacti2_meteor_0.png", "cacti2_meteor_1.png"],
        hammer: ["cacti2_hammer_0.png"]
    }
}, {
    type: "ptero",
    width: 60,
    height: 60,
    randomResize: !1,
    yPos: 50 + additionalHeight,
    yAdjust: 40,
    multipleSpeed: 999,
    minSpeed: 8.5,
    minGap: 150,
    collisionBoxes: [new CollisionBox(12,19,30,18)],
    frameFilenames: {
        normal: ["ptero_normal_0.png", "ptero_normal_1.png"],
        gold: ["ptero_gold_0.png", "ptero_gold_1.png"],
        sword: ["ptero_sword_0.png", "ptero_sword_1.png"],
        bat: ["ptero_bat_0.png", "ptero_bat_1.png"],
        gun: ["ptero_gun_0.png", "ptero_gun_1.png", "ptero_gun_2.png", "ptero_gun_3.png"],
        flipflop: ["ptero_bat_0.png", "ptero_bat_1.png"],
        flame: ["ptero_flame_0.png", "ptero_flame_1.png", "ptero_flame_2.png", "ptero_flame_3.png"],
        shuriken: ["ptero_shuriken_0.png", "ptero_shuriken_1.png"],
        holy: ["ptero_holy_0.png", "ptero_holy_1.png"],
        grenade: ["ptero_grenade_0.png", "ptero_grenade_1.png"],
        bow: ["ptero_bow_0.png", "ptero_bow_1.png"],
        meteor: ["ptero_meteor_0.png", "ptero_meteor_1.png", "ptero_meteor_2.png", "ptero_meteor_3.png"],
        hammer: ["ptero_hammer_0.png", "ptero_hammer_1.png"]
    },
    frameSpeed: 1e3 / 6,
    animationLoop: !0,
    speedOffset: .8
}],
Trex.config = {
    DROP_VELOCITY: -5,
    GRAVITY: .6,
    HEIGHT: 47,
    HEIGHT_DUCK: 25,
    INIITAL_JUMP_VELOCITY: -10,
    INTRO_DURATION: 500,
    MAX_JUMP_HEIGHT: 30,
    MIN_JUMP_HEIGHT: 30,
    SPEED_DROP_COEFFICIENT: 3,
    SPRITE_WIDTH: 262,
    START_X_POS: 50,
    WIDTH: 44,
    WIDTH_DUCK: 59
},
Trex.collisionBoxes = {
    DUCKING: [new CollisionBox(1,18,55,25)],
    RUNNING: [new CollisionBox(22,0,17,16), new CollisionBox(1,18,30,9), new CollisionBox(10,35,14,8), new CollisionBox(1,24,29,5), new CollisionBox(5,30,21,4), new CollisionBox(9,34,15,4)]
},
Trex.status = {
    CRASHED: "CRASHED",
    DUCKING: "DUCKING",
    JUMPING: "JUMPING",
    RUNNING: "RUNNING",
    WAITING: "WAITING"
},
Trex.BLINK_TIMING = 7e3,
Trex.animFrames = {
    WAITING: {
        frames: [44, 0],
        msPerFrame: 1e3 / 3
    },
    RUNNING: {
        frames: [88, 132],
        msPerFrame: 1e3 / 12
    },
    CRASHED: {
        frames: [220],
        msPerFrame: 1e3 / 60
    },
    JUMPING: {
        frames: [0],
        msPerFrame: 1e3 / 60
    },
    DUCKING: {
        frames: [264, 323],
        msPerFrame: 125
    }
},
Trex.prototype = {
    init: function() {
        this.groundYPos = Runner.defaultDimensions.HEIGHT - this.config.HEIGHT - Runner.config.BOTTOM_PAD,
        this.yPos = this.groundYPos,
        this.minJumpHeight = this.groundYPos - this.config.MIN_JUMP_HEIGHT,
        this.draw(0, 0),
        this.update(0, Trex.status.WAITING)
    },
    setJumpVelocity: function(t) {
        this.config.INIITAL_JUMP_VELOCITY = -t,
        this.config.DROP_VELOCITY = -t / 2
    },
    update: function(t, i) {
        this.timer += t,
        i && (this.status = i,
        this.currentFrame = 0,
        this.msPerFrame = Trex.animFrames[i].msPerFrame,
        this.currentAnimFrames = Trex.animFrames[i].frames,
        i === Trex.status.WAITING && (this.animStartTime = getTimeStamp(),
        this.setBlinkDelay())),
        this.playingIntro && this.xPos < this.config.START_X_POS && (this.xPos += Math.round(this.config.START_X_POS / this.config.INTRO_DURATION * t),
        this.xInitialPos = this.xPos),
        this.status === Trex.status.WAITING ? this.blink(getTimeStamp()) : this.draw(this.currentAnimFrames[this.currentFrame], 0),
        this.timer >= this.msPerFrame && (this.currentFrame = this.currentFrame == this.currentAnimFrames.length - 1 ? 0 : this.currentFrame + 1,
        this.timer = 0),
        this.speedDrop && this.yPos === this.groundYPos && (this.speedDrop = !1,
        this.setDuck(!0))
    },
    draw: function(t, i) {
        var e, s, n, o, h;
        this.hideDino && this.status !== Trex.status.CRASHED || this.hideDeath && this.status == Trex.status.CRASHED || (e = t,
        s = i,
        n = this.ducking && this.status !== Trex.status.CRASHED ? this.config.WIDTH_DUCK : this.config.WIDTH,
        h = o = this.config.HEIGHT,
        IS_HIDPI && (e *= 2,
        s *= 2,
        n *= 2,
        o *= 2),
        e += this.spritePos.x,
        s += this.spritePos.y,
        this.ducking && this.status !== Trex.status.CRASHED ? this.canvasCtx.drawImage(Runner.imageSprite, e, s, n, o, this.xPos, this.yPos, this.config.WIDTH_DUCK, h) : (this.ducking && this.status === Trex.status.CRASHED && this.xPos++,
        this.canvasCtx.drawImage(Runner.imageSprite, e, s, n, o, this.xPos, this.yPos, this.config.WIDTH, h)),
        this.canvasCtx.globalAlpha = 1)
    },
    setBlinkDelay: function() {
        this.blinkDelay = Math.ceil(Math.random() * Trex.BLINK_TIMING)
    },
    blink: function(t) {
        t - this.animStartTime >= this.blinkDelay && (this.draw(this.currentAnimFrames[this.currentFrame], 0),
        1 === this.currentFrame && (this.setBlinkDelay(),
        this.animStartTime = t,
        this.blinkCount++))
    },
    startJump: function(t) {
        this.noJump || this.jumping || (runner.addRecord("jump"),
        this.update(0, Trex.status.JUMPING),
        this.jumpVelocity = this.config.INIITAL_JUMP_VELOCITY - t / 10,
        this.jumping = !0,
        this.reachedMinHeight = !1,
        this.speedDrop = !1)
    },
    endJump: function() {
        this.reachedMinHeight && this.jumpVelocity < this.config.DROP_VELOCITY && (this.jumpVelocity = this.config.DROP_VELOCITY)
    },
    updateJump: function(t) {
        var i = t / Trex.animFrames[this.status].msPerFrame;
        this.speedDrop ? this.yPos += Math.round(this.jumpVelocity * this.config.SPEED_DROP_COEFFICIENT * i) : this.yPos += Math.round(this.jumpVelocity * i),
        this.jumpVelocity += this.config.GRAVITY * i,
        (this.yPos < this.minJumpHeight || this.speedDrop) && (this.reachedMinHeight = !0),
        (this.yPos < this.config.MAX_JUMP_HEIGHT || this.speedDrop) && this.endJump(),
        this.yPos > this.groundYPos && (this.reset(),
        this.jumpCount++)
    },
    setSpeedDrop: function() {
        this.speedDrop = !0,
        this.jumpVelocity = 1
    },
    setDuck: function() {},
    reset: function() {
        this.xPos = this.xInitialPos,
        this.yPos = this.groundYPos,
        this.jumpVelocity = 0,
        this.jumping = !1,
        this.ducking = !1,
        this.update(0, Trex.status.RUNNING),
        this.midair = !1,
        this.speedDrop = !1,
        this.jumpCount = 0
    }
},
DistanceMeter.dimensions = {
    WIDTH: 10,
    HEIGHT: 13,
    DEST_WIDTH: 11
},
DistanceMeter.yPos = [0, 13, 27, 40, 53, 67, 80, 93, 107, 120],
DistanceMeter.config = {
    MAX_DISTANCE_UNITS: 5,
    ACHIEVEMENT_DISTANCE: 100,
    COEFFICIENT: .025,
    FLASH_DURATION: 250,
    FLASH_ITERATIONS: 3,
    HIGH_SCORE_HIT_AREA_PADDING: 4
},
DistanceMeter.prototype = {
    init: function(t) {
        var i = "";
        this.calcXPos(t),
        this.maxScore = this.maxScoreUnits;
        for (var e = 0; e < this.maxScoreUnits; e++)
            this.draw(e, 0),
            this.defaultString += "0",
            i += "9";
        this.maxScore = parseInt(i, 10)
    },
    calcXPos: function(t) {
        this.x = t - DistanceMeter.dimensions.DEST_WIDTH * (this.maxScoreUnits + 1)
    },
    draw: function() {},
    getActualDistance: function(t) {
        var i = t ? Math.round(t * this.config.COEFFICIENT) : 0;
        return i > runner.score && (runner.score = i),
        i
    },
    update: function(t, i) {
        var e, s = !0, n = !1;
        this.achievement ? this.flashIterations <= this.config.FLASH_ITERATIONS ? (this.flashTimer += t,
        this.flashTimer < this.config.FLASH_DURATION ? s = !1 : this.flashTimer > 2 * this.config.FLASH_DURATION && (this.flashTimer = 0,
        this.flashIterations++)) : (this.achievement = !1,
        this.flashIterations = 0,
        this.flashTimer = 0) : ((i = this.getActualDistance(i)) > this.maxScore && this.maxScoreUnits == this.config.MAX_DISTANCE_UNITS ? (this.maxScoreUnits++,
        this.maxScore = parseInt(this.maxScore + "9", 10)) : this.distance = 0,
        0 < i ? (i % this.config.ACHIEVEMENT_DISTANCE == 0 && (this.achievement = !0,
        n = !(this.flashTimer = 0)),
        e = (this.defaultString + i).substr(-this.maxScoreUnits),
        this.digits = e.split("")) : this.digits = this.defaultString.split("")),
        this.canvasCtx.font = "15px DogicaPixelBold",
        this.canvasCtx.fillStyle = "#494949";
        var o = padScore(runner.score)
          , h = this.canvasCtx.measureText(o).width;
        s && this.canvasCtx.fillText(o, runner.dimensions.WIDTH - h, 20);
        var a = "HI ".concat(padScore(runner.personalHighscore))
          , r = this.canvasCtx.measureText(a).width;
        return this.canvasCtx.save(),
        this.canvasCtx.globalAlpha = .8,
        this.canvasCtx.fillText(a, runner.dimensions.WIDTH - h - r - 30, 20),
        this.canvasCtx.restore(),
        n
    },
    drawHighScore: function() {},
    setHighScore: function(t) {
        t = this.getActualDistance(t);
        var i = (this.defaultString + t).substr(-this.maxScoreUnits);
        this.highScore = ["10", "11", ""].concat(i.split(""))
    },
    hasClickedOnHighScore: function(t) {
        var i, e = 0, s = 0;
        return s = t.touches ? (i = this.canvas.getBoundingClientRect(),
        e = t.touches[0].clientX - i.left,
        t.touches[0].clientY - i.top) : (e = t.offsetX,
        t.offsetY),
        this.highScoreBounds = this.getHighScoreBounds(),
        e >= this.highScoreBounds.x && e <= this.highScoreBounds.x + this.highScoreBounds.width && s >= this.highScoreBounds.y && s <= this.highScoreBounds.y + this.highScoreBounds.height
    },
    getHighScoreBounds: function() {
        return {
            x: this.x - 2 * this.maxScoreUnits * DistanceMeter.dimensions.WIDTH - DistanceMeter.config.HIGH_SCORE_HIT_AREA_PADDING,
            y: this.y,
            width: DistanceMeter.dimensions.WIDTH * (this.highScore.length + 1) + DistanceMeter.config.HIGH_SCORE_HIT_AREA_PADDING,
            height: DistanceMeter.dimensions.HEIGHT + 2 * DistanceMeter.config.HIGH_SCORE_HIT_AREA_PADDING
        }
    },
    flashHighScore: function() {
        var t = getTimeStamp()
          , i = t - (this.frameTimeStamp || t)
          , e = !0;
        this.frameTimeStamp = t,
        this.flashIterations > 2 * this.config.FLASH_ITERATIONS ? this.cancelHighScoreFlashing() : (this.flashTimer += i,
        this.flashTimer < this.config.FLASH_DURATION ? e = !1 : this.flashTimer > 2 * this.config.FLASH_DURATION && (this.flashTimer = 0,
        this.flashIterations++),
        e ? this.drawHighScore() : this.clearHighScoreBounds(),
        this.flashingRafId = requestAnimationFrame(this.flashHighScore.bind(this)))
    },
    clearHighScoreBounds: function() {
        this.canvasCtx.save(),
        this.canvasCtx.fillStyle = "#fff",
        this.canvasCtx.rect(this.highScoreBounds.x, this.highScoreBounds.y, this.highScoreBounds.width, this.highScoreBounds.height),
        this.canvasCtx.fill(),
        this.canvasCtx.restore()
    },
    startHighScoreFlashing: function() {
        this.highScoreFlashing = !0,
        this.flashHighScore()
    },
    isHighScoreFlashing: function() {
        return this.highScoreFlashing
    },
    cancelHighScoreFlashing: function() {
        this.flashingRafId && cancelAnimationFrame(this.flashingRafId),
        this.flashIterations = 0,
        this.flashTimer = 0,
        this.highScoreFlashing = !1,
        this.clearHighScoreBounds(),
        this.drawHighScore()
    },
    resetHighScore: function() {
        this.setHighScore(0),
        this.cancelHighScoreFlashing()
    },
    reset: function() {
        this.update(0, 0),
        this.achievement = !1
    }
},
Cloud.config = {
    HEIGHT: 14,
    MAX_CLOUD_GAP: 400,
    MAX_SKY_LEVEL: 30 + additionalHeight,
    MIN_CLOUD_GAP: 100,
    MIN_SKY_LEVEL: 71 + additionalHeight,
    WIDTH: 46
},
Cloud.prototype = {
    init: function() {
        this.yPos = getRandomNum(Cloud.config.MAX_SKY_LEVEL, Cloud.config.MIN_SKY_LEVEL),
        this.draw()
    },
    draw: function() {
        this.canvasCtx.save();
        var t = Cloud.config.WIDTH
          , i = Cloud.config.HEIGHT
          , e = t
          , s = i;
        IS_HIDPI && (t *= 2,
        i *= 2),
        this.canvasCtx.drawImage(Runner.imageSprite, this.spritePos.x, this.spritePos.y, t, i, this.xPos, this.yPos, e, s),
        this.canvasCtx.restore()
    },
    update: function(t) {
        this.remove || (this.xPos -= Math.ceil(t),
        this.draw(),
        this.isVisible() || (this.remove = !0))
    },
    isVisible: function() {
        return 0 < this.xPos + Cloud.config.WIDTH
    }
},
NightMode.config = {
    FADE_SPEED: .035,
    HEIGHT: 40,
    MOON_SPEED: .25,
    NUM_STARS: 2,
    STAR_SIZE: 9,
    STAR_SPEED: .3,
    STAR_MAX_Y: 70 + additionalHeight,
    WIDTH: 20
},
NightMode.phases = [140, 120, 100, 60, 40, 20, 0],
NightMode.prototype = {
    update: function(t) {
        if (t && 0 === this.opacity && (this.currentPhase++,
        this.currentPhase >= NightMode.phases.length && (this.currentPhase = 0)),
        t && (this.opacity < 1 || 0 === this.opacity) ? this.opacity += NightMode.config.FADE_SPEED : 0 < this.opacity && (this.opacity -= NightMode.config.FADE_SPEED),
        0 < this.opacity) {
            if (this.xPos = this.updateXPos(this.xPos, NightMode.config.MOON_SPEED),
            this.drawStars)
                for (var i = 0; i < NightMode.config.NUM_STARS; i++)
                    this.stars[i].x = this.updateXPos(this.stars[i].x, NightMode.config.STAR_SPEED);
            this.draw()
        } else
            this.opacity = 0,
            this.placeStars();
        this.drawStars = !0
    },
    updateXPos: function(t, i) {
        return t < -NightMode.config.WIDTH ? t = this.containerWidth : t -= i,
        t
    },
    draw: function() {
        var t = 3 === this.currentPhase ? 2 * NightMode.config.WIDTH : NightMode.config.WIDTH
          , i = NightMode.config.HEIGHT
          , e = this.spritePos.x + NightMode.phases[this.currentPhase]
          , s = t
          , n = NightMode.config.STAR_SIZE
          , o = Runner.spriteDefinition.LDPI.STAR.x;
        if (IS_HIDPI && (t *= 2,
        i *= 2,
        e = this.spritePos.x + 2 * NightMode.phases[this.currentPhase],
        n *= 2,
        o = Runner.spriteDefinition.HDPI.STAR.x),
        this.canvasCtx.save(),
        this.canvasCtx.globalAlpha = this.opacity,
        this.drawStars)
            for (var h = 0; h < NightMode.config.NUM_STARS; h++)
                this.canvasCtx.drawImage(Runner.imageSprite, o, this.stars[h].sourceY, n, n, Math.round(this.stars[h].x), this.stars[h].y, NightMode.config.STAR_SIZE, NightMode.config.STAR_SIZE);
        this.canvasCtx.drawImage(Runner.imageSprite, e, this.spritePos.y, t, i, Math.round(this.xPos), this.yPos, s, NightMode.config.HEIGHT),
        this.canvasCtx.globalAlpha = 1,
        this.canvasCtx.restore()
    },
    placeStars: function() {
        for (var t = Math.round(this.containerWidth / NightMode.config.NUM_STARS), i = 0; i < NightMode.config.NUM_STARS; i++)
            this.stars[i] = {},
            this.stars[i].x = getRandomNum(t * i, t * (i + 1)),
            this.stars[i].y = getRandomNum(0, NightMode.config.STAR_MAX_Y),
            this.stars[i].sourceY = IS_HIDPI ? Runner.spriteDefinition.HDPI.STAR.y + 2 * NightMode.config.STAR_SIZE * i : Runner.spriteDefinition.LDPI.STAR.y + NightMode.config.STAR_SIZE * i
    },
    reset: function() {
        this.currentPhase = 0,
        this.opacity = 0,
        this.update(!1)
    }
},
HorizonLine.dimensions = {
    WIDTH: 600,
    HEIGHT: 12,
    YPOS: 127 + additionalHeight
},
HorizonLine.prototype = {
    setSourceDimensions: function() {
        for (var t in HorizonLine.dimensions)
            IS_HIDPI ? "YPOS" !== t && (this.sourceDimensions[t] = 2 * HorizonLine.dimensions[t]) : this.sourceDimensions[t] = HorizonLine.dimensions[t],
            this.dimensions[t] = HorizonLine.dimensions[t];
        this.xPos = [0, HorizonLine.dimensions.WIDTH],
        this.yPos = HorizonLine.dimensions.YPOS
    },
    getRandomType: function() {
        return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0
    },
    draw: function() {
        this.canvasCtx.drawImage(Runner.imageSprite, this.sourceXPos[0], this.spritePos.y, this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT, this.xPos[0], this.yPos, this.dimensions.WIDTH, this.dimensions.HEIGHT),
        this.canvasCtx.drawImage(Runner.imageSprite, this.sourceXPos[1], this.spritePos.y, this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT, this.xPos[1], this.yPos, this.dimensions.WIDTH, this.dimensions.HEIGHT)
    },
    updateXPos: function(t, i) {
        var e = t
          , s = 0 === t ? 1 : 0;
        this.xPos[e] -= i,
        this.xPos[s] = this.xPos[e] + this.dimensions.WIDTH,
        this.xPos[e] <= -this.dimensions.WIDTH && (this.xPos[e] += 2 * this.dimensions.WIDTH,
        this.xPos[s] = this.xPos[e] - this.dimensions.WIDTH,
        this.sourceXPos[e] = this.getRandomType() + this.spritePos.x)
    },
    update: function(t, i) {
        var e = Math.floor(i * (FPS / 1e3) * t);
        this.xPos[0] <= 0 ? this.updateXPos(0, e) : this.updateXPos(1, e),
        this.draw()
    },
    reset: function() {
        this.xPos[0] = 0,
        this.xPos[1] = HorizonLine.dimensions.WIDTH
    }
},
Horizon.config = {
    BG_CLOUD_SPEED: .2,
    BUMPY_THRESHOLD: .3,
    CLOUD_FREQUENCY: .5,
    HORIZON_HEIGHT: 16,
    MAX_CLOUDS: 6
},
Horizon.prototype = {
    init: function() {
        this.addCloud(),
        this.horizonLine = new HorizonLine(this.canvas,this.spritePos.HORIZON),
        this.nightMode = new NightMode(this.canvas,this.spritePos.MOON,this.dimensions.WIDTH)
    },
    update: function(t, i, e, s) {
        this.runningTime += t,
        this.horizonLine.update(t, i),
        this.nightMode.update(s),
        this.updateClouds(t, i),
        e && this.updateObstacles(t, i)
    },
    updateClouds: function(t, i) {
        var e = this.cloudSpeed / 1e3 * t * i
          , s = this.clouds.length;
        if (s) {
            for (var n = s - 1; 0 <= n; n--)
                this.clouds[n].update(e);
            var o = this.clouds[s - 1];
            s < this.config.MAX_CLOUDS && this.dimensions.WIDTH - o.xPos > o.cloudGap && this.cloudFrequency > Math.random() && this.addCloud(),
            this.clouds = this.clouds.filter(function(t) {
                return !t.remove
            })
        } else
            this.addCloud()
    },
    updateObstacles: function(t, i) {
        for (var e, s = this.obstacles.slice(0), n = 0; n < this.obstacles.length; n++) {
            var o = this.obstacles[n];
            o.update(t, i),
            o.remove && s.shift()
        }
        this.obstacles = s,
        0 < this.obstacles.length ? (e = this.obstacles[this.obstacles.length - 1]) && !e.followingObstacleCreated && e.isVisible() && e.xPos + e.width + e.gap < this.dimensions.WIDTH && (this.addNewObstacle(i),
        e.followingObstacleCreated = !0) : this.addNewObstacle(i)
    },
    removeFirstObstacle: function() {
        this.obstacles.shift()
    },
    addNewObstacle: function(t) {
        var i, e, s = getRandomNum(0, Obstacle.types.length - 1), n = Obstacle.types[s];
        t < n.minSpeed ? this.addNewObstacle(t) : (i = this.spritePos[n.type],
        "ptero" == (e = new Obstacle(this.canvasCtx,n,i,this.dimensions,this.gapCoefficient,t,n.width)).typeConfig.type && (Math.floor(10 * Math.random()) || e.setState("gold")),
        runner.addRecord("spawn " + e.typeConfig.type),
        this.obstacles.push(e),
        this.obstacleHistory.unshift(n.type),
        1 < this.obstacleHistory.length && this.obstacleHistory.splice(Runner.config.MAX_OBSTACLE_DUPLICATION))
    },
    duplicateObstacleCheck: function(t) {
        for (var i = 0, e = 0; e < this.obstacleHistory.length; e++)
            i = this.obstacleHistory[e] === t ? i + 1 : 0;
        return i >= Runner.config.MAX_OBSTACLE_DUPLICATION
    },
    reset: function() {
        this.obstacles = [],
        this.horizonLine.reset(),
        this.nightMode.reset()
    },
    resize: function(t, i) {
        this.canvas.width = t,
        this.canvas.height = i
    },
    addCloud: function() {
        this.clouds.push(new Cloud(this.canvas,this.spritePos.CLOUD,this.dimensions.WIDTH))
    }
};
