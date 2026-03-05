import pygame, random, math, time, sys, json, os
# ----------------------
# Setup
# ----------------------
WIDTH, HEIGHT = 1000, 400
GROUND_Y = 320
 
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Ultimate Extreme DinoCombat")
clock = pygame.time.Clock()
font = pygame.font.SysFont("courier", 22, bold=True)
 
# Colors
WHITE=(255,255,255)
BLACK=(0,0,0)
RED=(255,0,0)
GREEN=(0,255,0)
BLUE=(50,50,255)
YELLOW=(255,255,0)
CYAN=(0,255,255)
ORANGE=(255,165,0)
PURPLE=(180,0,180)
#leaderboard
LEADERBOARD_FILE = "leaderboard.json"
 
def load_leaderboard():
    if os.path.exists(LEADERBOARD_FILE):
        with open(LEADERBOARD_FILE, "r") as f:
            return json.load(f)
    return []
 
def save_score(name, score):
    board = load_leaderboard()
    board.append({"name": name, "score": int(score)})
 
    board = sorted(board,
                   key=lambda x: x["score"],
                   reverse=True)[:10]
 
    with open(LEADERBOARD_FILE, "w") as f:
        json.dump(board, f)
def username_screen():
 
    name = ""
    entering = True
 
    while entering:
        clock.tick(60)
        screen.fill(WHITE)
 
        screen.blit(
            font.render("ENTER USERNAME", True, BLACK),
            (360,120)
        )
 
        pygame.draw.rect(screen, BLACK,
                         (300,180,400,40),2)
 
        screen.blit(
            font.render(name, True, BLUE),
            (310,185)
        )
 
        screen.blit(
            font.render("Press ENTER to continue",
                        True, BLACK),
            (330,240)
        )
 
        pygame.display.update()
 
        for e in pygame.event.get():
 
            if e.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
 
            if e.type == pygame.KEYDOWN:
 
                if e.key == pygame.K_RETURN and name:
                    return name
 
                elif e.key == pygame.K_BACKSPACE:
                    name = name[:-1]
 
                elif len(name) < 12:
                    name += e.unicode
def leaderboard_screen():
 
    viewing = True
    board = load_leaderboard()
 
    while viewing:
        clock.tick(60)
        screen.fill(WHITE)
 
        screen.blit(
            font.render("GLOBAL LEADERBOARD",
                        True, RED),
            (320,60)
        )
 
        for i,entry in enumerate(board):
            text = f"{i+1}. {entry['name']} - {entry['score']}"
            screen.blit(
                font.render(text,True,BLACK),
                (350,130+i*30)
            )
 
        screen.blit(
            font.render("ESC to return",
                        True,BLACK),
            (380,330)
        )
 
        pygame.display.update()
 
        for e in pygame.event.get():
            if e.type==pygame.QUIT:
                pygame.quit()
                sys.exit()
 
            if e.type==pygame.KEYDOWN:
                if e.key==pygame.K_ESCAPE:
                    viewing=False
# ----------------------
# Weapon Class (FIXED)
# ----------------------
class Weapon:
    def __init__(self,name,damage,durability,length,color,range_type="melee"):
        self.name=name
        self.damage=damage
        self.max_durability=durability
        self.durability=durability
        self.length=length
        self.color=color
        self.range_type=range_type
        self.swinging=False
        self.swing_timer=0
        self.swing_duration=10
        self.swing_angle=0
        self.projectiles=[]
        self.broken=False
 
    def swing(self, owner):
        # ❌ Cannot use if broken
        if self.broken:
            return
 
        # ❌ Cannot use if already swinging
        if self.swinging:
            return
 
        # ❌ Cannot use if durability is 0
        if self.durability <= 0:
            self.broken = True
            return
 
        self.swinging=True
        self.swing_timer=self.swing_duration
        self.swing_angle=-60
 
        # Reduce durability safely
        self.durability = max(0, self.durability - 1)
 
        # If durability just hit 0 → break weapon
        if self.durability == 0:
            self.broken = True
 
        # Ranged shooting
        if self.range_type=="ranged":
            self.projectiles.append(
                Projectile(owner.centerx, owner.centery, 10)
            )
 
    def update(self):
        if self.swinging:
            self.swing_timer-=1
            self.swing_angle+=12
            if self.swing_timer<=0:
                self.swinging=False
 
