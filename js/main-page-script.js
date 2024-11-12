import { removal } from './crops.js';
import { activeSubstance } from './fertilizer.js';

document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('calculate');
  button.addEventListener('click', function () {
    // !Заполнение данных в объект
    let inputData = {
      /** Площадь поля */
      fieldArea: '',
      /** Культура */
      crop: '',
      /** План.урожай */
      harvest: '',


      /** Коэф. на агрохим. показатели поля N */
      nitrogenCoefficient: 0,
      /** Коэф. на агрохим. показатели поля P */
      phosphorusCoefficient: 0,
      /** Коэф. на агрохим. показатели поля K */
      potassiumCoefficient: 0,

      /** Вынос культурой азота */
      cropNitrogen: 0,
      /** Вынос культурой фосфора */
      cropPhosphorus: 0,
      /** Вынос культурой калия */
      cropPotassium: 0,

      fertilizerN: {
        name: '',
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        sera: 0,
        price: document.getElementById('nitrogen-price').value,
      },

      fertilizerP: {
        name: '',
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        sera: 0,
        price: document.getElementById('phosphorus-price').value,
      },

      fertilizerK: {
        name: '',
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        sera: 0,
        price: document.getElementById('potassium-price').value,
      },
    };

    getInput(inputData);
    console.log(inputData);

    calculateDoses(inputData);
  });
});


// !Заполнение inputData
function getInput(inputData) {
  inputData.fieldArea = document.getElementById('field-area').value;
  inputData.crop = document.getElementById('crop').value;
  inputData.harvest = (document.getElementById('harvest').value) * 0.7;
  inputData.fertilizerN.name = document.getElementById('nitrogen').value;
  inputData.fertilizerP.name = document.getElementById('phosphorus').value;
  inputData.fertilizerK.name = document.getElementById('potassium').value;


  // ! Получение выноса культуры
  removal.forEach(function (removal) {
    if (removal.name === inputData.crop) {
      inputData.cropNitrogen = removal.nitrogen;
      inputData.cropPhosphorus = removal.phosphorus;
      inputData.cropPotassium = removal.potassium;
    }
  });

  // * Получение данных поля
  const nValue = document.getElementById('n-value').value
  const pValue = document.getElementById('p-value').value
  const kValue = document.getElementById('k-value').value
  const coefficients = getCoefficient(nValue, pValue, kValue)
  inputData.nitrogenCoefficient = coefficients[0];
  inputData.phosphorusCoefficient = coefficients[1];
  inputData.potassiumCoefficient = coefficients[2];

  // ! Получение данных об удобрениях
  fertilizerCatch(inputData);

}

// ! Получение коэффициентов агрохим. показателей поля
function getCoefficient(nitrogen, phosphorus, potassium) {
  let nitrogenCoefficient;
  if (nitrogen < 2.9) {
    nitrogenCoefficient = 1;
  } else if (nitrogen >= 2.9 && nitrogen <= 6.2) {
    nitrogenCoefficient = 0.75;
  } else if (nitrogen > 6.2) {
    nitrogenCoefficient = 0.6;
  }

  let phosphorusCoefficient;
  if (phosphorus < 20) {
    phosphorusCoefficient = 1.3;
  } else if (phosphorus >= 20 && phosphorus < 25) {
    phosphorusCoefficient = 1.2;
  } else if (phosphorus >= 25 && phosphorus < 30) {
    phosphorusCoefficient = 1.1;
  } else if (phosphorus >= 30 && phosphorus < 35) {
    phosphorusCoefficient = 1;
  } else if (phosphorus >= 35 && phosphorus < 40) {
    phosphorusCoefficient = 0.9;
  } else if (phosphorus > 40) {
    phosphorusCoefficient = 0.7;
  }


  let potassiumCoefficient;
  if (potassium < 6) {
    potassiumCoefficient = 1.5;
  } else if (potassium >= 6 && potassium < 7.5) {
    potassiumCoefficient = 1.1;
  } else if (potassium >= 7.5 && potassium < 9) {
    potassiumCoefficient = 1.0;
  } else if (potassium >= 9 && potassium < 10.5) {
    potassiumCoefficient = 0.9;
  } else if (potassium >= 10.5 && potassium < 12) {
    potassiumCoefficient = 0.8;
  } else if (potassium > 12) {
    potassiumCoefficient = 0.7;
  }

  console.log(
    `Коэффициенты:
		Азот: ${nitrogenCoefficient}
		Фосфор: ${phosphorusCoefficient}
		Калий: ${potassiumCoefficient}`
  );

  return [nitrogenCoefficient, phosphorusCoefficient, potassiumCoefficient];
}

