"use strict";
var _ref;
function _defineProperty(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n,
    e
}
function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
        var t = 16 * Math.random() | 0;
        return ("x" == e ? t : 3 & t | 8).toString(16)
    })
}
var imageCache = {};
function loadImage(e) {
    var t = imageCache[e];
    return t || (t = new Image,
    (imageCache[e] = t).src = e),
    t
}
var doubleDeathImage = loadImage("images/double_death.png")
  , portal = null
  , weaponBox = null
  , weaponUseCount = {}
  , weaponConfigs = [{
    id: "sword",
    name: "Sword",
    flavor: "Slice slice!",
    type: "melee",
    frameSpeed: 100,
    frameFilenames: ["sword_0.png", "sword_1.png"],
    destroyType: "sword",
    unlimited: !0,
    hitBox: {
        x: 50,
        y: 50,
        width: 30,
        height: 30
    }
}, {
    id: "bat",
    name: "Home Run Bat",
    flavor: "Batter up!",
    type: "melee",
    frameSpeed: 75,
    frameCount: 2,
    stillFrameFilename: "bat_still.png",
    frameFilenames: ["bat_0.png", "bat_1.png", "bat_2.png", "bat_3.png"],
    xOffset: -1,
    yOffset: -48.5,
    hideDino: !0,
    destroyType: "bat",
    unlimited: !0,
    hitBox: {
        x: 50,
        y: 50,
        width: 10,
        height: 15
    }
}, {
    id: "rifle",
    name: "Rifle",
    flavor: "Pew pew!",
    type: "gun",
    destroyType: "shot",
    frameSpeed: 100,
    frameFilenames: ["rifle_0.png", "rifle_1.png", "rifle_2.png"],
    maxUses: 10000000000000,
    hitBox: {
        x: 50,
        y: 50,
        width: 10,
        height: 15
    },
    projectile: {
        xOffset: 50,
        yOffset: 22,
        xVelocity: 10,
        destroyType: "gun"
    }
}, {
    id: "handgun",
    name: "Handgun",
    flavor: "One shot; one kill.",
    type: "gun",
    frameSpeed: 100,
    frameFilenames: ["handgun_0.png", "handgun_1.png", "handgun_2.png", "handgun_3.png"],
    hitBox: {
        x: 50,
        y: 50,
        width: 10,
        height: 15
    },
    maxUses: 10000000000000,
    projectile: {
        xOffset: 30,
        yOffset: 22,
        xVelocity: 10,
        destroyType: "gun"
    }
}, {
    id: "flipflop",
    name: "Flip Flop",
    flavor: "Grandma’s weapon of choice.",
    type: "throwable",
    duration: 200,
    maxUses: 10000000000000,
    projectile: {
        frameFilenames: ["flipflop_0.png", "flipflop_1.png", "flipflop_2.png", "flipflop_3.png"],
        frameSpeed: 100,
        width: 20,
        height: 20,
        xOffset: 10,
        yOffset: 10,
        xVelocity: 5,
        destroyType: "flipflop",
        hitBox: {
            x: 2,
            y: 2,
            width: 16,
            height: 16
        }
    }
}, {
    id: "flamethrower",
    name: "Flamethrower",
    flavor: "Burn baby, burn!",
    type: "melee",
    frameSpeed: 100,
    stillFrameFilename: "flamethrower_0.png",
    frameFilenames: ["flamethrower_1.png", "flamethrower_2.png"],
    hold: !0,
    animationLoop: !0,
    destroyType: "flame",
    duration: 36e5,
    maxTime: 1e4,
    hitBox: {
        x: 50,
        y: 65,
        width: 40,
        height: 15
    }
}, {
    id: "shuriken",
    name: "Shuriken",
    flavor: "Nani?!?!",
    type: "throwable",
    duration: 200,
    maxUses: 10000000000000,
    projectile: {
        frameFilenames: ["shuriken_0.png", "shuriken_1.png", "shuriken_2.png", "shuriken_3.png"],
        frameSpeed: 100,
        width: 20,
        height: 20,
        xOffset: 10,
        yOffset: 10,
        xVelocity: 5,
        destroyType: "shuriken",
        hitBox: {
            x: 2,
            y: 2,
            width: 16,
            height: 16
        }
    }
}, (_defineProperty(_ref = {
    id: "scream",
    name: "Scream",
    type: "nothing",
    flavor: "AAHHHHH",
    frameSpeed: 100,
    stillFrameFilename: "blank.gif",
    frameFilenames: ["dino_scream_0.png", "dino_scream_1.png"],
    hold: !0,
    animationLoop: !0,
    duration: 36e5,
    xOffset: 10,
    hideDino: !0,
    width: 98,
    height: 47
}, "xOffset", 0),
_defineProperty(_ref, "yOffset", 0),
_defineProperty(_ref, "unlimited", !0),
_ref), {
    id: "chainsaw",
    name: "Chainsaw",
    flavor: "Revs continuously.",
    type: "melee",
    frameSpeed: 100,
    stillFrameFilename: "chainsaw_0.png",
    frameFilenames: ["chainsaw_0.png", "chainsaw_1.png"],
    hold: !0,
    animationLoop: !0,
    destroyType: "sword",
    duration: 36e5,
    maxTime: 1e4,
    hitBox: {
        x: 42,
        y: 50,
        width: 15,
        height: 30
    }
}, {
    id: "halberd",
    name: "Halberd",
    type: "melee",
    flavor: "If it’s good enough for the Swiss Guard, it’s good enough for you.",
    frameSpeed: 100,
    frameFilenames: ["halberd_0.png", "halberd_1.png", "halberd_2.png"],
    destroyType: "sword",
    unlimited: !0,
    hitBox: {
        x: 50,
        y: 50,
        width: 35,
        height: 30
    }
}, {
    id: "kick",
    name: "Flying Kick",
    type: "melee",
    flavor: "Hiyahhh!",
    frameSpeed: 200,
    stillFrameFilename: "blank.gif",
    frameFilenames: ["kick_0.png", "kick_1.png"],
    destroyType: "bat",
    hideDino: !0,
    width: 178 / 3,
    height: 49,
    xOffset: 2,
    yOffset: -9,
    unlimited: !0,
    hitBox: {
        x: 20,
        y: 10,
        width: 35,
        height: 30
    }
}, {
    id: "double",
    name: "Double-Edged Sword",
    type: "melee",
    flavor: "So sharp you might cut yourself.",
    frameSpeed: 100,
    frameFilenames: ["double_0.png", "double_1.png"],
    destroyType: "sword",
    unlimited: !0,
    hitBox: {
        x: 45,
        y: 50,
        width: 20,
        height: 30
    },
    onActivate: function() {
        var t = this;
        Math.round(Math.random()) && (this.hideDeath = !0,
        runner.die = !0,
        setTimeout(function e() {
            doubleDeathImage && doubleDeathImage.width && doubleDeathImage.height ? t.draw(doubleDeathImage) : setTimeout(e, 20)
        }, 20))
    }
}, {
    id: "salute",
    name: "Pay Respects",
    type: "nothing",
    flavor: "“Press F To Pay Respects”",
    frameSpeed: 100,
    frameFilenames: ["salute_0.png", "salute_1.png"],
    unlimited: !0
}, {
    id: "holywater",
    name: "Holy Water",
    type: "melee",
    flavor: "Get raptured.",
    frameSpeed: 100,
    frameFilenames: ["holywater_0.png", "holywater_1.png", "holywater_2.png"],
    destroyType: "holy",
    maxTime: 5e3,
    hitBox: {
        x: 50,
        y: 50,
        width: 35,
        height: 30
    }
}, {
    id: "grenade",
    name: "Grenade Launcher",
    type: "gun",
    flavor: "*fwoomp*",
    frameSpeed: 100,
    frameFilenames: ["grenade_0.png", "grenade_1.png", "grenade_2.png", "grenade_3.png"],
    maxUses: 10000000000000,
    hitBox: {
        x: 50,
        y: 50,
        width: 10,
        height: 15
    },
    projectile: {
        destroyType: "grenade",
        frameFilenames: ["grenade2.png"],
        xOffset: 48,
        yOffset: -10,
        xVelocity: 5,
        yVelocity: -5,
        gravity: .25,
        width: 22.5,
        height: 22.5,
        floor: 170,
        hitBox: {
            x: 2,
            y: 0,
            width: 10,
            height: 15
        },
        onDestroy: function() {
            var e = new Projectile({
                frameFilenames: ["explosion1.png", "explosion2.png", "blank.png"],
                frameSpeed: 100,
                xOffset: 0,
                yOffset: 0,
                xVelocity: 0,
                yVelocity: 0,
                followX: !0,
                width: 22.5,
                height: 22.5,
                hitBox: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                }
            },this.x,this.y);
            e.animator.loop = !1,
            e.animator.returnToFirst = !1,
            setTimeout(function() {
                projectiles.push(e)
            }, 50)
        }
    }
}, {
    id: "laser",
    name: "Laser Gun",
    type: "gun",
    flavor: "A concentrated beam of light.",
    frameSpeed: 100,
    frameFilenames: ["laser_gun.png"],
    maxTime: 6e3,
    onActivate: function() {
        this.laserOn = !0
    },
    onUpdate: function() {
        var a, i = this;
        this.laserOn && (runner.canvasCtx.fillStyle = "red",
        runner.canvasCtx.fillRect(runner.tRex.xPos + 48, runner.tRex.yPos + 21, 1e3, 2),
        a = new CollisionBox(runner.tRex.xPos + 48,runner.tRex.yPos + 21,1e3,2),
        runner.horizon.obstacles.forEach(function(e) {
            var t, n;
            e.destroyed || (t = createAdjustedCollisionBox(e.collisionBoxes[0], {
                x: e.xPos,
                y: e.yPos
            }),
            n = boxCompare(a, t),
            window.debug && drawCollisionBoxes(runner.canvasCtx, a, t),
            n && (e.destroy("grenade"),
            i.destroyed = !0))
        }))
    },
    onDeactivate: function() {
        this.laserOn = !1
    }
}, {
    id: "bow",
    name: "Bow and Arrow",
    type: "gun",
    flavor: "An oldie but goodie.",
    frameSpeed: 100,
    frameFilenames: ["bow_0.png", "bow_1.png", "bow_2.png"],
    maxUses: 10000000000000,
    projectile: {
        delay: 200,
        destroyType: "bow",
        frameFilenames: ["arrow.png"],
        xOffset: 20,
        yOffset: 22,
        gravity: .001,
        xVelocity: 5,
        yVelocity: -.1,
        width: 76 / 3,
        height: 17 / 3,
        hitBox: {
            x: 0,
            y: 0,
            width: 25,
            height: 5
        }
    }
}, {
    id: "tank",
    name: "Tank",
    type: "melee",
    flavor: "Ready to roll out!",
    frameSpeed: 100,
    stillFrameFilename: "blank.gif",
    frameFilenames: ["tank_0.png", "tank_1.png", "tank_2.png", "tank_3.png", "tank_4.png", "tank_5.png"],
    animationLoop: !0,
    duration: 36e5,
    hideDino: !0,
    destroyType: "bat",
    xOffset: -1,
    yOffset: -48.5,
    width: 130,
    height: 96,
    maxUses: 1,
    hitBox: {
        x: 40,
        y: 50,
        width: 80,
        height: 40
    },
    onActivate: function() {
        var e = this;
        runner.timeMulti = 0,
        runner.noClip = !0,
        this.animator.useInternalTime = !0,
        this.animator.returnToFirst = !1,
        setTimeout(function() {
            runner.timeMulti = 1,
            e.animator.setFrames(["tank_6.png", "tank_7.png"]),
            setTimeout(function() {
                runner.noClip = !1,
                e.state = "inactive"
            }, 8e3)
        }, 500)
    }
}, {
    id: "helicopter",
    name: "Helicopter",
    type: "other",
    flavor: "Get to da choppa!",
    frameSpeed: 100,
    animationLoop: !1,
    stillFrameFilename: "blank.gif",
    frameFilenames: ["helicopter_entry_0.png", "helicopter_entry_1.png", "helicopter_entry_2.png", "helicopter_entry_3.png", "helicopter_entry_4.png", "helicopter_entry_5.png", "helicopter_entry_6.png", "helicopter_entry_7.png", "helicopter_entry_8.png"],
    maxUses: 1,
    hideDino: !0,
    duration: 36e5,
    width: 130,
    height: 96,
    onActivate: function() {
        var e = this;
        this.flying = !1,
        this.shooting = 0,
        this.yOffset = -48,
        runner.timeMulti = 0,
        runner.noClip = !0,
        runner.tRex.noJump = !0,
        this.animator.useInternalTime = !0,
        this.animator.returnToFirst = !1,
        setTimeout(function() {
            e.flying = !0,
            runner.timeMulti = 1,
            e.animator.loop = !0,
            e.animator.setFrames(["helicopter_fly_0.png", "helicopter_fly_1.png"]),
            setTimeout(function() {
                runner.timeMulti = 0,
                e.flying = !1,
                e.shooting = 0
            }, 8e3)
        }, 800)
    },
    onUpdate: function(e) {
        var t = this;
        this.flying ? (-100 < this.yOffset && --this.yOffset,
        0 < this.shooting && (this.shooting -= e,
        this.shooting <= 0 && this.animator.setFrames(["helicopter_fly_0.png", "helicopter_fly_1.png"])),
        runner.horizon.obstacles.forEach(function(e) {
            e.destroyed || "ptero" == e.typeConfig.type && e.xPos < 450 && (e.destroy("meteor"),
            t.shooting <= 0 && t.animator.setFrames(["helicopter_shoot_0.png", "helicopter_shoot_1.png"]),
            t.shooting = 200)
        })) : this.yOffset < -48 && (this.yOffset += .5,
        -48 <= this.yOffset && (runner.timeMulti = 1,
        runner.noClip = !1,
        runner.tRex.noJump = !1,
        this.state = "inactive"))
    }
}, {
    id: "chem",
    name: "Chemical Warfare",
    type: "other",
    flavor: "Illegal under multiple international treaties.",
    frameSpeed: 100,
    animationLoop: !1,
    stillFrameFilename: "blank.gif",
    duration: 36e5,
    maxUses: 10000000000000,
    onActivate: function() {
        this.planeAnimator = new Animator(["chem_plane_0.png", "chem_plane_1.png"],100,!0),
        this.planeAnimator.useInternalTime = !0,
        this.planeAnimator.start(),
        this.planeX = -144
    },
    onUpdate: function() {
        if ("active" == this.state) {
            if (this.planeX += 2,
            600 < this.planeX)
                return void (this.state = "inactive");
            var e;
            drawImage(this.planeAnimator.getCurrentFrame(), this.planeX, 0, 144, 144),
            100 < this.planeX && !Math.floor(10 * Math.random()) && (e = new Projectile({
                destroyType: "grenade",
                frameFilenames: .5 < Math.random() ? ["chem_cloud_0.png", "chem_cloud_1.png"] : ["chem_cloud_1.png", "chem_cloud_0.png"],
                frameSpeed: 100 + 200 * Math.random(),
                xOffset: 0,
                yOffset: 0,
                xVelocity: 2 * Math.random() - 1,
                yVelocity: Math.random() + .5,
                width: 35,
                height: 35,
                hitBox: {
                    x: 0,
                    y: 5,
                    width: 35,
                    height: 20
                }
            },this.planeX,50 + 20 * Math.random()),
            projectiles.push(e))
        }
    }
}, {
    id: "meteor",
    name: "Meteor",
    type: "other",
    flavor: "It’s a meteor. And what do meteors do?",
    frameSpeed: 100,
    animationLoop: !1,
    stillFrameFilename: "blank.gif",
    duration: 36e5,
    maxUses: 10000000000000,
    onActivate: function() {
        this.landed = !1,
        this.meteorAnimator = new Animator(["meteor_fall_0.png", "meteor_fall_1.png"],100,!0),
        this.meteorAnimator.useInternalTime = !0,
        this.meteorAnimator.start(),
        this.meteorX = 0,
        this.meteorY = -144
    },
    onUpdate: function(e) {
        var t = this;
        "active" == this.state && (this.landed || (this.meteorX += 1,
        this.meteorY += 1,
        66 <= this.meteorY && (this.landed = !0,
        runner.horizon.obstacles.forEach(function(e) {
            e.destroyed || e.destroy("meteor")
        }),
        this.meteorAnimator.setFrames(["meteor_crash_1.png"]),
        setTimeout(function() {
            runner.die = !0,
            runner.score += 1e5,
            setTimeout(function() {
                t.state = "inactive"
            }, 100)
        }, 100))),
        this.meteorAnimator.update(e),
        drawImage(this.meteorAnimator.getCurrentFrame(), this.meteorX, this.meteorY, 144, 144))
    }
}, {
    id: "downers",
    name: "Downers",
    type: "other",
    flavor: "Get Sloowwwwww",
    frameSpeed: 100,
    animationLoop: !1,
    stillFrameFilename: "blank.gif",
    duration: 36e5,
    unlimited: !1,
    maxUses: 1,
    onActivate: function() {
        this.startTime = performance.now()
    },
    onUpdate: function() {
        var e, t;
        "active" == this.state && (t = (e = performance.now() - this.startTime) / 1e4 * .8 + .2,
        1e4 <= e && (this.state = "inactive",
        t = 1),
        runner.timeMulti = t)
    }
}, {
    id: "uppers",
    name: "Uppers",
    type: "other",
    flavor: "Gotta Go Fast!",
    frameSpeed: 100,
    animationLoop: !1,
    stillFrameFilename: "blank.gif",
    duration: 36e5,
    unlimited: !1,
    maxUses: 1,
    onActivate: function() {
        this.startTime = performance.now()
    },
    onUpdate: function() {
        var e, t;
        "active" == this.state && (t = 3 - (e = performance.now() - this.startTime) / 1e4 * 2,
        1e4 <= e && (this.state = "inactive",
        t = 1),
        runner.timeMulti = t)
    }
}, {
    id: "portal",
    name: "Portal Gun",
    type: "other",
    flavor: "The cake is a lie.",
    frameSpeed: 100,
    animationLoop: !1,
    frameFilenames: ["portal_gun.png"],
    duration: 1e3,
    maxUses: 10000000000000,
    projectile: {
        frameFilenames: ["portal_ray_0.png", "portal_ray_1.png"],
        frameSpeed: 100,
        width: 18,
        height: 26,
        xOffset: 40,
        yOffset: 12,
        xVelocity: 10,
        yVelocity: 0,
        hitBox: {
            x: 2,
            y: 0,
            width: 13,
            height: 22
        },
        onHit: function(e) {
            portal = new Portal(e)
        }
    }
}, {
    id: "cig",
    name: "Cigarette",
    type: "melee",
    flavor: "WARNING: according to the surgeon general, smoking may be hazardous for your health.",
    frameSpeed: 100,
    frameFilenames: ["cig_off_0.png", "cig_off_1.png"],
    duration: 1e3,
    animationLoop: !0,
    destroyType: "flame",
    xOffset: -1,
    unlimited: !0,
    alwaysAnimate: !0,
    hitBox: {
        x: 40,
        y: 58,
        width: 15,
        height: 6
    },
    onActivate: function() {
        runner.tRex.hideDino = !0,
        this.dinoAnimator ? this.purpleness++ : (this.purpleness = 0,
        this.dinoAnimator = new Animator(["purple_0_0.png", "purple_0_1.png"],100,!0),
        this.dinoAnimator.start()),
        11 < this.purpleness ? (this.dinoAnimator.setFrames(["cancer.png"]),
        this.animator.setFrames(["blank.gif"]),
        runner.tRex.hideDeath = !0,
        setTimeout(function() {
            runner.die = !0
        }, 200)) : (this.animator.setFrames(["cig_on_0.png", "cig_on_1.png"]),
        this.dinoAnimator.setFrames(["purple_".concat(this.purpleness, "_0.png"), "purple_".concat(this.purpleness, "_1.png")]))
    },
    onUpdate: function(e) {
        this.dinoAnimator && (this.dinoAnimator.update(e),
        drawImage(this.dinoAnimator.getCurrentFrame(), runner.tRex.xPos + this.xOffset, runner.tRex.yPos + this.yOffset, this.width, this.height))
    },
    onDeactivate: function() {
        "inactive" == this.state && this.animator.setFrames(["cig_off_0.png", "cig_off_1.png"])
    }
}, {
    id: "hammer",
    name: "Hammer",
    type: "melee",
    flavor: "We’d tell you whose hammer this is but the copyright would kill us.",
    frameSpeed: 100,
    frameFilenames: ["hammer_0.png", "hammer_1.png"],
    animationLoop: !0,
    duration: 8e3,
    destroyType: "hammer",
    maxTime: 8e3,
    hitBox: {
        x: 50,
        y: 50,
        width: 15,
        height: 30
    }
}]
  , weaponConfigsById = {};
