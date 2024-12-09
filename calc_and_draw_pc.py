import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from scipy.integrate import odeint
from polynoms import Polynomial


class CalculationDrawServicePC:
    def __init__(self):
        pass

    def calculate(self, coefs: dict) -> dict:
        # Инициализация полиномиальных функций и расчет Y и X
        Y, X = self.__calculate(coefs)
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
        X = np.linspace(0, 50, 500)  # Временные значения от 0 до 1
        Y = None
        niter = 500  # Количество итераций для расчетов

        # Цикл по итерациям для решения дифференциальных уравнений
        for i in range(niter):
            Y = odeint(
                self.__describe_difference_equations,
                [1, 0, 0, 0, 0, 0, 0, 0],
                X,
                (data["mu"],
                 data['lat'])
            )
            # Нормализация результатов, чтобы они были в пределах [0, 1]
            for normalize_row in range(len(Y)):
                for normalize_column in range(len(Y[normalize_row])):
                    if Y[normalize_row][normalize_column] < 0.0:
                        Y[normalize_row][normalize_column] = 0.0
        return Y, X

    def __describe_difference_equations(self, u, t, mus, lat):
        # Распаковка переменных состояния
        [P0_t, P1_t, P2_t, P3_t, P4_t, P5_t, P6_t, P7_t] = u
        mus1, mus2, mus3 = mus

        lat1, lat2, lat3 = lat
        dL0_dx = - (lat1 + lat2 + lat3) * P0_t + mus1 * P1_t + mus2 * P2_t + mus3 * P3_t

        dL1_dx = lat1 * P0_t - (lat2 + lat3 + mus1) * P1_t + mus2 * P4_t + mus3 * P5_t

        dL2_dx = lat2 * P0_t - (lat1 + lat3 + mus2) * P2_t + mus1 * P4_t + mus3 * P6_t

        dL3_dx = lat3 * P0_t - (lat1 + lat2 + mus3) * P3_t + mus1 * P5_t + mus2 * P6_t

        dL4_dx = lat2 * P1_t + lat1 * P2_t - (lat3 + mus1 + mus2) * P4_t + mus3 * P7_t

        dL5_dx = lat3 * P1_t + lat1 * P3_t - (lat2 + mus1 + mus3) * P5_t + mus2 * P7_t

        dL6_dx = lat3 * P2_t + lat2 * P3_t - (lat1 + mus2 + mus3) * P6_t + mus1 * P7_t

        dL7_dx = lat3 * P4_t + lat2 * P5_t + lat1 * P6_t - (mus1 + mus2 + mus3) * P7_t

        # Возвращение вычисленных производных
        return [dL0_dx, dL1_dx, dL2_dx, dL3_dx, dL4_dx, dL5_dx, dL6_dx, dL7_dx]

    def save_plots(self, Y: list):
        fig1, ax1 = plt.subplots(figsize=(16, 8))
        time_intervals = np.linspace(0, 50, 500)

        P0, P1, P2, P3, P4, P5, P6, P7 = Y.T

        # Определяем все линии для удобства
        lines = [
            (P0, 'Базовое состояние'), (P1, 'Неисправность первого ПК'),
            (P2, 'Неисправность второго ПК'), (P3, 'Неисправность третьего ПК'),
            (P4, 'Неисправность 1 и 2 ПК'), (P5, 'Неисправность 1 и 3 ПК'),
            (P6, 'Неисправность 2 и 3 ПК'), (P7, 'Неисправность всех компьютеров'),
        ]

        # Строим линии графика
        for L, label in lines:
            ax1.plot(time_intervals, L, label=label)

        # Настройка графика
        ax1.set_xlabel('Время, часы')
        ax1.set_ylabel('Значения')
        ax1.set_title('Вероятностного нахождения системы в состоянии')
        ax1.legend(bbox_to_anchor=(1.05, 1), loc='upper left', borderaxespad=0.)
        plt.tight_layout()

        # Сохранение первого графика в буфер
        plt.savefig("images/" + "petal_plot_pc.png")

        # Визуализация увеличенного графика
        fig2, ax2 = plt.subplots(figsize=(16, 8))

        # Обрезаем временные интервалы (например, первые 10 единиц времени)
        zoomed_intervals = time_intervals[time_intervals <= 10]
        zoomed_solution = Y[:len(zoomed_intervals)]

        # Разделение обрезанного решения
        P0_zoomed, P1_zoomed, P2_zoomed, P3_zoomed, P4_zoomed, P5_zoomed, P6_zoomed, P7_zoomed = zoomed_solution.T

        # Строим линии для увеличенного графика
        zoomed_lines = [
            (P0_zoomed, 'Базовое состояние'), (P1_zoomed, 'Неисправность первого ПК'),
            (P2_zoomed, 'Неисправность второго ПК'), (P3_zoomed, 'Неисправность третьего ПК'),
            (P4_zoomed, 'Неисправность 1 и 2 ПК'), (P5_zoomed, 'Неисправность 1 и 3 ПК'),
            (P6_zoomed, 'Неисправность 2 и 3 ПК'), (P7_zoomed, 'Неисправность всех компьютеров'),
        ]

        for L, label in zoomed_lines:
            ax2.plot(zoomed_intervals, L, label=label)

        # Настройка увеличенного графика
        ax2.set_xlabel('Время (увеличенный масштаб), часы')
        ax2.set_ylabel('Значения')
        ax2.set_title('Вероятностного нахождения системы в состоянии (увеличенный масштаб)')
        ax2.set_ylim(0, 0.5)
        ax2.legend(bbox_to_anchor=(1.05, 1), loc='upper left', borderaxespad=0.)
        plt.tight_layout()

        # Сохранение второго графика в буфер
        plt.savefig("images/" + "petal_plot_pc_zoom.png")

        return {
            "image1": None,  # Полный график
            "image2": None  # Увеличенный график
        }
        plt.clf()  # Очистка текущей фигуры
