module.exports = {
    gameOptions: {
       reply_markup: JSON.stringify({
           inline_keyboard: [
               [{text: 'Посмотреть 1', callback_data: '1'}, {text: 'Посмотреть 2', callback_data: '2'}, {text: 'Посмотреть 3', callback_data: '3'}],
           ]
       })
   },

   ChoiceOptions: {
       reply_markup: JSON.stringify({
           inline_keyboard: [
               [{text: 'Да', callback_data: 'Yes'}, {text: 'Нет', callback_data: 'No'}],[{text: 'Прошлый месяц', callback_data: 'lastMonth'}],
           ]
       })
   },
   NoChoiceOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Да', callback_data: 'Yes'}],
            ]
        })
    },
    LastMonth: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Посмотреть 1', callback_data: '11'}, {text: 'Посмотреть 2', callback_data: '22'}, {text: 'Посмотреть 3', callback_data: '33'}],
            ]
        })
    }
}