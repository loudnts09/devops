#include <iostream>
#include "funcoes.h"

int main(){
    std::cout << "Conversor de temperatura Celsius/Fahrenheit.\n" << std::endl;
    std::cout << "Escolha o que quer converter:\n(1) Celsius --> Fahrenheit\n(2) Farenheit --> Celsius" << std::endl;
    std::cin >> escolha;

    while (escolha < 1 or escolha > 2){
        std::cout << "Valor incorreto, digite um número válido.\n" << std::endl;
        std::cout << "Escolha o que quer converter:\n(1) Celsius --> Fahrenheit\n(2) Farenheit --> Celsius" << std::endl;
        std::cin >> escolha;
    }
    
    
    std::cout << "Digite a temperatura: " << std::endl;
    std::cin >> valor;

    switch(escolha){
        case 1:
            std::cout << celsiusparaFahrenheit(valor) << std::endl;
            break;
        case 2:
            std::cout << fahrenheitparaCelsius(valor) << std::endl;
            break;
    }


    return 0;
}