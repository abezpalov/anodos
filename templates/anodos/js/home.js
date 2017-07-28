// Открыть окно фильтра на закладке категорий
$("body").delegate("button[data-do*='open-filter-items-category']", "click", function(){
	$('#FilterItemsModal').foundation('reveal', 'open');
	$('#CategoryPanelDD').addClass('active');
	$('#VendorPanelDD').removeClass('active');
	$('#SearchPanelDD').removeClass('active');
	$('#CategoryPanel').addClass('active');
	$('#VendorPanel').removeClass('active');
	$('#SearchPanel').removeClass('active');
	return false;
});


// Открыть окно фильтра на закладке производителей
$("body").delegate("button[data-do*='open-filter-items-vendor']", "click", function(){
	$('#FilterItemsModal').foundation('reveal', 'open');
	$('#CategoryPanelDD').removeClass('active');
	$('#VendorPanelDD').addClass('active');
	$('#SearchPanelDD').removeClass('active');
	$('#CategoryPanel').removeClass('active');
	$('#VendorPanel').addClass('active');
	$('#SearchPanel').removeClass('active');
	return false;
});


// Открыть окно фильтра на закладке дополнительных параметров поиска
$("body").delegate("button[data-do*='open-filter-items-search']", "click", function(){
	$('#FilterItemsModal').foundation('reveal', 'open');
	$('#CategoryPanelDD').removeClass('active');
	$('#VendorPanelDD').removeClass('active');
	$('#SearchPanelDD').addClass('active');
	$('#CategoryPanel').removeClass('active');
	$('#VendorPanel').removeClass('active');
	$('#SearchPanel').addClass('active');
	return false;
});


// Открытие/закрытие ветви категорий
$("body").delegate("i[data-do*='switch-li-status']", "click", function(){
	if ($(this).data('state') == 'closed') {
		$(this).parent("li").removeClass('closed');
		$(this).parent("li").addClass('opened');
		$(this).removeClass('fa-plus-square-o');
		$(this).addClass('fa-minus-square-o');
		$(this).data('state', 'opened');
	} else {
		$(this).parent("li").removeClass('opened');
		$(this).parent("li").addClass('closed');
		$(this).removeClass('fa-minus-square-o');
		$(this).addClass('fa-plus-square-o');
		$(this).data('state', 'closed');
	}
	return false;
});


// Выбор категории
$("body").delegate("a[data-do*='filter-items-select-category']", "click", function(){
	$('#filter-items-selected-category').data('id', $(this).data('id'));
	$('#filter-items-selected-category').text($(this).text());
	if ($(this).data('id') == ''){
		$('#filter-items-category').addClass('secondary');
	} else {
		$('#filter-items-category').removeClass('secondary');
	}
	return false;
});


// Выбор производителя
$("body").delegate("a[data-do*='filter-items-select-vendor']", "click", function(){
	$('#filter-items-selected-vendor').data('alias', $(this).data('alias'));
	$('#filter-items-selected-vendor').text($(this).text());
	if ($(this).data('alias') == ''){
		$('#filter-items-vendor').addClass('secondary');
	} else {
		$('#filter-items-vendor').removeClass('secondary');
	}
	return false;
});


// Фильтр списка производителей
$("body").delegate("input[data-do*='filter-items-filter-vendors']", "keypress", function(e){
	var filter_text = $.trim($('#filter-items-filter-vendors').val().toLowerCase());
	var key = e.which;
	if(key == 13) {
		// Скрываем всех, кто не соответствует запросу
		if (filter_text != ''){
			$("div[data-is*='vendor-selector']").each(function(i, e){
				if ($(e).text().toLowerCase().search(filter_text) == -1) {
					$(e).addClass('hidden');
				} else {
					$(e).removeClass('hidden');
				}
			});
		} else {
			$("div[data-is*='vendor-selector']").removeClass('hidden');
		}
		return false;
	}
});


// Введена строка поиска
$("body").delegate("#filter-items-search-input", "change", function(){
	if ($('#filter-items-search-input').val() == ''){
		$('#filter-items-search').addClass('secondary');
	} else {
		$('#filter-items-search').removeClass('secondary');
	}
});


