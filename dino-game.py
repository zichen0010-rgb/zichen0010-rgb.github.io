import pygame, random, math, sys, requests

# ----------------------
# BASIC SETUP
# ----------------------
WIDTH, HEIGHT = 1000, 400
GROUND_Y = 320

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Ultimate DinoCombat")
clock = pygame.time.Clock()
font = pygame.font.SysFont("courier",22,True)

WHITE=(255,255,255)
BLACK=(0,0,0)
RED=(255,0,0)
GREEN=(0,255,0)
BLUE=(50,50,255)
PURPLE=(180,0,180)

# ----------------------
# ONLINE LEADERBOARD
# ----------------------
BIN_ID="69aa5de0d0ea881f40f40468"
API_KEY="$2a$10$c6xmwOOU8YjODUQGesjdTOJNBnD7vJrpRVmkZJgn9H24soKDF2tx2"
API_URL=f"https://api.jsonbin.io/v3/b/{BIN_ID}"

leaderboard_cache=[]


def load_leaderboard():
    try:
        r=requests.get(API_URL,headers={"X-Master-Key":API_KEY})
        data=r.json()
        board=data.get("record",[])
        if not isinstance(board,list):
            board=[]
        return board
    except:
        return []


def save_score(name,score):
    try:
        board=load_leaderboard()
        board.append({"name":name,"score":int(score)})
        board=sorted(board,key=lambda x:x["score"],reverse=True)[:10]
        requests.put(API_URL,json=board,headers={"X-Master-Key":API_KEY})
    except:
        pass

# ----------------------
# USERNAME SCREEN
# ----------------------

def username_screen():

    name=""

    while True:

        clock.tick(60)
        screen.fill(WHITE)

        screen.blit(font.render("ENTER USERNAME",True,BLACK),(360,120))

        pygame.draw.rect(screen,BLACK,(300,180,400,40),2)

        screen.blit(font.render(name,True,BLUE),(310,185))

        screen.blit(font.render("Press ENTER",True,BLACK),(390,240))

        pygame.display.update()

        for e in pygame.event.get():

            if e.type==pygame.QUIT:
                pygame.quit();sys.exit()

            if e.type==pygame.KEYDOWN:

                if e.key==pygame.K_RETURN and name:
                    return name

                elif e.key==pygame.K_BACKSPACE:
                    name=name[:-1]

                elif len(name)<12 and e.unicode.isprintable():
                    name+=e.unicode

# ----------------------
# LEADERBOARD SCREEN
# ----------------------

def leaderboard_screen():

    while True:

        clock.tick(60)
        screen.fill(WHITE)

        screen.blit(font.render("GLOBAL LEADERBOARD",True,RED),(330,60))

        for i,entry in enumerate(leaderboard_cache):
            txt=f"{i+1}. {entry['name']} - {entry['score']}"
            screen.blit(font.render(txt,True,BLACK),(360,120+i*30))

        screen.blit(font.render("ESC to return",True,BLACK),(380,330))

        pygame.display.update()

        for e in pygame.event.get():

            if e.type==pygame.QUIT:
                pygame.quit();sys.exit()

            if e.type==pygame.KEYDOWN and e.key==pygame.K_ESCAPE:
                return

# ----------------------
# CONTROLS MENU
# ----------------------

def controls_menu():

    text=["CONTROLS","","A/D Move","W Jump / Double Jump","F Attack","ESC Back"]

    while True:

        screen.fill(WHITE)

        for i,line in enumerate(text):
            screen.blit(font.render(line,True,BLACK),(360,120+i*40))

        pygame.display.update()

        for e in pygame.event.get():

            if e.type==pygame.QUIT:
                pygame.quit();sys.exit()

            if e.type==pygame.KEYDOWN and e.key==pygame.K_ESCAPE:
                return

# ----------------------
# MAIN MENU
# ----------------------

def main_menu():

    options=["Start Game","Leaderboard","Controls","Quit"]

    selected=0

    while True:

        clock.tick(60)
        screen.fill(WHITE)

        title=font.render("ULTIMATE DINOCOMBAT",True,RED)
        screen.blit(title,(320,80))

        for i,opt in enumerate(options):

            color=GREEN if i==selected else BLACK

            screen.blit(font.render(opt,True,color),(420,200+i*50))

        pygame.display.update()

        for e in pygame.event.get():

            if e.type==pygame.QUIT:
                pygame.quit();sys.exit()

            if e.type==pygame.KEYDOWN:

                if e.key in (pygame.K_w,pygame.K_UP):
                    selected=(selected-1)%len(options)

                elif e.key in (pygame.K_s,pygame.K_DOWN):
                    selected=(selected+1)%len(options)

                elif e.key==pygame.K_RETURN:

                    if selected==0:
                        return username_screen()

                    elif selected==1:
                        leaderboard_screen()

                    elif selected==2:
                        controls_menu()

                    elif selected==3:
                        pygame.quit();sys.exit()

# ----------------------
# WEAPON
# ----------------------

