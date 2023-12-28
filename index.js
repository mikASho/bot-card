const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, ChoiceOptions, NoChoiceOptions} = require('./options')
const token = '6130409698:AAERNKONNO6EMT7bA8EEYLKTxIrH8R7Q12c';

const bot = new TelegramApi(token, {polling: true});

const chats = {}
const oneAuthDate = {}
people = [];

const currentTime = new Date();
const Month = currentTime.getMonth()
console.log(Month)

const startGame = async (chatId) => {
   await bot.sendPhoto(chatId, './pictures/Main.jpg');
   await bot.sendMessage(chatId, 'Вам выпало 3 карты', gameOptions);
   
   flag = false;
   for(let i = 0; people.length > i; i++) {
      if(chatId == people[i]) {
         flag = true;
      }
   }  
      if(!flag) {  
         people.push(chatId);
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
      }
      console.log(people)
}

const start = async () => {

   bot.setMyCommands([
      {command: '/start', description: 'Приступить'},
      {command: '/info', description: 'Правила'},
   ]);   

   // HI
   bot.on('message', async msg => {
      const chatId = msg.chat.id;
      console.log(typeof chatId)
      await bot.sendMessage(chatId, `Привет, ${msg.from.first_name} ! Хочешь сделать расклад?`, ChoiceOptions);
   })
   
   //Buttons of choice
   bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if(data === 'Yes') {        
         return startGame(chatId);

      }
      if(data === 'No') {
         await bot.sendSticker(chatId, 'https://media.stickerswiki.app/ks_cahek/1019375.160.webp');
         await bot.sendMessage(chatId, 'А сейчас ?', NoChoiceOptions);
      }

      if(data === '1') {       
         await bot.sendPhoto(chatId, './pictures/' + chats[chatId][Month][0] + '.jpg');
      }
      if(data === '2') {
         await bot.sendPhoto(chatId, './pictures/' + chats[chatId][Month][1] + '.jpg');
      }
      if(data === '3') {
         await bot.sendPhoto(chatId, './pictures/' + chats[chatId][Month][2] + '.jpg');

      }
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