// Применение параметров фильтра
$("body").delegate("button[data-do*='filter-items-run']", "click", function(){

	// Инициализируем переменные
	ct = $('#filter-items-selected-category').data('id');
	ch = $('#filter-items-selected-childs').prop('checked');
	vn = $('#filter-items-selected-vendor').data('alias');
	sr = $.trim($('#filter-items-search-input').val());

	// Формируем URL
	url = '/catalog/products/'

	// Категория
	if (ct != ''){
		url = url + 'c/' + ct;
		if (ch == true) {
			url = url + '-y/';
		} else {
			url = url + '-n/';
		}
	}

	// Производитель
	if (vn != ''){
		url = url + vn + '/';
	}

	// Строка поиска
	if (sr != ''){
		url = url + 'search/' + sr + '/';
	}

	// Переходим по ссылке
	if (ct == '' && vn == '' && sr == '') {
		alert ('Определите хотя бы одно условие выборки.');
	} else {
		$('#FilterItemsModal').foundation('reveal', 'close');
		location.href = url;
	}
});


// Отмена применения параметров фильтра
$("body").delegate("button[data-do*='filter-items-cancel']", "click", function(){
	$('#FilterItemsModal').foundation('reveal', 'close');
	return false;
});


// Поиск по верхней строке поиска
$('#top-search-input').keypress(function (e) {
	var key = e.which;
	if(key == 13) {
		$('#top-search-button').click();
		return false;
	}
});
$("body").delegate("#top-search-button", "click", function(){
	if ($.trim($('#top-search-input').val()) != ''){
		location.href = '/catalog/products/search/' + $.trim($('#top-search-input').val()) + '/';
	}
	return false;
});


// Синхронизация полей поиска (только сверху вниз)
$("body").delegate('#top-search-input', "change", function(){
	$('#filter-items-search-input').val($('#top-search-input').val())
	if ($('#filter-items-search-input').val() == ''){
		$('#filter-items-search').addClass('secondary');
	} else {
		$('#filter-items-search').removeClass('secondary');
	}
});

{% if perms.catalog.change_product %}


// Редактирование элемента
$("body").delegate("a[data-do*='edit-item']", "click", function(){

	// Заполняем значение полей модального окна
	$('#edit-item-id').val($(this).data('id'));
	$.post("/catalog/ajax/get-product/", {
		id: $('#edit-item-id').val(),
		csrfmiddlewaretoken: '{{ csrf_token }}'
	},
	function(data) {
		if (null != data.status) {
			if ('success' == data.status){
				$('#edit-item-name').val(data.product_name)
				$('#edit-item-article').val(data.product_article)
				$('#edit-item-vendor').val(data.product_vendor_id)
				$('#edit-item-category').val(data.product_category_id)
				$('#edit-item-description').val(data.product_description)
				$('#edit-item-double').val(data.product_duble_id)
				$('#edit-item-state').prop('checked', data.product_state)
			}
		}
	}, "json");

	// Открываем модальное окно
	$('#EditItemModal').foundation('reveal', 'open');
	return false;
});


// Сохранение элемента
$("body").delegate("button[data-do*='edit-item-save']", "click", function(){
	$.post("/catalog/ajax/save-product/", {
		id: $('#edit-item-id').val(),
		product_name: $('#edit-item-name').val(),
		product_article: $('#edit-item-article').val(),
		product_vendor_id: $('#edit-item-vendor').val(),
		product_category_id: $('#edit-item-category').val(),
		product_description: $('#edit-item-description').val(),
		product_duble_id: $('#edit-item-double').val(),
		product_state: $('#edit-item-state').prop('checked'),
		csrfmiddlewaretoken: '{{ csrf_token }}'
	},
	function(data) {
		if (null != data.status) {
			var notification = new NotificationFx({
				wrapper : document.body,
				message : '<p>' + data.message + '</p>',
				layout : 'growl',
				effect : 'genie',
				type : data.status,
				ttl : 3000,
				onClose : function() { return false; },
				onOpen : function() { return false; }
			});
			notification.show();
			setTimeout(function () {location.reload();}, 3000);
		}
	}, "json");
	$('#item-'+$('#edit-item-id').val()).text($('#edit-item-name').val());
	$('#EditItemModal').foundation('reveal', 'close');
	return false;
});