# ----------------------
# Particle Class
# ----------------------
class Particle:
    def __init__(self,x,y,dx,dy,color,lifetime):
        self.x=x; self.y=y; self.dx=dx; self.dy=dy
        self.color=color; self.lifetime=lifetime
    def update(self):
        self.x+=self.dx; self.y+=self.dy; self.lifetime-=1
    def draw(self,surf):
        if self.lifetime>0: pygame.draw.circle(surf,self.color,(int(self.x),int(self.y)),3)
 
# ----------------------
# Projectile Class
# ----------------------
class Projectile:
    def __init__(self, x, y, dx):
        self.rect = pygame.Rect(x, y, 10, 10)
        self.dx = dx
 
    def update(self):
        old_x = self.rect.x
        self.rect.x += self.dx
 
        # return movement path rectangle
        travel_rect = pygame.Rect(
            min(old_x, self.rect.x),
            self.rect.y,
            abs(self.dx) + self.rect.width,
            self.rect.height
        )
 
        return travel_rect
# ----------------------
# Pickup Class
# ----------------------
class Pickup:
    def __init__(self,type_,x,y):
        self.type=type_
        self.rect=pygame.Rect(x,y,25,25)
        if type_=="weapon":
            base = random.choice(weapons)
            self.weapon = Weapon(
                base.name,
                base.damage,
                base.max_durability,
                base.length,
                base.color,
                base.range_type
        )
            self.weapon.durability=self.weapon.max_durability
        elif type_=="health":
            self.amount=25
        elif type_=="upgrade":
            self.points=1
 
