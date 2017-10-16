// Включаем вкладки
$('.menu .item').tab();

// Закрываем сообщение при нажатии на крестик
$('.message .close').on('click', function() {
    $(this).closest('.message').transition('fade');
});

// Включаем прилипающее верхнее меню
$('.main.menu').visibility({type: 'fixed'});

// Включаем раскрывающиеся пункты меню при наведении
$('.main.menu  .ui.dropdown').dropdown({on: 'hover'});
