import uvicorn
from flask import Flask, request
from flask_cors import CORS
from calc_and_draw import CalculationDrawService

app = Flask(__name__)
CORS(app)
calcS = CalculationDrawService()


@app.route('/check')
def check():
    return "check"


@app.route('/calcAndDraw', methods=['POST'])
def calc_and_draw():
    #  Получение данных с фронт энда
    content = request.json
    X, Y = calcS.calculate(content)
    # Отрисовка графиков
    path1 = calcS.save_plot(X, Y)
    path2 = calcS.save_petal_plots(0, Y, content["max_values"])

    return {
        "image1": path1,
        "image2": path2
    }


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9090)
