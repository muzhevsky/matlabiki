import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import cm
import numpy as np
from scipy.integrate import odeint
from constants import Constants
from polynoms import Polynomial


class CalculationDrawService:
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
                X
            )
            for normalize_row in range(len(Y)):
                for normalize_column in range(len(Y[normalize_row])):
                    if Y[normalize_row][normalize_column] < 0.0:
                        Y[normalize_row][normalize_column] = 0.0
        return Y, X

    def __describe_difference_equations(self, u, t):
        # Распаковка переменных состояния
        [L1_t, L2_t, L3_t, L4_t, L5_t, L6_t, L7_t, L8_t, L9_t, L10_t, L11_t, L12_t, L13_t, L14_t, L15_t] = u

        # Определение кусочных констант в зависимости от времени 't'
        q1 = 0.1 if t <= 0.2 else (0.4 if t <= 0.5 else 0.6)
        q2 = 0.2 if t <= 0.2 else (0.4 if t <= 0.5 else 0.6)
        q3 = 0.5
        q4 = 0.7 if t <= 0.3 else (0.5 if t <= 0.6 else 0.2)
        q5 = 0.5 if t <= 0.3 else (0.3 if t <= 0.6 else 0.2)

        # Вычисление производных на основе текущего состояния и заданных функций
        dL1_dx = 1 / 10 * (q4 - self.functions[0].calc(L3_t) * (q1 + q2 + q4 + q5))
        dL2_dx = 1 / 10 * (self.functions[1].calc(L1_t) * self.functions[2].calc(L4_t) * self.functions[3].calc(L6_t) -
                            self.functions[4].calc(L7_t) * (q1 + q4))
        dL3_dx = 1 / 10 * (
                self.functions[5].calc(L6_t) * self.functions[6].calc(L10_t) * self.functions[7].calc(L14_t) * (
                q2 + q5) - self.functions[8].calc(L5_t))
        dL4_dx = 1 / 10 * (q4 + q5)
        dL5_dx = 1 / 10 * ((q4 + q5) - (self.functions[9].calc(L2_t) * self.functions[10].calc(L6_t)))
        dL6_dx = 1 / 10 * (self.functions[11].calc(L2_t) * q5 - (q1 + q4))
        dL7_dx = 1 / 10 * (self.functions[12].calc(L14_t) * (q2 + q4) - self.functions[13].calc(L2_t) * self.functions[
            14].calc(L13_t) * self.functions[15].calc(L15_t))
        dL8_dx = 1 / 10 * (self.functions[16].calc(L9_t) * self.functions[17].calc(L13_t) * self.functions[18].calc(
            L15_t) - q1)
        dL9_dx = 1 / 10 * (self.functions[19].calc(L1_t))
        dL10_dx = 1 / 10 * (self.functions[20].calc(L7_t) * (q1 + q2 + q3 + q4 + q5) - self.functions[21].calc(L4_t) *
                             self.functions[22].calc(L12_t) * self.functions[23].calc(L13_t))
        dL11_dx = 1 / 10 * q1
        dL12_dx = 1 / 10 * (-(q1 * self.functions[24].calc(L7_t)))
        dL13_dx = 1 / 10 * (- q1)
        dL14_dx = 1 / 10 * (self.functions[25].calc(L8_t) * self.functions[26].calc(L12_t) - q2)
        dL15_dx = 1 / 10 * (self.functions[27].calc(L9_t) - q1)

        # Возвращение вычисленных производных
        return [dL1_dx, dL2_dx, dL3_dx, dL4_dx, dL5_dx, dL6_dx, dL7_dx, dL8_dx, dL9_dx, dL10_dx, dL11_dx, dL12_dx,
                dL13_dx, dL14_dx, dL15_dx]

    def save_plot(self, X, Y):
        # Сохранение графика рассчитанных значений
        save_path = "plot.png"
        # Добавляем легенду

        plt.rcParams["figure.figsize"] = (15, 8)
        plt.xlabel("Время, часы")  # Подпись оси X
        plt.ylabel("Значение")  # Подпись оси Y
        colors = cm.tab20(np.linspace(0, 1, 14))
        for i in range(0, 14):
            plt.plot(X, Y[:, i], label=Constants.VARIABLES_DESCRIPTION[str(i + 1)]['variable_title'], color=colors[i])
        plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left', borderaxespad=0.)  # Отображение легенды
        plt.tight_layout()
        plt.savefig("images/" + save_path)  # Сохранение графика как изображение
        plt.clf()  # Очистка текущей фигуры

    def __draw_petal_plots(self, graph_title: float, stats: list, max_values: list):
        # Построение лепесткового графика (радариума) для заданных статистик
        variables_list = [Constants.VARIABLES_DESCRIPTION[str(i)]['variable_title'] for i in range(1, 16)]
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
            plt.savefig("images/" + str(i) + "petal_plot.png")  # Сохранение каждого графика

            graph_counter += 1
            graph_title += 0.25  # Увеличение заголовка графика для каждого графика
        plt.clf()  # Очистка текущей фигуры
