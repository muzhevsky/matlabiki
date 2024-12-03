import matplotlib.pyplot as plt
import numpy as np
from scipy.integrate import odeint
from polynoms import Polynomial
import io
import base64

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
        X = np.linspace(0, 1, 50)  # Временные значения от 0 до 1
        Y = None
        niter = 100  # Количество итераций для расчетов

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
                    if Y[normalize_row][normalize_column] > 1.0:
                        Y[normalize_row][normalize_column] = 1.0
                    elif Y[normalize_row][normalize_column] < 0.0:
                        Y[normalize_row][normalize_column] = 0.0
        return Y, X

    def __describe_difference_equations(self, u, t, mus, lat):
        # Распаковка переменных состояния
        [P0_t, P1_t, P2_t, P3_t, P4_t, P5_t, P6_t, P7_t] = u
        mus1, mus2, mus3 = mus

        lat1, lat2, lat3 = lat
        dL0_dx = - (lat1 + lat2 + lat3) * P0_t + mus1 * P1_t + mus2 * P2_t + mus3 + P3_t

        dL1_dx = lat1 * P0_t - (lat1 + lat2 + mus1) * P1_t + mus2 * P4_t + mus3 * P5_t

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
        time_intervals = np.linspace(0, 100, 300)

        P0, P1, P2, P3, P4, P5, P6, P7 = Y

        # Определяем все линии для удобства
        lines = [
            (P0, 'Базовое состояние'), (P1, 'Поломка первого ПК'),
            (P2, 'Поломка второго ПК'), (P3, 'Поломка третьего ПЕ'),
            (P4, 'Поломка 1 и 2 ПК'), (P5, 'Поломка 1 и 3 ПК'),
            (P6, 'Поломка 2 и 3 ПК'), (P7, 'Поломка всех компьютеров'),
        ]

        # Строим линии графика
        for L, label in lines:
            ax1.plot(time_intervals, L, label=label)

        # Настройка графика
        ax1.set_xlabel('Время')
        ax1.set_ylabel('Значения')
        ax1.set_title('График времени')
        ax1.legend(bbox_to_anchor=(1.05, 1), loc='upper left', borderaxespad=0.)
        plt.tight_layout()

        # Сохранение первого графика в буфер
        buf1 = io.BytesIO()
        fig1.savefig(buf1, format="png")
        buf1.seek(0)
        img_str1 = base64.b64encode(buf1.getvalue()).decode("utf-8")
        plt.close(fig1)

        # Визуализация увеличенного графика
        fig2, ax2 = plt.subplots(figsize=(16, 8))

        # Обрезаем временные интервалы (например, первые 10 единиц времени)
        zoomed_intervals = time_intervals[time_intervals <= 10]
        zoomed_solution = Y[:len(zoomed_intervals)]

        # Разделение обрезанного решения
        P0_zoomed, P1_zoomed, P2_zoomed, P3_zoomed, P4_zoomed, P5_zoomed, P6_zoomed, P7_zoomed = zoomed_solution

        # Строим линии для увеличенного графика
        zoomed_lines = [
            (P0_zoomed, 'Базовое состояние'), (P1_zoomed, 'Поломка первого ПК'),
            (P2_zoomed, 'Поломка второго ПК'), (P3_zoomed, 'Поломка третьего ПЕ'),
            (P4_zoomed, 'Поломка 1 и 2 ПК'), (P5_zoomed, 'Поломка 1 и 3 ПК'),
            (P6_zoomed, 'Поломка 2 и 3 ПК'), (P7_zoomed, 'Поломка всех компьютеров'),
        ]

        for L, label in zoomed_lines:
            ax2.plot(zoomed_intervals, L, label=label)

        # Настройка увеличенного графика
        ax2.set_xlabel('Время (увеличенный масштаб)')
        ax2.set_ylabel('Значения')
        ax2.set_title('Увеличенный график ближе к началу времени')
        ax2.set_ylim(0, 0.5)
        ax2.legend(bbox_to_anchor=(1.05, 1), loc='upper left', borderaxespad=0.)
        plt.tight_layout()

        # Сохранение второго графика в буфер
        buf2 = io.BytesIO()
        fig2.savefig(buf2, format="png")
        buf2.seek(0)
        img_str2 = base64.b64encode(buf2.getvalue()).decode("utf-8")
        plt.close(fig2)

        return {
            "image1": img_str1,  # Полный график
            "image2": img_str2  # Увеличенный график
        }
        plt.clf()  # Очистка текущей фигуры
