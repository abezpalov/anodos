$("body").delegate("button[data-do*='add-category']", "click", function(){
	$.post("/content/ajax/add-category/", {
		name: $("#new-category-name").val(),
		parent:  $("#new-category-parent").val(),
		csrfmiddlewaretoken: '{{ csrf_token }}'
	},
	function(data) {
		if (null != data.status) {
			$("#new-category-name").val('');
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

$("body").delegate("input[data-do*='switch-category-state']", "click", function(){
	$.post("/content/ajax/switch-category-state/", {
		id: $(this).data('id'),
		state: $(this).prop("checked"),
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
		}
	}, "json");
	return true;
});

$("body").delegate("button[data-do*='trash-category']", "click", function(){
	$.post("/content/ajax/trash-category/", {
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

$("body").delegate("a[data-do*='edit-category']", "click", function(){

	// Заполняем значение полей модального окна
	$('#edit-category-id').val($(this).data('id'));
	$('#edit-category-alias').val($(this).data('alias'));
	$('#edit-category-name').val($(this).text());

	// Открываем модальное окно
	$('#EditCategoryModal').foundation('reveal', 'open');
	return false;
});

$("body").delegate("button[data-do*='edit-category-save']", "click", function(){
	$.post("/content/ajax/save-category/", {
		id: $('#edit-category-id').val(),
		name: $('#edit-category-name').val(),
		alias: $('#edit-category-alias').val(),
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
		}
	}, "json");
	$('#item-'+$('#edit-category-id').val()).data('alias', $('#edit-category-alias').val());
	$('#item-'+$('#edit-category-id').val()).text($('#edit-category-name').val());
	$('#EditCategoryModal').foundation('reveal', 'close');
	return false;
});

$("body").delegate("button[data-do*='edit-category-cancel']", "click", function(){
	$('#EditСategoryModal').foundation('reveal', 'close');
	return false;
});
