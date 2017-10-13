// Включаем вкладки
$('.menu .item').tab();

// Включаем прилипающее верхнее меню
$('.main.menu').visibility({type: 'fixed'});

// Включаем раскрывающиеся пункты меню при наведении
$('.main.menu  .ui.dropdown').dropdown({on: 'hover'});