$("body").delegate("button[data-do*='edit-item-cancel']", "click", function(){
	$('#EditItemModal').foundation('reveal', 'close');
	return false;
});


$("body").delegate("button[data-do*='trash-item']", "click", function(){
	$.post("/catalog/ajax/trash-category-synonym/", {
		id: $(this).data('id'),
		csrfmiddlewaretoken: '{{ csrf_token }}'
	},
	function(data) {
		if (null != data.status) {
			var notification = new NotificationFx({
				wrapper : document.body,
				message : '<p>' + data.message + '</p>',
				layout : 'growl',
				effect : 'genie',
				type : data.status,
				ttl : 3000,
				onClose : function() { return false; },
				onOpen : function() { return false; }
			});
			notification.show();
			setTimeout(function () {location.reload();}, 3000);
		}
	}, "json");
	return false;
});
{% endif %}


// Просмотр партий
$("body").delegate("a[data-do*='view-parties']", "click", function(){

	// Очищаем содержимое
	$('#ViewPartiesModalContent').html('')

	// Запрашиваем партии на сервере
	$.post("/catalog/ajax/get-parties/", {
		id: $(this).data('id'),
		csrfmiddlewaretoken: '{{ csrf_token }}'
	},
	function(data) {
		if (null != data.status) {
			if ('success' == data.status){
				html_data = ""
				head = "<p>" + data.product['product_name'] + "<br/>Артикул:&nbsp;" + data.product['product_article'] + "<br/>Производитель:&nbsp;" + data.product['vendor_name'] + "</p>"

				// TODO Обработать и вывести данные
				// Если партии товара есть
				if (0 < data.len) {
					// Если получен полный набор данных
					if (true == data.access) {
						thead = "<tr><th>Склад</th><th>Срок поставки</th><th>Количество</th><th>Цена<br/>(вход)</th><th>Цена<br/>(выход)</th></tr>"
						tbody = ""
						for(i = 0; i < data.len; i++) {
							tr = "<tr><td>" + data.items[i]['stock'] + "</td><td>" + data.items[i]['delivery_time_min'] + "&ndash;" + data.items[i]['delivery_time_max'] + "&nbsp;дней</td><td>" + data.items[i]['quantity'] + "</td><td>" + data.items[i]['price'] + "</td><td>" + data.items[i]['price_out'] + "</td></tr>";
							tbody = tbody + tr;
						}
					// Если получен сокращенный набор данных
					} else {
						thead = "<tr><th>Срок поставки</th><th>Количество</th><th>Цена</th></tr>"
						tbody = ""
						for(i = 0; i < data.len; i++) {
							tr = "<tr><td>" + data.items[i]['delivery_time_min'] + "&ndash;" + data.items[i]['delivery_time_max'] + "&nbsp;дней</td><td>" + data.items[i]['quantity'] + "</td><td>" + data.items[i]['price_out'] + "</td></tr>";
							tbody = tbody + tr;
						}
					}
					html_data = head + "<table><thead>" + thead + "</thead><tbody>" + tbody + "</tbody></table>";

				} else {
					html_data = head + '<div class="panel">Товар отсутствует.</div>';
				}
				$('#ViewPartiesModalContent').html(html_data);
			} else {
				var notification = new NotificationFx({
					wrapper: document.body,
					message: '<p>' + data.message + '</p>',
					layout: 'growl',
					effect: 'genie',
					type: data.status,
					ttl: 3000,
					onClose: function() { return false; },
					onOpen: function() { return false; }
				});
				notification.show();
			}
		}
	}, "json");

	// Открываем модальное окно
	$('#ViewPartiesModal').foundation('reveal', 'open');
	return false;
});
