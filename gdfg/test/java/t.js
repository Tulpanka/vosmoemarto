const headElem = document.getElementById("head");
const buttonsElem = document.getElementById("buttons");
const pagesElem = document.getElementById("pages");

// по нему настройка теста как в .
class Quiz
{
	constructor(type, questions, results)
	{

		this.type = type;

		//Массив с вопросами
		this.questions = questions;

		//Массив с возможными результатами
		this.results = results;

		//Количество набранных очков
		this.score = 0;

		//Номер результата из массива
		this.result = 0;

		//Номер вопроса(на котором)
		this.current = 0;
	}

	Click(index)
	{
		//Добавляем очки
		let value = this.questions[this.current].Click(index);
		this.score += value;

		let correct = -1;

		//Если было добавлено очко то ответ верный
		if(value >= 1)
		{
			correct = index;
		}
		else
		{
			//Иначе ищем какой ответ может быть правильным
			for(let i = 0; i < this.questions[this.current].answers.length; i++)
			{
				if(this.questions[this.current].answers[i].value >= 1)
				{
					correct = i;
					break;
				}
			}
		}

		this.Next();

		return correct;
	}

	//Переход к следующему вопросу
	Next()
	{
		this.current++;
		
		if(this.current >= this.questions.length) 
		{
			this.End();
		}
	}

	//когда вопросы кончились провериткакой результат получился
	End()
	{
		for(let i = 0; i < this.results.length; i++)
		{
			if(this.results[i].Check(this.score))
			{
				this.result = i;
			}
		}
	}
} 

//Класс вопрос
class Question 
{
	constructor(text, answers)
	{
		this.text = text; 
		this.answers = answers; 
	}

	Click(index) 
	{
		return this.answers[index].value; 
	}
}

//Класс ответ
class Answer 
{
	constructor(text, value) 
	{
		this.text = text; 
		this.value = value; 
	}
}

//Класс результат
class Result 
{
	constructor(text, value)
	{
		this.text = text;
		this.value = value;
	}

	// проверяет достаточно ли очков для вывода результатов
	Check(value)
	{
		if(this.value <= value)
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
}

//Массив с результатами
const results = 
[
	new Result("от 0 до 1 Это провал! - оценка: 2, попробуй ещё раз" , 0),
	new Result("от 2 до 3 Уже лучше но на троечку, вот твой утешительный приз: (напиши Никите оценку)", 2),
	new Result("от 4 Вот это уровень! Не зря учишься на физмате! Чтобы получить приз: (напиши Никите оценку - 4)", 4),
	new Result("Всё верно! Не понимаю, зачем тебе эта информация в голове, но ты молодец! Чтобы получить приз: (напиши Никите оценку - 5)", 6)
];

//Массив с вопросами
const questions = 
[
	new Question(" Когда в ВГПУ день открытых дверей? = ",
	[
		new Answer("3 12", 0),
		new Answer("1 10", 0),
		new Answer("5 12", 1),
		new Answer("Не помню", 0)
	]),

	new Question("Тайна макфлури = ",
	[
		new Answer("Не знаю", 0),
		new Answer("Знаю", 0),
		new Answer("К сожалению, никогда не узнаю", 1),
		new Answer("Узнать правильный ответ", 0)
	]),

	new Question("Чсло Пи = ",
	[
		new Answer("Door", 0),
		new Answer("3,14", 1),
		new Answer("3,13", 0),
		new Answer("Не обязана", 0)
	]),

	new Question("Не рожала .... = ",
	[
		new Answer("Не женщина", 1),
		new Answer("Кто рожал?", 0),
		new Answer("Нет", 0),
		new Answer("Да", 0)
	]),

	new Question(" Какое сегодня число? = ",
	[
		new Answer("2", 0),
		new Answer("8", 1),
		new Answer("1", 0),
		new Answer("10", 0)
	]),

	new Question("В каком году родился Стивен Хокинг ? ",
	[
		new Answer("1937", 0),
		new Answer("1949", 0),
		new Answer("1942", 1),
		new Answer("1953", 0)
	])
];

//Сам тест
const quiz = new Quiz(1, questions, results);

Update();

//Обновление теста
function Update()
{
	//Проверяет есть ли ещё вопросы если нет то результат
	if(quiz.current < quiz.questions.length)
	{
		//Если есть то меняет вопрос в заголовке
		headElem.innerHTML = quiz.questions[quiz.current].text;

		//Удаляет старые варианты ответов
		buttonsElem.innerHTML = "";

		//Создаёт кнопки для новых вариантов ответов
		for(let i = 0; i < quiz.questions[quiz.current].answers.length; i++)
		{
			let btn = document.createElement("button");
			btn.className = "button";

			btn.innerHTML = quiz.questions[quiz.current].answers[i].text;

			btn.setAttribute("index", i);

			buttonsElem.appendChild(btn);
		}
		
		//Выводим номер текущего вопроса
		pagesElem.innerHTML = (quiz.current + 1) + " / " + quiz.questions.length;

		//следующие вопросы (обновляется алгоритм)
		Init();
	}
	else
	{
		//Если это конец то выводим результат
		buttonsElem.innerHTML = "";
		headElem.innerHTML = quiz.results[quiz.result].text;
		pagesElem.innerHTML = "Очки: " + quiz.score;
	}
}

function Init()
{
	//Находим все кнопки
	let btns = document.getElementsByClassName("button");

	for(let i = 0; i < btns.length; i++)
	{

		//При нажатии на кнопку будет функция клик (переход_)
		btns[i].addEventListener("click", function (e) { Click(e.target.getAttribute("index")); });
	}
}

function Click(index) 
{
	//правльный ответ (номер)
	let correct = quiz.Click(index);

	//все кнопки
	let btns = document.getElementsByClassName("button");

	//серые кнопки (пустные)
	for(let i = 0; i < btns.length; i++)
	{
		btns[i].className = "button button_passive";
	}

	//зелёныи или красным
	if(quiz.type == 1)
	{
		if(correct >= 0)
		{
			btns[correct].className = "button button_correct";
		}

		if(index != correct) 
		{
			btns[index].className = "button button_wrong";
		} 
	}
	else
	{
		//верно отвтет зелёный
		btns[index].className = "button button_correct";
	}

	//Ждём секунду и обновляем тест
	setTimeout(Update, 1000);
}