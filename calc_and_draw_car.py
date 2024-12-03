import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from scipy.integrate import odeint
from constants_car import Constants
from polynoms import Polynomial
from math import e


class CalculationDrawServiceCar:
    def __init__(self):
        pass

    def calculate(self, coefs: dict) -> dict:
        # Инициализация полиномиальных функций и расчет Y и X
        self.functions = self.initFunctions(coefs["coef"])
        Y, X = self.__calculate(data=coefs)
        return X, Y

    def initFunctions(self, coefs):
        # Преобразование коэффициентов в объекты полиномиальных функций
        functions = []
        for coef_set in coefs:
            polynomial = Polynomial(*coef_set)
            functions.append(polynomial)
        return functions

    def __calculate(self, data: dict) -> tuple:
        # Расчет системы дифференциальных уравнений на заданном интервале
        X = np.linspace(0, 1, 50)  # Временные значения от 0 до 1
        Y = None
        niter = 100  # Количество итераций для расчетов

        # Цикл по итерациям для решения дифференциальных уравнений
        for i in range(niter):
            Y = odeint(
                self.__describe_difference_equations,
                data["start"],
                X,
                (data["k"],
                data['b'])
            )
            # Нормализация результатов, чтобы они были в пределах [0, 1]
            for normalize_row in range(len(Y)):
                for normalize_column in range(len(Y[normalize_row])):
                    if Y[normalize_row][normalize_column] > 1.0:
                        Y[normalize_row][normalize_column] = 1.0
                    elif Y[normalize_row][normalize_column] < 0.0:
                        Y[normalize_row][normalize_column] = 0.0
        return Y, X

    def __describe_difference_equations(self, u, t, k, b):
        # Распаковка переменных состояния
        [L1_t, L2_t, L3_t, L4_t, L5_t, L6_t, L7_t, L8_t, L9_t, L10_t, L11_t, L12_t, L13_t] = u

        # Определение кусочных констант в зависимости от времени 't'
        e1 = k[0] * t + b[0]
        e2 = (k[1] * k[1] * e ** t) / (k[1] + k[1] * (e ** t - 1))
        e3 = k[2] * t + b[2]
        e4 = k[3] * t + b[3]
        e5 = k[4] * t + b[4]
        e6 = k[5] * t + b[5]

        # Вычисление производных на основе текущего состояния и заданных функций
        dL1_dx = 1 / 5 * (self.functions[0].calc(L7_t) * self.functions[1].calc(L8_t) * self.functions[2].calc(L9_t) * self.functions[3].calc(L10_t) * self.functions[4].calc(L11_t) * self.functions[5].calc(L12_t) * (e1 + e2 + e4) - (e3 + e4 + e5 + e6))
        dL2_dx = 1 / 5 * (self.functions[6].calc(L4_t) * self.functions[7].calc(L5_t) * self.functions[8].calc(L8_t) * self.functions[9].calc(L9_t) * self.functions[10].calc(L11_t) * e2 - (e3 + e4 + e5 + e6))
        dL3_dx = 1 / 5 * (self.functions[11].calc(L6_t) * self.functions[12].calc(L7_t) * self.functions[13].calc(L8_t) * self.functions[14].calc(L9_t) * self.functions[15].calc(L10_t) * self.functions[16].calc(L11_t) * self.functions[17].calc(L12_t) * self.functions[18].calc(L13_t) * (e1 + e2) - (e4 + e6))
        dL4_dx = 1 / 5 * (self.functions[19].calc(L2_t) * self.functions[20].calc(L5_t) * self.functions[21].calc(L7_t) * self.functions[22].calc(L8_t) * self.functions[23].calc(L9_t) * self.functions[24].calc(L11_t) * e2 - (e3 + e4 + e5 + e6))
        dL5_dx = 1 / 5 * (self.functions[25].calc(L2_t) * self.functions[26].calc(L4_t) * self.functions[27].calc(L7_t) * self.functions[28].calc(L8_t) * self.functions[29].calc(L11_t) * (e1 + e2) - (e3 + e4 + e5 + e6))
        dL6_dx = 1 / 5 * (self.functions[30].calc(L3_t) * self.functions[31].calc(L7_t) * self.functions[32].calc(L8_t) * self.functions[33].calc(L9_t) * self.functions[34].calc(L10_t) * self.functions[35].calc(L11_t) * self.functions[36].calc(L13_t) - (e3 + e4 + e6))
        dL7_dx = 1 / 5 * (self.functions[37].calc(L1_t) * self.functions[38].calc(L8_t) * self.functions[39].calc(L13_t) * (e1 + e6) - self.functions[40].calc(L2_t) * self.functions[41].calc(L5_t) * self.functions[42].calc(L10_t) * (e3 + e4 + e5 + e6))
        dL8_dx = 1 / 5 * (self.functions[43].calc(L1_t) * self.functions[44].calc(L7_t) * self.functions[45].calc(L9_t) * self.functions[46].calc(L11_t) * self.functions[47].calc(L12_t) * (e1 + e2) - (e4 + e6))
        dL9_dx = 1 / 5 * (self.functions[48].calc(L1_t) * self.functions[49].calc(L10_t) * self.functions[50].calc(L11_t) * self.functions[51].calc(L12_t) * e1 - self.functions[52].calc(L2_t) * self.functions[53].calc(L3_t))
        dL10_dx = 1 / 5 * (self.functions[54].calc(L1_t) * self.functions[55].calc(L7_t) * self.functions[56].calc(L8_t) * self.functions[57].calc(L9_t) * self.functions[58].calc(L13_t) * e1 - self.functions[59].calc(L2_t) * self.functions[60].calc(L3_t) * (e3 + e4 + e5 + e6))
        dL11_dx = 1 / 5 * (self.functions[61].calc(L1_t) * self.functions[62].calc(L8_t) * self.functions[63].calc(L12_t) * e2 - (e2 + e4 + e6))
        dL12_dx = 1 / 5 * (self.functions[64].calc(L1_t) * self.functions[65].calc(L7_t) * self.functions[66].calc(L8_t) * self.functions[67].calc(L11_t) * e2 - e4)
        dL13_dx = 1 / 5 * (self.functions[68].calc(L1_t) * self.functions[69].calc(L2_t) * self.functions[70].calc(L3_t) * self.functions[71].calc(L4_t) * self.functions[72].calc(L5_t) * self.functions[73].calc(L6_t) * self.functions[74].calc(L7_t) * self.functions[75].calc(L8_t) * e2 - (e3 + e4 + e5 + e6))

        # Возвращение вычисленных производных
        return [dL1_dx, dL2_dx, dL3_dx, dL4_dx, dL5_dx, dL6_dx, dL7_dx, dL8_dx, dL9_dx, dL10_dx, dL11_dx, dL12_dx,
                dL13_dx]

    def save_plot(self, X, Y):
        # Сохранение графика рассчитанных значений
        save_path = "plot_car.png"
        # Добавляем легенду

        plt.rcParams["figure.figsize"] = (15, 8)
        plt.xlabel("Время")  # Подпись оси X
        plt.ylabel("Значение")  # Подпись оси Y
        for i in range(0, 12):
            plt.plot(X, Y[:, i], label=Constants.VARIABLES_DESCRIPTION[str(i + 1)]['variable_title'])
        plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left', borderaxespad=0.)  # Отображение легенды
        plt.tight_layout()
        plt.savefig("images/" + save_path)  # Сохранение графика как изображение
        plt.clf()  # Очистка текущей фигуры

    def __draw_petal_plots(self, graph_title: float, stats: list, max_values: list):
        # Построение лепесткового графика (радариума) для заданных статистик
        variables_list = [Constants.VARIABLES_DESCRIPTION[str(i)]['variable_title'] for i in range(1, 14)]
        labels = np.array(variables_list)

        # Подготовка углов для радиального графика
        angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False)
        stats = np.concatenate((stats, [stats[0]]))  # Закрытие петли
        angles = np.concatenate((angles, [angles[0]]))
        labels = np.concatenate((labels, [labels[0]]))
        max_values = np.concatenate((max_values, [max_values[0]]))  # Закрытие петли для минимальных значений

        # Создание радиального графика
        fig = plt.figure()
        ax = fig.add_subplot(111, polar=True)

        ax.plot(angles, stats, 'o-', linewidth=2)  # Построение статистик
        ax.fill(angles, stats, alpha=0.25)  # Заливка области под линией статистик

        ax.plot(angles, max_values, 'r', linewidth=2)  # Построение минимальных значений
        ax.fill(angles, max_values, 'r', alpha=0.1)  # Заливка области под линией минимальных значений

        ax.set_thetagrids(angles * 180 / np.pi, labels)  # Установка меток для каждого угла
        ax.set_title("t=" + str(graph_title))  # Заголовок графика
        ax.grid(True)  # Отображение сетки

    def save_petal_plots(self, graph_title: float, Y: list, max_values: list):
        # Сохранение нескольких лепестковых графиков по времени
        graph_counter: int = 1
        graph_title: float = 0

        for i in range(0, len(Y) - 1, 12):
            self.__draw_petal_plots(
                graph_title=graph_title,
                stats=Y[i, :],
                max_values=max_values
            )
            plt.savefig("images/" + str(i) + "petal_plot_car.png")  # Сохранение каждого графика

            graph_counter += 1
            graph_title += 0.25  # Увеличение заголовка графика для каждого графика
        plt.clf()  # Очистка текущей фигуры