// ! Получение данных об удобрениях
function fertilizerCatch(inputData) {
  // console.log(inputData.fertilizerN.name);
  // *Азотное удобрение
  activeSubstance.forEach(elem => {
    if (inputData.fertilizerN.name === elem.name) {
      inputData.fertilizerN.nitrogen = elem.nitrogen;
      inputData.fertilizerN.phosphorus = elem.phosphorus;
      inputData.fertilizerN.potassium = elem.potassium;
      inputData.fertilizerN.sera = elem.sera;
    }
  });
  // *Фосфорное удобрение
  activeSubstance.forEach(elem => {
    if (inputData.fertilizerP.name === elem.name) {
      inputData.fertilizerP.nitrogen = elem.nitrogen;
      inputData.fertilizerP.phosphorus = elem.phosphorus;
      inputData.fertilizerP.potassium = elem.potassium;
      inputData.fertilizerP.sera = elem.sera;
    }
  });
  // *Калийное удобрение
  activeSubstance.forEach(elem => {
    if (inputData.fertilizerK.name === elem.name) {
      inputData.fertilizerK.nitrogen = elem.nitrogen;
      inputData.fertilizerK.phosphorus = elem.phosphorus;
      inputData.fertilizerK.potassium = elem.potassium;
      inputData.fertilizerK.sera = elem.sera;
    }
  });
}

function calculateDoses(inputData) {
  // ! Считаем дозы NPK
  const doseP = Math.round(inputData.phosphorusCoefficient * inputData.harvest * inputData.cropPhosphorus);
  const physWeightP = inputData.fertilizerP.phosphorus <= 0 ? 0 : Math.round((doseP * 100 / inputData.fertilizerP.phosphorus) / 5) * 5;

  const doseN = Math.round((inputData.nitrogenCoefficient * inputData.harvest * inputData.cropNitrogen) - (inputData.fertilizerP.nitrogen * physWeightP / 100));
  const physWeightN = inputData.fertilizerN.nitrogen <= 0 ? 0 : Math.round((doseN * 100 / inputData.fertilizerN.nitrogen) / 5) * 5;
  console.log(doseN, '\t',
    inputData.fertilizerN.nitrogen)
  const doseK = Math.round((inputData.potassiumCoefficient * inputData.harvest * inputData.cropPotassium) - (inputData.fertilizerP.potassium * physWeightP / 100));
  const physWeightK = inputData.fertilizerK.potassium <= 0 ? 0 : Math.round(((doseK * 100 / inputData.fertilizerK.potassium) * 0.8) / 5) * 5;


  console.log(`
			Доза / Физ.вес:
	N		${doseN} / ${physWeightN}
	P		${doseP} / ${physWeightP}
	K		${doseK} / ${physWeightK}
	`);

  if (physWeightN > 0) document.querySelector('.phys-ga-nitrogen').textContent = physWeightN;
  if (physWeightP > 0) document.querySelector('.phys-ga-phosphorus').textContent = physWeightP;
  if (physWeightK > 0) document.querySelector('.phys-ga-potassium').textContent = physWeightK;

  if (physWeightN > 0) document.querySelector('.phys-field-nitrogen').textContent = (physWeightN / 1000 * inputData.fieldArea).toFixed(1);
  if (physWeightP > 0) document.querySelector('.phys-field-phosphorus').textContent = (physWeightP / 1000 * inputData.fieldArea).toFixed(1);
  if (physWeightK > 0) document.querySelector('.phys-field-potassium').textContent = (physWeightK / 1000 * inputData.fieldArea).toFixed(1);

  // ! Расчет стоимости удобрений

  const priceGaN = Math.round(physWeightN * inputData.fertilizerN.price);
  const priceGaP = Math.round(physWeightP * inputData.fertilizerP.price);
  const priceGaK = Math.round(physWeightK * inputData.fertilizerK.price);

  const priceFieldN = priceGaN * inputData.fieldArea;
  const priceFieldP = priceGaP * inputData.fieldArea;
  const priceFieldK = priceGaK * inputData.fieldArea;


  if (priceGaN > 0) document.querySelector('.price-ga-nitrogen').textContent = `${priceGaN.toLocaleString('ru-RU')} ₽`;
  if (priceGaP > 0) document.querySelector('.price-ga-phosphorus').textContent = `${priceGaP.toLocaleString('ru-RU')} ₽`;
  if (priceGaK > 0) document.querySelector('.price-ga-potassium').textContent = `${priceGaK.toLocaleString('ru-RU')} ₽`;

  if (priceGaN > 0) document.querySelector('.price-field-nitrogen').textContent = `${priceFieldN.toLocaleString('ru-RU')} ₽`;
  if (priceGaP > 0) document.querySelector('.price-field-phosphorus').textContent = `${priceFieldP.toLocaleString('ru-RU')} ₽`;
  if (priceGaK > 0) document.querySelector('.price-field-potassium').textContent = `${priceFieldK.toLocaleString('ru-RU')} ₽`;

  if (priceGaN + priceGaP + priceGaK) document.querySelector('.price-ga-total').textContent = `${(priceGaN + priceGaP + priceGaK).toLocaleString('ru-RU')} ₽`;
  if (priceFieldN + priceFieldP + priceFieldK) document.querySelector('.price-field-total').textContent = `${(priceFieldN + priceFieldP + priceFieldK).toLocaleString('ru-RU')} ₽`;
}




