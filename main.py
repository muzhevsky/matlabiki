from flask import Flask, request
from flask_cors import CORS
from calc_and_draw import CalculationDrawService
from calc_and_draw_car import CalculationDrawServiceCar
from calc_and_draw_hdd import CalculationDrawServiceHdd
from calc_and_draw_pc import CalculationDrawServicePC

app = Flask(__name__)
CORS(app, origins="*")

calcS = CalculationDrawService()
calcS_car = CalculationDrawServiceCar()
calcS_hdd = CalculationDrawServiceHdd()
calcS_pc = CalculationDrawServicePC()


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


@app.route('/calcAndDraw_car', methods=['POST'])
def calc_and_draw_car():
    #  Получение данных с фронт энда
    content = request.json
    X, Y = calcS_car.calculate(content)
    # Отрисовка графиков
    path1 = calcS_car.save_plot(X, Y)
    path2 = calcS_car.save_petal_plots(0, Y, content["max_values"])

    return {
        "image1": path1,
        "image2": path2
    }


@app.route('/calcAndDraw_hdd', methods=['POST'])
def calc_and_draw_hdd():
    #  Получение данных с фронт энда
    content = request.json
    X, Y = calcS_hdd.calculate(content)
    # Отрисовка графиков
    path1 = calcS_hdd.save_plot(X, Y)
    path2 = calcS_hdd.save_petal_plots(0, Y, content["max_values"])

    return {
        "image1": path1,
        "image2": path2
    }


@app.route('/calcAndDraw_pc', methods=['POST'])
def calc_and_draw_pc():
    #  Получение данных с фронт энда
    content = request.json
    X, Y = calcS_car.calculate(content)
    # Отрисовка графиков
    path1, path2 = calcS_pc.save_plots(Y)

    return {
        "image1": path1,
        "image2": path2
    }


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9090)