weaponConfigs.forEach(function(e) {
    weaponConfigsById[e.id] = e
});
var keyBindings = {
    81: "sword",
    87: "handgun",
    69: "flipflop",
    82: "flamethrower",
    84: "shuriken",
    89: "scream",
    85: "chainsaw",
    73: "helicopter",
    79: "halberd",
    80: "kick",
    65: "cig",
    68: "double",
    70: "salute",
    71: "holywater",
    72: "portal",
    74: "grenade",
    75: "downers",
    76: "uppers",
    83: "rifle",
    90: "meteor",
    88: "laser",
    67: "chem",
    86: "bat",
    66: "bow",
    78: "tank",
    77: "hammer"
}
  , reverseKeyBindings = {};
Object.keys(keyBindings).forEach(function(e) {
    reverseKeyBindings[keyBindings[e]] = e
});
var unlockableWeapons = ["rifle", "scream", "bow", "handgun", "flipflop", "chainsaw", "double", "shuriken", "downers", "grenade", "kick", "salute", "hammer", "cig", "holywater", "portal", "uppers", "halberd", "chem", "bat", "flamethrower", "laser", "sword"]
  , weaponStages = []
  , projectiles = [];
function drawImage(e, t, n, a, i) {
    e && e.width && e.height && runner.canvasCtx.drawImage(e, t, n, a, i)
}
function WeaponBox() {
    var o = this;
    this.x = 1200,
    this.y = 80 + Math.floor(10 * Math.random()),
    this.time = 0;
    for (var e = 3e5 / weaponStages.length, t = performance.now() - weaponManager.startTime, n = Math.floor(t / e), a = [], i = 0; i <= n && i < weaponStages.length; i++)
        weaponStages[i].forEach(function(e) {
            a.push(e)
        });
    try {
        localStorage.getItem("heli") && a.push("helicopter")
    } catch (e) {}
    10 <= runner.goldKills && a.push("tank");
    var r = 0;
    Object.keys(weaponManager.weapons).forEach(function(e) {
        weaponManager.weapons[e] && r++
    }),
    25 <= r && a.push("meteor");
    var s = [];
    a.forEach(function(e) {
        var t = weaponConfigsById[e]
          , n = weaponManager.weapons[e];
        n && n.isUsable() || s.push(t)
    }),
    console.log(s.map(function(e) {
        return e.id
    }).join(","));
    function l() {
        if (s.length) {
            var e;
            if (1 == s.length)
                e = s[0];
            else
                for (; (e = s[Math.floor(s.length * Math.random())]) == o.config; )
                    ;
            o.config = e,
            o.image = loadImage("images/icons2/".concat(o.config.id, ".png"))
        }
    }
    this.draw = function() {
        drawImage(o.image, o.x, o.y + Math.floor(5 * Math.sin(performance.now() / 100)), 24, 24)
    }
    ,
    this.update = function(e) {
        var t, n, a, i;
        s.length ? (o.time += e,
        250 < o.time && (o.time -= 250,
        l()),
        o.x -= Math.floor(runner.currentSpeed * FPS / 1e3 * e),
        o.x < -30 && (weaponBox = null),
        t = new CollisionBox(runner.tRex.xPos + 1,runner.tRex.yPos + 1,runner.tRex.config.WIDTH - 2,runner.tRex.config.HEIGHT - 2),
        n = new CollisionBox(o.x,o.y,24,24),
        a = boxCompare(t, n),
        window.debug && drawCollisionBoxes(runner.canvasCtx, t, n),
        a ? (console.log(o.config.id),
        runner.addRecord("got " + o.config.id),
        (i = weaponManager.weapons[o.config.id]) ? o.config.unlimited ? i.unlimited = !0 : i.maxUses ? i.uses = i.maxUses : i.maxTime && (i.timeUsed = 0) : (i = new Weapon(o.config),
        weaponManager.weapons[o.config.id] = i),
        weaponBox = null,
        weaponManager.updateCallback && weaponManager.updateCallback(i)) : o.draw()) : weaponBox = null
    }
    ,
    l()
}
function Portal(e) {
    var i = this;
    this.obstacle = e,
    this.inPortal = !1,
    this.entranceAnimator = new Animator(["portal_entrance_0.png", "portal_entrance_1.png", "portal_entrance_2.png"],100,!1,!1),
    this.entranceAnimator.start(),
    this.exitAnimator = new Animator(["portal_exit_0.png", "portal_exit_1.png", "portal_exit_2.png"],100,!1,!1),
    this.exitAnimator.start(),
    this.draw = function() {
        drawImage(i.entranceAnimator.getCurrentFrame(), i.x, i.y, 21, 72.5),
        drawImage(i.exitAnimator.getCurrentFrame(), i.eX, i.y, 21, 72.5)
    }
    ,
    this.update = function(e) {
        var t, n, a;
        i.obstacle.remove && (i.remove = !0),
        i.x = i.obstacle.xPos - 15,
        i.eX = i.x + 5 + i.obstacle.width,
        i.y = Math.min(i.obstacle.yPos - 10, 125),
        i.inPortal ? runner.tRex.xPos > i.eX && (i.inPortal = !1,
        i.hitExit = !1,
        runner.tRex.hideDino = !1,
        runner.tRex.noJump = !1,
        runner.noClip = !1) : (t = new CollisionBox(runner.tRex.xPos + 1,runner.tRex.yPos + 1,runner.tRex.config.WIDTH - 2,runner.tRex.config.HEIGHT - 2),
        n = new CollisionBox(i.x,i.y,20,75),
        a = boxCompare(t, n),
        window.debug && drawCollisionBoxes(runner.canvasCtx, t, n),
        a && (runner.tRex.jumpVelocity = 0,
        i.inPortal = !0,
        i.hitExit = !1,
        runner.tRex.hideDino = !0,
        runner.tRex.noJump = !0,
        runner.noClip = !0)),
        i.entranceAnimator.update(e),
        i.exitAnimator.update(e),
        i.draw()
    }
}
function Animator(e) {
    var n = this
      , t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 100
      , a = 2 < arguments.length && void 0 !== arguments[2] && arguments[2]
      , i = !(3 < arguments.length && void 0 !== arguments[3]) || arguments[3];
    this.playing = !1,
    this.frames = [new Image],
    this.speed = t,
    this.loop = a,
    this.returnToFirst = i,
    this.time = 0,
    this.startTime = 0,
    this.useInternalTime = !1,
    this.setFrames = function(e) {
        var t = [];
        e.forEach(function(e) {
            t.push(loadImage("images/".concat(e)))
        }),
        n.frames = t
    }
    ,
    this.start = function() {
        n.time = 0,
        n.startTime = performance.now(),
        n.playing = !0
    }
    ,
    this.stop = function() {
        n.playing = !1,
        i && (n.time = 0,
        n.startTime = performance.now())
    }
    ,
    this.update = function(e) {
        n.playing && (n.useInternalTime ? n.time = performance.now() - n.startTime : e && (n.time += e))
    }
    ,
    this.getCurrentFrame = function() {
        n.useInternalTime && (n.time = performance.now() - n.startTime);
        var e = Math.floor(n.time / n.speed);
        return n.loop ? e %= n.frames.length : e > n.frames.length - 1 && (e = n.returnToFirst ? 0 : n.frames.length - 1,
        n.playing = !1),
        n.frames[e]
    }
    ,
    e && this.setFrames(e)
}
function Projectile(i, e, t) {
    var o = this;
    this.x = e + i.xOffset,
    this.y = t + i.yOffset,
    this.vX = i.xVelocity || 0,
    this.vY = i.yVelocity || 0,
    this.followX = i.followX || !1,
    this.gravity = i.gravity || 0,
    this.floor = i.floor || 0,
    this.destroyed = !1,
    i.frameFilenames && (this.animator = new Animator(i.frameFilenames,i.frameSpeed || 100,!0),
    this.animator.start()),
    this.draw = function() {
        o.animator ? drawImage(o.animator.getCurrentFrame(), o.x, o.y, i.width, i.height) : (runner.canvasCtx.fillStyle = "#888",
        runner.canvasCtx.fillRect(o.x, o.y, 8, 5))
    }
    ,
    this.update = function(e) {
        var a;
        o.animator && o.animator.update(e),
        o.x += .06 * o.vX * e,
        o.y += .06 * o.vY * e,
        o.followX && (o.x -= Math.floor(runner.currentSpeed * FPS / 1e3 * e)),
        o.vY += .06 * o.gravity * e,
        o.draw(),
        a = i.hitBox ? new CollisionBox(o.x + i.hitBox.x,o.y + i.hitBox.y,i.hitBox.width,i.hitBox.height) : new CollisionBox(o.x,o.y,8,5),
        runner.horizon.obstacles.forEach(function(e) {
            var t, n;
            e.destroyed || (t = createAdjustedCollisionBox(e.collisionBoxes[0], {
                x: e.xPos,
                y: e.yPos
            }),
            n = boxCompare(a, t),
            window.debug && drawCollisionBoxes(runner.canvasCtx, a, t),
            n && (i.destroyType && e.destroy(i.destroyType),
            i.onHit && i.onHit.bind(o)(e),
            o.destroyed = !0))
        }),
        o.floor && o.y > o.floor && (o.destroyed = !0),
        o.destroyed && i.onDestroy && i.onDestroy.bind(o)()
    }
}
function Weapon(e) {
    var o = this;
    this.id = e.id,
    this.name = e.name,
    this.type = e.type,
    this.flavor = e.flavor,
    this.destroyType = e.destroyType,
    this.duration = e.duration,
    !this.duration && e.frameSpeed && e.frameFilenames && (this.duration = e.frameSpeed * e.frameFilenames.length),
    this.xOffset = e.xOffset || 0,
    this.yOffset = null == e.yOffset ? -48 : e.yOffset,
    this.width = e.width || 96,
    this.height = e.height || 96,
    this.hitBox = e.hitBox,
    this.hideDino = e.hideDino || !1,
    this.hideDeath = e.hideDeath || !1,
    this.hold = e.hold || !1,
    this.onActivate = e.onActivate ? e.onActivate.bind(this) : null,
    this.onUpdate = e.onUpdate ? e.onUpdate.bind(this) : null,
    this.onDeactivate = e.onDeactivate ? e.onDeactivate.bind(this) : null,
    this.time = 0,
    this.alwaysAnimate = e.alwaysAnimate,
    this.maxUses = e.maxUses,
    this.uses = e.maxUses,
    this.unlimited = e.unlimited,
    this.maxTime = e.maxTime,
    this.timeUsed = 0,
    this.projectile = e.projectile,
    this.state = "inactive",
    e.frameFilenames && (this.animator = new Animator(e.frameFilenames,e.frameSpeed,e.animationLoop)),
    e.stillFrameFilename && (this.stillImage = loadImage("images/".concat(e.stillFrameFilename))),
    this.update = function(e) {
        var t, n, a, i;
        o.animator && o.animator.update(e),
        "active" == o.state && (o.time += e,
        o.timeUsed += e,
        o.maxTime && o.timeUsed > o.maxTime && (o.state = "inactive",
        o.onDeactivate && o.onDeactivate(),
        weaponManager.updateCallback && weaponManager.updateCallback())),
        o.time > o.duration && (o.state = "inactive",
        o.onDeactivate && o.onDeactivate()),
        "inactive" == o.state && o.animator && !o.alwaysAnimate && o.animator.stop(),
        o.onUpdate && o.onUpdate(e),
        o.hideDino && (runner.tRex.hideDino = !1),
        o.hideDeath && (runner.tRex.hideDeath = !1),
        "active" == o.state && (o.hideDino && (runner.tRex.hideDino = !0),
        o.hideDeath && (runner.tRex.hideDeath = !0),
        "melee" == o.type && o.hitBox && (t = new CollisionBox(runner.tRex.xPos + o.hitBox.x + o.xOffset,runner.tRex.yPos + o.hitBox.y + o.yOffset,o.hitBox.width,o.hitBox.height),
        (n = runner.horizon.obstacles[0]) && !n.destroyed && (a = createAdjustedCollisionBox(n.collisionBoxes[0], {
            x: n.xPos,
            y: n.yPos
        }),
        i = boxCompare(t, a),
        window.debug && drawCollisionBoxes(runner.canvasCtx, t, a),
        i && n.destroy(o.destroyType)))),
        "active" != o.state && !o.isUsable() || o.draw()
    }
    ,
    this.shoot = function() {
        var e = new Projectile(o.projectile,runner.tRex.xPos,runner.tRex.yPos);
        projectiles.push(e)
    }
    ,
    this.isUsable = function() {
        return !!o.unlimited || (!!(o.maxTime && o.timeUsed < o.maxTime) || 0 < o.uses)
    }
    ,
    this.activate = function() {
        if ("inactive" == o.state) {
            if (!o.unlimited)
                if (0 < o.uses)
                    o.uses--,
                    o.uses < 1 && weaponManager.updateCallback && weaponManager.updateCallback();
                else if (!(o.maxTime && o.timeUsed < o.maxTime))
                    return;
            o.animator && o.animator.start(),
            runner.addRecord("activate " + o.id),
            o.state = "active",
            o.time = 0,
            o.onActivate && o.onActivate(),
            o.projectile && setTimeout(o.shoot, o.projectile.delay || 0),
            weaponUseCount[o.id] = (weaponUseCount[o.id] || 0) + 1
        }
    }
    ,
    this.deactivate = function() {
        o.onDeactivate && o.onDeactivate(),
        o.hold && (o.state = "inactive")
    }
    ,
    this.draw = function(e) {
        portal && portal.inPortal || (e || (o.animator && (e = o.animator.getCurrentFrame()),
        o.stillImage && "inactive" == o.state && (e = o.stillImage)),
        e && drawImage(e, runner.tRex.xPos + o.xOffset, runner.tRex.yPos + o.yOffset, o.width, o.height))
    }
}
function WeaponManager() {
    var l = this;
    this.weapons = {},
    this.currentWeapon = null,
    this.startTime = performance.now(),
    this.key = null,
    window.addEventListener("keydown", function(e) {
        l.key = e.which;
        keyBindings[l.key]
    }),
    window.addEventListener("keyup", function(e) {
        l.key = null
    }),
    this.addRecord = function() {}
    ,
    this.reset = function() {
        l.startTime = performance.now(),
        weaponUseCount = {},
        runner.timeMulti = 1,
        runner.tRex.hideDino = !1,
        runner.tRex.hideDeath = !1,
        l.uuid = uuidv4(),
        l.lastPing = 0,
        runner.addRecord("start " + l.uuid),
        weaponStages = [[]];
        for (var e = unlockableWeapons.slice(0); e.length; ) {
            var t = weaponStages[weaponStages.length - 1];
            2 < t.length && (t = [],
            weaponStages.push(t));
            var n = e.splice(Math.floor(Math.random() * e.length), 1)[0];
            t.push(n)
        }
        Object.keys(l.weapons).forEach(function(e) {
            var t = l.weapons[e];
            t && (t.state = "inactive",
            t.dinoAnimator = null,
            t.unlimited && (t.unlimited = !1),
            t.maxUses && (t.uses = 0),
            t.maxTime && (t.timeUsed = t.maxTime))
        }),
        weaponManager.updateCallback && weaponManager.updateCallback(),
        projectiles.forEach(function(e) {
            e.destroyed = !0
        }),
        l.currentWeapon = null,
        weaponBox = new WeaponBox
    }
    ,
    this.update = function(n) {
        if (!runner || runner.runningTime) {
            5e3 < performance.now() - l.lastPing && (l.addRecord("ping"),
            l.lastPing = performance.now());
            var e = keyBindings[l.key]
              , t = l.weapons[e];
            if (t && t.isUsable()) {
                if (runner.paused)
                    return;
                l.currentWeapon && l.currentWeapon.id != e && "active" == l.currentWeapon.state || ("cig" != e && (runner.tRex.hideDino = !1,
                runner.tRex.hideDeath = !1),
                l.currentWeapon = l.weapons[e],
                l.currentWeapon.activate(),
                weaponManager.updateCallback && weaponManager.updateCallback())
            } else
                l.currentWeapon && "active" == l.currentWeapon.state && l.currentWeapon.deactivate();
            l.currentWeapon && l.currentWeapon.update(n);
            var a, i, o, r, s = [];
            projectiles.forEach(function(e) {
                e.update(n);
                var t = !1;
                e.x > runner.dimensions.WIDTH && (t = !0),
                e.destroyed && (t = !0),
                t || s.push(e)
            }),
            projectiles = s,
            runner && (portal && (portal.update(n),
            portal.remove && (portal = null)),
            l.currentWeapon && l.currentWeapon.isUsable() && (a = l.currentWeapon.maxUses || 0,
            i = l.currentWeapon.uses || 0,
            l.currentWeapon.maxTime && (i = (a = Math.round(l.currentWeapon.maxTime / 1e3)) - Math.round(l.currentWeapon.timeUsed / 1e3)),
            a && i && (o = "".concat(i, " / ").concat(a),
            runner.canvasCtx.font = "15px DogicaPixelBold",
            runner.canvasCtx.fillStyle = "#494949",
            r = runner.canvasCtx.measureText(o).width,
            runner.canvasCtx.fillText(o, runner.dimensions.WIDTH - r, 40))),
            weaponBox ? weaponBox.update(n) : Math.floor(300 * Math.random()) || (weaponBox = new WeaponBox))
        }
    }
}
var weaponManager = new WeaponManager;
