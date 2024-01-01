const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, ChoiceOptions, NoChoiceOptions} = require('./options')
const sequelize = require('./db');
const User = require('./models');

const token = '6130409698:AAERNKONNO6EMT7bA8EEYLKTxIrH8R7Q12c';

const bot = new TelegramApi(token, {polling: true});

const chats = {}

const currentTime = new Date();
const Month = currentTime.getMonth()
//console.log(Month)

const startGame = async (chatId) => {
          //Rand Cards
         const numbers = [];
         while (numbers.length < 36) {
            const randomNum = Math.floor(Math.random() * (36)) + 1;
            if (!numbers.includes(randomNum)) {
               numbers.push(randomNum);
            }
         }
         // разбили массив на куски по 3 эл, объект с двумерным массивом
         const chunkedNumbersCard = SplitArray(numbers, 3); 
         chats[chatId] = chunkedNumbersCard;
         console.log(chats)
         await User.update({ Cards: chunkedNumbersCard }, {
            where: {
              chatId: chatId
            }
          }).then((res) => {
            console.log(res);
          });

          User.findAll({where:{chatId: chatId}, raw: true })
            .then(users=>{
              console.log(users);
            }).catch(err=>console.log(err));

   // await bot.sendMessage(chatId, 'Вам выпало 3 карты', gameOptions);
}

const start = async () => {

   try {
     await sequelize.authenticate();
     await sequelize.sync({force: true}); // {force: true} на всякий пожарный
  } catch (e) {
     // console.log('Подключение к бд сломалось', e)
  }
   bot.setMyCommands([
      {command: '/start', description: 'Приступить'},
      {command: '/info', description: 'Правила'},
   ]);   

   // HI
   bot.on('message', async msg => {
      const chatId = msg.chat.id;
      const text = msg.text
      //console.log(chatId)
      
         if(text == '/start') {

         //   await User.create({
         //      chatId: chatId
         //    })//.then(res=>{
            //    console.log(res);
            //  }).catch(err=>console.log(err));

        await User.findOne({ where: { chatId }})
         .then((user) => {
            if (user) {
               // Запись с таким chatId уже существует
               console.log('Запись уже существует');
            } else {
               // Создаем новую запись
               return User.create({
                  chatId: chatId
                }), startGame(chatId)
                
               .then((newUser) => {
                  console.log('Новая запись создана:', newUser);
               })
               .catch((error) => {
                  console.log('Ошибка при создании записи:');
               });
         }
         })
         .catch((error) => {
         console.log('Ошибка при поиске записи:', error);
    
  });
            await bot.sendPhoto(chatId, './pictures/Main.jpg');
            return bot.sendMessage(chatId, `Привет, ${msg.from.first_name}! Хочешь сделать расклад?`, ChoiceOptions);
               
         }  
         if(text == '/info') {
               // const user = await UserModel.findOne({chatId})
               // console.log(user)
               const information = `
                  Целый год мы будем читать признанные и непризнанные шедевры мировой литературы, скрупулезно отобранные нами.
                  Условия марафона:
                  1. Подписаться на каналы организаторов:
                  Павловская || книги в руки  (pibookworms)
                  Литературная гостиная Джейн Остин (literary_lounge)
                  читать немедЛена (lemosina1)
                  2. У каждого участника есть возможность получить один карточный расклад в месяц. В раскладе волей случая выпадают три карты, в каждой по три книги, объединенные одной темой - значением карты.
                  3. Необходимо прочитать по одному произведению  с каждой выпавшей карты. После публикации трёх отзывов на прочитанную тройку произведений участник получает один номерок. Участник также может прочесть и опубликовать отзывы на 6 книг из расклада (по две из каждой карты) или все 9 книг расклада. За каждую дополнительную тройку прочитанного также присваивается по одному номерку. Максимально можно заработать три номерка за расклад.
                  4.  Требования к отзывам:
                  -объем не менее 1500 знаков,
                  -текст не должен копирайтить аннотацию, а быть содержательным мнением о прочитанном произведении.
                  - в теле отзыва необходимо указать хэштег #три_карты. 
                  - отметить организаторов. 
                  Ссылки на отзывы или сам отзыв (если у вас нет канала) нужно прислать в чат “Отзывы”
                  5. Сроки проведения марафона: с 1 января 2024г. по 31 декабря 2024г.
                  6. Призы за участие в марафоне. 
                  Ежемесячно мы будем рандомно выбирать 1 участника, прочитавшего три книги из трех карт, и дарить ему издание классической литературы в мягкой обложке. 
                  По итогам марафона в конце года будут определены победители:
                  • 1 место - среди всех участников рандомно будет определен победитель, который получит книги-хотелки в пределах 1000 рублей; 
                  • 2 место - среди участников, закрывших все месяцы (прочитавших по три книги из трех  карт каждый месяц) рандомно будет определен победитель, который получит книгу-хотелку в пределах 500 рублей;
                  • 3 место (приз организаторских сердец) - участник, поразивший организаторов чуткостью анализа произведений, получит специальный приз. 
                  Призы победителям отправим/закажем на территории РФ.` 
            return bot.sendMessage(chatId, information)
         }

     // } catch (e) {
     //    return bot.sendMessage(chatId, 'Произошла какая-то ошибочка!)');
     // }
      
});
   
   //Buttons of choice
   bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if(data === 'Yes') {        
         
         // return startGame(chatId); // не забыть условие
         await bot.sendMessage(chatId, 'Вам выпало 3 карты', gameOptions);
      }
      if(data === 'No') {
         await bot.sendSticker(chatId, 'https://media.stickerswiki.app/ks_cahek/1019375.160.webp');
         await bot.sendMessage(chatId, 'А сейчас ?', NoChoiceOptions);
      }

      const user = await User.findOne({where: {chatId: chatId}})
      if(data === '1') {      
         await bot.sendPhoto(chatId, './pictures/' + user.Cards[Month][0] + '.jpg');
      }
      if(data === '2') {
         await bot.sendPhoto(chatId, './pictures/' + user.Cards[Month][1] + '.jpg');
      }
      if(data === '3') {
         await bot.sendPhoto(chatId, './pictures/' + user.Cards[Month][2] + '.jpg');
      }
      await user.save();
   })

}
////////////////////////// FUNC
function SplitArray(array, chunkSize) {
   const result = [];
   for (let i = 0; i < array.length; i += chunkSize) {
     const chunk = array.slice(i, i + chunkSize);
     result.push(chunk);
   }
   return result;
 }
start();