// ! Изменение цены удобрений
const nitrogenSelect = document.getElementById('nitrogen');
const phosphorusSelect = document.getElementById('phosphorus');
const potassiumSelect = document.getElementById('potassium');

// Добавляем обработчик события change
nitrogenSelect.addEventListener('change', function () {
  const name = nitrogenSelect.value;
  activeSubstance.forEach(elem => {
    if (name === elem.name) {
      document.getElementById('nitrogen-price').value = elem.price;
      document.getElementById('nitrogen-price-name').innerHTML = `${elem.name}`;
    }
  });
});
phosphorusSelect.addEventListener('change', function () {
  const name = phosphorusSelect.value;
  activeSubstance.forEach(elem => {
    if (name === elem.name) {
      document.getElementById('phosphorus-price').value = elem.price;
      document.getElementById('phosphorus-price-name').innerHTML = `${elem.name}`;
    }
  });
});
potassiumSelect.addEventListener('change', function () {
  const name = potassiumSelect.value;
  activeSubstance.forEach(elem => {
    if (name === elem.name) {
      document.getElementById('potassium-price').value = elem.price;
      document.getElementById('potassium-price-name').innerHTML = `${elem.name}`;
    }
  });
});


document.getElementById('field-area').addEventListener('change', function () {
  if (this.value < 0) {
    this.value = 0;
  }
})
document.getElementById('harvest').addEventListener('change', function () {
  if (this.value < 0) {
    this.value = 0;
  }
  else {
    this.style.backgroundColor = 'white';
  }
})
document.getElementById('nitrogen-price').addEventListener('change', function () {
  if (this.value < 0) {
    this.value = 0;
  }
})
document.getElementById('phosphorus-price').addEventListener('change', function () {
  if (this.value < 0) {
    this.value = 0;
  }
})
document.getElementById('potassium-price').addEventListener('change', function () {
  if (this.value < 0) {
    this.value = 0;
  }
})

// ? НЕ ОБЩАЯ
document.getElementById('n-value').addEventListener('change', function () {
  // console.log(this.value);
  // this.style.backgroundColor = 'red';
  if (this.value < 0) {
    this.value = 0;
  } else if (this.value < 2.9) {
    this.style.backgroundColor = '#ee8238';
  }
  else if (this.value >= 2.9 && this.value <= 6.2) {
    this.style.backgroundColor = '#79b252';
  }
  else if (this.value > 6.2) {
    this.style.backgroundColor = '#ffc30d';
  }
})

// ? НЕ ОБЩАЯ
document.getElementById('p-value').addEventListener('change', function () {
  if (this.value < 0) {
    this.value = 0;
  } else if (this.value < 20) {
    this.style.backgroundColor = '#ee8238';
  }
  else if (this.value >= 20 && this.value <= 40) {
    this.style.backgroundColor = '#79b252';
  }
  else if (this.value > 40) {
    this.style.backgroundColor = '#ffc30d';
  }
})
// ? НЕ ОБЩАЯ
document.getElementById('k-value').addEventListener('change', function () {
  if (this.value < 0) {
    this.value = 0;
  } else if (this.value < 6) {
    this.style.backgroundColor = '#ee8238';
  }
  else if (this.value >= 6 && this.value <= 12) {
    this.style.backgroundColor = '#79b252';
  }
  else if (this.value > 12) {
    this.style.backgroundColor = '#ffc30d';
  }
})