# ----------------------
# Game Over Screen
# ----------------------
def game_over_screen():
    while True:
        clock.tick(60)
        screen.fill(WHITE)
        screen.blit(font.render("GAME OVER",True,RED),(WIDTH//2-80,HEIGHT//2-40))
        screen.blit(font.render("Press R to Restart",True,BLACK),(WIDTH//2-120,HEIGHT//2))
        screen.blit(font.render("Press Q to Quit",True,BLACK),(WIDTH//2-110,HEIGHT//2+40))
        pygame.display.update()
        for event in pygame.event.get():
            if event.type==pygame.QUIT: pygame.quit(); exit()
            if event.type==pygame.KEYDOWN:
                if event.key==pygame.K_r: return
                if event.key==pygame.K_q: pygame.quit(); exit()
 
# ----------------------
# Upgrade Menu
# ----------------------
def upgrade_menu():
    global upgrade_points, upgrade_cost, player_max_health, player_speed, active_weapon, upgrade_multiplier
    menu=True
    while menu:
        screen.fill(WHITE)
        screen.blit(font.render(f"Upgrade Points: {int(upgrade_points)}",True,RED),(100,50))
        upgrades=[
            f"1: Increase Max Health (+20) - Cost: {upgrade_cost}",
            f"2: Increase Speed (+1) - Cost: {upgrade_cost}",
            f"3: Increase Weapon Damage (+5) - Cost: {upgrade_cost}",
            f"4: Increase Weapon Durability (+5) - Cost: {upgrade_cost}",
            f"5: Upgrade Upgrade Points Gain (+1) - Cost: {upgrade_cost}",
            "ESC: Exit"
        ]
        for i,text in enumerate(upgrades):
            screen.blit(font.render(text,True,BLACK),(100,100+i*30))
        pygame.display.update()
        for event in pygame.event.get():
 
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()
 
            if event.type == pygame.KEYDOWN:
 
                # ---------- EXIT MENU ----------
                if event.key == pygame.K_ESCAPE:
 
                    for t in range(3, 0, -1):
                        start_time = pygame.time.get_ticks()
                        waiting = True
 
                        while waiting:
                            clock.tick(60)
 
                            for e in pygame.event.get():
                                if e.type == pygame.QUIT:
                                    pygame.quit()
                                    exit()
 
                            screen.fill(WHITE)
                            screen.blit(
                                font.render(f"Resuming in {t}", True, RED),
                                (WIDTH//2-70, HEIGHT//2)
                            )
                            pygame.display.update()
 
                            if pygame.time.get_ticks() - start_time >= 1000:
                                waiting = False
 
                    menu = False
 
 
                # ---------- BUY UPGRADES ----------
                elif upgrade_points >= upgrade_cost:
 
                    if event.key == pygame.K_1:
                        player_max_health += 20
 
                    elif event.key == pygame.K_2:
                        player_speed += 1
 
                    elif event.key == pygame.K_3:
                        active_weapon.damage += 5
 
                    elif event.key == pygame.K_4:
                        active_weapon.max_durability += 5
                        active_weapon.durability += 5
 
                    elif event.key == pygame.K_5:
                        upgrade_multiplier += 0.5
 
                    else:
                        continue
 
                    upgrade_points -= upgrade_cost
                    upgrade_cost = int(upgrade_cost * 1.1)                    # wait 1 second WITHOUT freezing game
 
# ----------------------
# Weapons
# ----------------------
sword=Weapon("Sword",20,20,60,RED)
spear=Weapon("Spear",30,10,80,YELLOW)
hammer=Weapon("Hammer",50,5,50,BLUE)
gun_67=Weapon("67 Gun",67,50,50,GREEN, range_type="ranged")
weapons=[sword,spear,hammer,gun_67]
active_weapon = Weapon(
    sword.name,
    sword.damage,
    sword.max_durability,
    sword.length,
    sword.color,
    sword.range_type
)
 
# ----------------------
# Game Reset
# ----------------------
def reset_game():
    global player, player_health, player_max_health, player_speed
    global vel_y, on_ground, can_double_jump, dash_timer
    global active_weapon, score, game_speed
    global boss, cacti, birds, projectiles, pickups, particles
    global damage_cooldown, upgrade_points, upgrade_cost, upgrade_multiplier
 
    player = pygame.Rect(100,GROUND_Y,44,44)
    player_health = 100
    player_max_health = 100
    player_speed = 4
    vel_y = 0
    on_ground = True
    can_double_jump = True
    dash_timer = 0
 
    active_weapon = Weapon(
        sword.name,
        sword.damage,
        sword.max_durability,
        sword.length,
        sword.color,
        sword.range_type
    )
    active_weapon.durability=active_weapon.max_durability
    active_weapon.projectiles=[]
 
    cacti=[pygame.Rect(900+i*500,GROUND_Y,25,45) for i in range(3)]
    birds=[pygame.Rect(1200+i*600,250,40,30) for i in range(2)]
    boss={"rect":pygame.Rect(1800,250,100,100),"health":600,"phase":1}
    projectiles=[]
    pickups=[]
    particles=[]
    score=0
    game_speed=4
    damage_cooldown=0
 
    upgrade_points=0
    upgrade_cost=1
    upgrade_multiplier=1
 
reset_game()
# -------------------
# MENUS
# -------------------
def controls_menu():
    viewing=True
    text=[
        "CONTROLS",
        "",
        "A/D - Move",
        "W - Jump/Double Jump",
        "F - Shoot (67 Gun)/attack",
        "U - Upgrade Menu",
        "P - Pause"
    ]
 
    while viewing:
        screen.fill(WHITE)
 
        for i,line in enumerate(text):
            screen.blit(font.render(line,True,BLACK),
                        (350,120+i*40))
 
        pygame.display.update()
 
        for e in pygame.event.get():
            if e.type==pygame.QUIT:
                pygame.quit();sys.exit()
 
            if e.type==pygame.KEYDOWN:
                if e.key==pygame.K_ESCAPE:
                    viewing=False
 
 
def main_menu():
 
    options = ["Start Game","Leaderboard","Controls","Quit"]
    selected = 0
 
    while True:
        clock.tick(60)
        screen.fill(WHITE)
 
        title = font.render(
            "ULTIMATE DINOCOMBAT", True, RED)
        screen.blit(title, (320, 80))
 
        for i, opt in enumerate(options):
            color = GREEN if i == selected else BLACK
            screen.blit(
                font.render(opt, True, color),
                (420, 200 + i * 50)
            )
 
        pygame.display.update()
 
        for e in pygame.event.get():
 
            if e.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
 
            if e.type == pygame.KEYDOWN:
 
                if e.key in (pygame.K_w, pygame.K_UP):
                    selected = (selected - 1) % len(options)
 
                if e.key in (pygame.K_s, pygame.K_DOWN):
                    selected = (selected + 1) % len(options)
 
                if selected == 0:
                    username = username_screen()
                    return "game", username
 
                elif selected == 1:
                    leaderboard_screen()
 
                elif selected == 2:
                    controls_menu()
 
                elif selected == 3:
                    pygame.quit()
                    sys.exit()
# ----------------------
# Timers
# ----------------------
pygame.time.set_timer(pygame.USEREVENT,2000)       # Boss projectile
pygame.time.set_timer(pygame.USEREVENT+1,8000)     # Pickup spawn
 
# ----------------------
# Constants
# ----------------------
gravity=0.6
jump_power=-14
double_jump_power=-11
health_regen_rate=0.03
invincible_time=30
paused=False
screen_shake=0
dash_timer=0
damage_cooldown=0
game_state = "menu"
# ----------------------
# Main Loop
# ----------------------
running=True
while running:
    if game_state == "menu":
        result = main_menu()
        game_state, player_name = result
        reset_game()
        continue
 
    dt = clock.tick(60) / 16.67
    screen.fill(WHITE)
    for event in pygame.event.get():
        if event.type == pygame.QUIT: running=False
 
        if event.type == pygame.KEYDOWN:
            if event.key==pygame.K_p: paused=not paused
            if event.key==pygame.K_w:
                if on_ground:
                    vel_y=jump_power
                    on_ground=False
                    can_double_jump=True
                elif can_double_jump:
                    vel_y=double_jump_power
                    can_double_jump=False
            if event.key==pygame.K_f: active_weapon.swing(player)
            if event.key==pygame.K_u: upgrade_menu()
 
        if event.type==pygame.USEREVENT:
            speed=-6 if boss["phase"]==1 else -9
            projectiles.append(Projectile(boss["rect"].x,boss["rect"].centery,speed))
 
        if event.type==pygame.USEREVENT+1:
            x=random.randint(400,WIDTH-50)
            crate_type=random.choice(["weapon","health","upgrade"])
            pickups.append(Pickup(crate_type,x,GROUND_Y))
 
    if not paused:
        if damage_cooldown>0: damage_cooldown-=1
 
        # Movement
        keys = pygame.key.get_pressed()
        move_speed = int(player_speed * dt)
 
        # LEFT
        if keys[pygame.K_a]:
            player.x -= move_speed
 
        # RIGHT
        if keys[pygame.K_d]:
            player.x += move_speed
 
        # DOWN (fast drop)
        if keys[pygame.K_s]:
            player.y += move_speed
        # Gravity
        vel_y += gravity * dt
        player.y += int(vel_y * dt)
 
        # Clamp player position
        if player.x < 0: player.x = 0
        if player.x + player.width > WIDTH: player.x = WIDTH - player.width
        if player.y > GROUND_Y:
            player.y = GROUND_Y
            vel_y = 0
            on_ground = True
            can_double_jump = True
        if player.y < 0: player.y = 0; vel_y = 0
 
        # Weapon update
        active_weapon.update()
        # Health regen
        if player_health < player_max_health:
            player_health += health_regen_rate * dt
            if player_health > player_max_health: player_health = player_max_health
 
        # Move enemies
        for c in cacti:
            c.x -= game_speed*dt
            if c.x<-50: c.x=WIDTH+random.randint(0,400)
        for b in birds:
            b.x -= game_speed*dt+1
            if b.x<-50: b.x=WIDTH+random.randint(400,800)
        boss["rect"].x -= game_speed/3*dt
        if boss["rect"].x<-100: boss["rect"].x=1800; boss["health"]=600; boss["phase"]=1
 
        # Melee weapon attack
        if active_weapon.swinging and active_weapon.range_type=="melee" and not active_weapon.broken:
            angle_rad = math.radians(active_weapon.swing_angle)
            end_x = player.centerx + math.cos(angle_rad)*active_weapon.length
            end_y = player.centery + math.sin(angle_rad)*active_weapon.length
            attack_rect = pygame.Rect(min(player.centerx,end_x), min(player.centery,end_y),
                                      abs(end_x-player.centerx), abs(end_y-player.centery))
            for c in cacti+birds:
                if attack_rect.colliderect(c): c.x=-100
            if attack_rect.colliderect(boss["rect"]):
                boss["health"] -= active_weapon.damage
                screen_shake = 8
                if boss["health"]<=0:
                    pickups.append(Pickup("weapon",boss["rect"].x,boss["rect"].y))
                    pickups[-1].weapon = Weapon("Ultimate Sword",100,20,120,ORANGE)
                    boss["rect"].x = 1800; boss["health"]=600; boss["phase"]=1
                if boss["health"]<300: boss["phase"]=2
 
        # Ranged weapon projectiles
        if active_weapon.range_type == "ranged" and not active_weapon.broken:
 
            for proj in active_weapon.projectiles[:]:
 
                travel_rect = proj.update()
                hit = False
 
                # ===== BOSS HIT =====
                if travel_rect.colliderect(boss["rect"]):
                    boss["health"] -= active_weapon.damage
                    screen_shake = 8
                    hit = True
 
                    if boss["health"] <= 0:
                        pickups.append(
                            Pickup("weapon",
                                   boss["rect"].x,
                                   boss["rect"].y)
                        )
 
                        pickups[-1].weapon = Weapon(
                            "Ultimate Sword",100,20,120,ORANGE
                        )
 
                        boss["rect"].x = 1800
                        boss["health"] = 600
                        boss["phase"] = 1
 
                    elif boss["health"] < 300:
                        boss["phase"] = 2
 
                # ===== ENEMY HIT =====
                for enemy in cacti + birds:
                    if travel_rect.colliderect(enemy):
                        enemy.x = -100
                        screen_shake = 4
                        hit = True
                        break
 
                # ===== REMOVE BULLET =====
                if hit or proj.rect.x > WIDTH:
                    active_weapon.projectiles.remove(proj)
 
        # Damage from enemies
        for c in cacti+birds:
            if player.colliderect(c) and damage_cooldown==0: player_health-=15; damage_cooldown=invincible_time
        if player.colliderect(boss["rect"]) and damage_cooldown==0: player_health-=25; damage_cooldown=invincible_time
 
        for p in projectiles[:]:
            travel_rect = p.update()
            if p.rect.colliderect(player) and damage_cooldown==0: player_health-=20; damage_cooldown=invincible_time; projectiles.remove(p)
            elif p.rect.x<0: projectiles.remove(p)
 
        # Pickups
        for pickup in pickups[:]:
            if player.colliderect(pickup.rect):
 
                if pickup.type == "weapon":
                    active_weapon = pickup.weapon
                    active_weapon.projectiles = []
                    active_weapon.durability = active_weapon.max_durability
                    active_weapon.broken = False
                    active_weapon.durability = active_weapon.max_durability
                    active_weapon.broken = False
 
                elif pickup.type == "health":
                    player_health += pickup.amount
                    player_health = min(player_health, player_max_health)
 
                elif pickup.type == "upgrade":
                    upgrade_points += pickup.points * upgrade_multiplier
 
                pickups.remove(pickup)
        # Score
        score += 0.2*dt
        game_speed += 0.0003*dt
 
        # Game over
        if player_health <= 0:
            save_score(player_name, score)
            game_over_screen()
            reset_game()
            main_menu()
 
        # Update particles
        for particle in particles[:]:
            particle.update()
            if particle.lifetime<=0: particles.remove(particle)
 
    # ----------------------
    # Draw
    shake=random.randint(-5,5) if screen_shake>0 else 0
    if screen_shake>0: screen_shake-=1
    screen.fill(WHITE)
 
    # Player
    player_color=GREEN if damage_cooldown==0 else RED
    pygame.draw.rect(screen,player_color,player.move(shake,0))
 
    # Particles
    for particle in particles: particle.draw(screen)
 
    # Health bar
    pygame.draw.rect(screen,RED,(player.x,player.y-10,44,5))
    pygame.draw.rect(screen,GREEN,(player.x,player.y-10,44*(player_health/player_max_health),5))
 
    # Cacti
    for c in cacti: pygame.draw.rect(screen,BLACK,c.move(shake,0))
    # Birds
    for b in birds: pygame.draw.rect(screen,BLUE,b.move(shake,0))
    pygame.draw.rect(screen,RED,boss["rect"].move(shake,0))
 
    # Projectiles
    for p in projectiles: pygame.draw.rect(screen,ORANGE,p.rect.move(shake,0))
    for p in active_weapon.projectiles: pygame.draw.rect(screen,CYAN,p.rect.move(shake,0))
 
    # Pickups
    for p in pickups:
        color=PURPLE if p.type=="weapon" else CYAN if p.type=="health" else YELLOW
        pygame.draw.rect(screen,color,p.rect)
 
    # Sword swing animation
    if active_weapon.swinging and active_weapon.range_type=="melee":
        angle_rad = math.radians(active_weapon.swing_angle)
        end_x = player.centerx + math.cos(angle_rad)*active_weapon.length
        end_y = player.centery + math.sin(angle_rad)*active_weapon.length
        pygame.draw.line(screen,active_weapon.color,(player.centerx,player.centery),(end_x,end_y),5)
 
    # HUD
    screen.blit(font.render(f"Score: {int(score)}",True,BLACK),(800,20))
    weapon_text = f"{active_weapon.name} ({active_weapon.durability})"
    if active_weapon.broken:
        weapon_text += " - BROKEN"
 
    color = RED if active_weapon.broken else BLACK
    screen.blit(font.render(f"Weapon: {weapon_text}",True,color),(10,20))
    screen.blit(font.render(f"Boss HP: {int(boss['health'])}",True,RED),(400,20))
    screen.blit(font.render(f"Upgrade Points: {int(upgrade_points)}",True,RED),(10,50))
    if paused: screen.blit(font.render("PAUSED",True,RED),(WIDTH//2-60,HEIGHT//2))
 
    pygame.display.update()
