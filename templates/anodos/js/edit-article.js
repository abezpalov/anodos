{% if perms.anodos.add_article %}

// Открытие окна редактирования статьи (новая)
$("body").delegate("[data-do*='open-new-article']", "click", function(){

	// Заполняем значение полей
	$('#edit-article-id').val('0');
	$('#edit-article-title').val('');
	$('#edit-article-content').val('');
	$('#edit-article-alias').val('');
	$('#edit-article-patch').val('');
	$('#edit-article-thumb_src').val('');
	$('#edit-article-intro').val('');
	$('#edit-article-description').val('');
	$('#edit-article-category').val('0');
	$('#edit-article-language').val('0');
	$('#edit-article-source').val('');
	$('#edit-article-source_url').val('');
	$('#edit-article-state').prop('checked', false);
	$('#edit-article-on_main').prop('checked', false);

	// Открываем модальное окно
	$('#modal-edit-article').foundation('reveal', 'open');
	return false;
});

{% endif %}

{% if perms.anodos.change_article %}


// Открытие окна редактирования статьи (существующая)
$("body").delegate("[data-do*='open-edit-article']", "click", function(){

	// Получаем информацию о статье
	$.post("/content/ajax/get-article/", {
		id: $(this).data('id'),
		csrfmiddlewaretoken: '{{ csrf_token }}'
	},
	function(data) {
		if (null != data.status) {
			if ('success' == data.status){

				// Заполняем значение полей
				$('#edit-article-id').val(data.article_id);
				$('#edit-article-title').val(data.article_title);
				$('#edit-article-content').val(data.article_content);
				$('#edit-article-alias').val(data.article_alias);
				$('#edit-article-patch').val(data.article_patch);
				$('#edit-article-thumb_src').val(data.article_thumb_src);
				$('#edit-article-intro').val(data.article_intro);
				$('#edit-article-description').val(data.article_description);
				$('#edit-article-category').val(data.article_category_id);
				$('#edit-article-language').val(data.article_language_id);
				$('#edit-article-source').val(data.article_source);
				$('#edit-article-source_url').val(data.article_source_url);
				$('#edit-article-state').prop('checked', data.article_state);
				$('#edit-article-on_main').prop('checked', data.article_on_main);

				// Открываем модальное окно
				$('#modal-edit-article').foundation('reveal', 'open');

			} else {
				// Показываем сообщение с ошибкой
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
			}
		}
	}, "json");

	return false;
});

{% endif %}

{% if perms.anodos.add_article or perms.anodos.change_article %}


// Сохранение статьи
$("body").delegate("[data-do*='edit-article-save']", "click", function(){
	$.post("/content/ajax/save-article/", {
		id:                  $('#edit-article-id').val(),
		article_title:       $('#edit-article-title').val(),
		article_content:     $('#edit-article-content').val(),
		article_alias:       $('#edit-article-alias').val(),
		article_patch:       $('#edit-article-patch').val(),
		article_thumb_src:   $('#edit-article-thumb_src').val(),
		article_intro:       $('#edit-article-intro').val(),
		article_description: $('#edit-article-description').val(),
		article_category_id: $('#edit-article-category').val(),
		article_language_id: $('#edit-article-language').val(),
		article_source:      $('#edit-article-source').val(),
		article_source_url:  $('#edit-article-source_url').val(),
		article_state:       $('#edit-article-state').prop('checked'),
		article_on_main:     $('#edit-article-on_main').prop('checked'),
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

			if ('success' == data.status){
				$('#article-'+$('#edit-article-id').val()).text($('#edit-article-title').val());
				$('#modal-edit-article').foundation('reveal', 'close');
				setTimeout(function () {location.reload();}, 3000);
			}
		}
	}, "json");
	return false;
});

// Отмена редактирования статьи
$("body").delegate("[data-do*='edit-article-cancel']", "click", function(){
	$('#modal-edit-article').foundation('reveal', 'close');
	return false;
});

{% endif %}

{% if perms.anodos.delete_article %}


// Открытие модального окна удаления статьи
$("body").delegate("[data-do*='open-article-trash']", "click", function(){
	$('#trash-article-id').val($(this).data('id'));
	$('#modal-trash-article').foundation('reveal', 'open');
	return false;
});


// Удаление статьи
$("body").delegate("[data-do*='trash-article']", "click", function(){
	$.post("/content/ajax/trash-article/", {
		id: $('#trash-article-id').val(),
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


// Отмена удаления статьи
$("body").delegate("[data-do*='trash-article-cancel']", "click", function(){
	$('#trash-article-id').val('0');
	$('#modal-trash-article').foundation('reveal', 'close');
	return false;
});

{% endif %}

{% if perms.anodos.change_article %}


// Смена статуса
$("body").delegate("[data-do*='switch-article-state']", "click", function(){
	$.post("/content/ajax/switch-article-state/", {
		id: $(this).data('id'),
		state: $(this).prop('checked'),
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
	return true;
});

{% endif %}
