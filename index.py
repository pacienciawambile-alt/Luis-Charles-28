from flask import Flask, render_template, request, redirect, url_for
import random
import json
import os

app = Flask(__name__)

# Arquivo para guardar os melhores jogadores
SCORES_FILE = "scores.json"

# Função para gerar cor aleatória
def random_color():
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))

# Ler scores do arquivo
def load_scores():
    if not os.path.exists(SCORES_FILE):
        return []
    with open(SCORES_FILE, "r") as f:
        return json.load(f)

# Salvar scores no arquivo
def save_scores(scores):
    with open(SCORES_FILE, "w") as f:
        json.dump(scores, f)

# Rota principal do jogo
@app.route("/")
def home():
    # Cores aleatórias
    snake_color = [random_color() for _ in range(10)]  # 10 segmentos de cores alternadas
    food_color = random_color()
    background = f"radial-gradient(circle, {random_color()}, {random_color()}, {random_color()})"

    # Obstáculos aleatórios
    obstacles = []
    for _ in range(8):
        x = random.randint(0, 19)
        y = random.randint(0, 19)
        color = random_color()
        obstacles.append({'x': x, 'y': y, 'color': color})

    # Carregar melhores scores
    scores = load_scores()
    best_scores = sorted(scores, key=lambda x: x["score"], reverse=True)[:5]  # Top 5

    return render_template("Index.html",
                           snake_color=json.dumps(snake_color),
                           food_color=food_color,
                           background=background,
                           obstacles=json.dumps(obstacles),
                           best_scores=json.dumps(best_scores))

# Rota para salvar score do jogador
@app.route("/save_score", methods=["POST"])
def save_score():
    name = request.form.get("name", "Anonimo")
    score = int(request.form.get("score", 0))
    scores = load_scores()
    scores.append({"name": name, "score": score})
    save_scores(scores)
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)