class Weapon:

    def __init__(self,name,damage,length,color):

        self.name=name
        self.damage=damage
        self.length=length
        self.color=color

        self.durability=20
        self.swing=False
        self.angle=-60
        self.timer=0

    def attack(self):

        if not self.swing and self.durability>0:

            self.swing=True
            self.timer=10
            self.angle=-60

            self.durability-=1

    def update(self):

        if self.swing:

            self.timer-=1
            self.angle+=12

            if self.timer<=0:
                self.swing=False

# ----------------------
# RESET GAME
# ----------------------

def reset_game():

    global player,vel_y,on_ground,can_double_jump
    global player_health,player_max_health
    global score,enemies,weapon

    player=pygame.Rect(100,GROUND_Y,44,44)

    vel_y=0
    on_ground=True
    can_double_jump=True

    player_max_health=100
    player_health=100

    score=0

    weapon=Weapon("Sword",20,70,RED)

    enemies=[pygame.Rect(900+i*400,GROUND_Y,40,40) for i in range(3)]

# ----------------------
# GAME OVER
# ----------------------

def game_over():

    while True:

        screen.fill(WHITE)

        screen.blit(font.render("GAME OVER",True,RED),(420,150))
        screen.blit(font.render("R Restart",True,BLACK),(430,200))

        pygame.display.update()

        for e in pygame.event.get():

            if e.type==pygame.QUIT:
                pygame.quit();sys.exit()

            if e.type==pygame.KEYDOWN:
                if e.key==pygame.K_r:
                    return

# ----------------------
# START GAME
# ----------------------

leaderboard_cache=load_leaderboard()

player_name=main_menu()

reset_game()

# ----------------------
# GAME LOOP
# ----------------------

gravity=0.6
running=True

while running:

    dt=clock.tick(60)/16.67

    for e in pygame.event.get():

        if e.type==pygame.QUIT:
            running=False

        if e.type==pygame.KEYDOWN:

            if e.key==pygame.K_w:

                if on_ground:
                    vel_y=-14
                    on_ground=False
                    can_double_jump=True

                elif can_double_jump:
                    vel_y=-11
                    can_double_jump=False

            if e.key==pygame.K_f:
                weapon.attack()

    keys=pygame.key.get_pressed()

    if keys[pygame.K_a]:
        player.x-=int(5*dt)

    if keys[pygame.K_d]:
        player.x+=int(5*dt)

    vel_y+=gravity*dt
    player.y+=int(vel_y*dt)

    player.clamp_ip(screen.get_rect())

    if player.y>GROUND_Y:
        player.y=GROUND_Y
        vel_y=0
        on_ground=True
        can_double_jump=True

    weapon.update()

    # ----------------------
    # WEAPON HIT DETECTION
    # ----------------------

    if weapon.swing:

        angle=math.radians(weapon.angle)

        end_x=player.centerx+math.cos(angle)*weapon.length
        end_y=player.centery+math.sin(angle)*weapon.length

        attack_rect=pygame.Rect(
            min(player.centerx,end_x),
            min(player.centery,end_y),
            abs(end_x-player.centerx),
            abs(end_y-player.centery)
        )

        for enemy in enemies[:]:

            if attack_rect.colliderect(enemy):
                enemies.remove(enemy)
                score+=10

    for enemy in enemies:

        enemy.x-=int(4*dt)

        if enemy.x<-50:
            enemy.x=WIDTH+random.randint(200,500)

        if player.colliderect(enemy):
            player_health-=0.3
            player_health=max(0,player_health)

    score+=0.2*dt

    if player_health<=0:

        save_score(player_name,score)

        game_over()

        reset_game()

    screen.fill(WHITE)

    pygame.draw.rect(screen,GREEN,player)

    # HEALTH BAR
    pygame.draw.rect(screen,RED,(player.x,player.y-10,44,5))

    health_width=44*(player_health/player_max_health)

    pygame.draw.rect(screen,GREEN,(player.x,player.y-10,health_width,5))

    for enemy in enemies:
        pygame.draw.rect(screen,BLACK,enemy)

    # DRAW WEAPON

    if weapon.swing:

        angle=math.radians(weapon.angle)

        end_x=player.centerx+math.cos(angle)*weapon.length
        end_y=player.centery+math.sin(angle)*weapon.length

        pygame.draw.line(screen,weapon.color,(player.centerx,player.centery),(end_x,end_y),5)

    # ----------------------
    # RANK CALCULATION
    # ----------------------

    try:

        temp=leaderboard_cache+[{"name":player_name,"score":int(score)}]

        temp=sorted(temp,key=lambda x:x["score"],reverse=True)

        rank=1

        for i,v in enumerate(temp):
            if v["score"]==int(score):
                rank=i+1
                break

    except:
        rank="-"

    screen.blit(font.render(f"Score: {int(score)}",True,BLACK),(820,20))

    screen.blit(font.render(f"Weapon: {weapon.name} ({weapon.durability})",True,BLACK),(10,20))

    screen.blit(font.render(f"Rank: #{rank}",True,PURPLE),(820,50))

    pygame.display.update()

pygame.quit()

