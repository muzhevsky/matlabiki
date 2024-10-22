# Класс для расчета функций
class Polynomial:
    def __init__(self, *coefficients):
        self.coefficients = coefficients

    def calc(self, x):
        return sum(c * (x ** i) for i, c in enumerate(self.coefficients))
