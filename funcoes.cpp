#include <iostream>
#include "funcoes.h"

int escolha;
double valor;

double celsiusFahrenheit(double temperatura){
    double fahrenheit = (temperatura * 1.8) + 32;
    std::cout << "A temperatura em Fahrenheit é: "<< fahrenheit;

    return 0;
}

double fahrenheitCelsius(double temperatura){
    double celsius = (temperatura - 32)/ 1.8;
    std::cout << "A temperatura em Celsius é: " << celsius;

    return 0;
}