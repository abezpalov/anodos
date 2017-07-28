// Open login modal window
$("body").delegate("[data-do*='open-login']", "click", function(){
	$('#modal-login').foundation('open');
	return false;
});


// Close login modal window
$("body").delegate("[data-do*='login-cancel']", "click", function(){
	$('#modal-login').foundation('close');
	return false;
});


// Login apply
$("body").delegate("[data-do='login-apply']", "click", function(){

	$.post('/ajax/login/', {
		username : $('#login-username').val(),
		password : $('#login-password').val(),
		csrfmiddlewaretoken : '{{ csrf_token }}'
	},
	function(data) {

		if ('success' == data.status){

			$('#modal-login').foundation('close');

			setTimeout(function () {location.reload();}, 100);

		} else if ('error' == data.status){

			$('#modal-login-alert').html('<div data-alert class = "alert-box alert">' + data.message + '</div>');

		}

	}, "json");

	return false;
});


// Open register modal wondow
$("body").delegate("[data-do*='open-register']", "click", function(){
	$('#modal-register').foundation('open');
	return false;
});


// Close register modal window
$("body").delegate("[data-do*='register-cancel']", "click", function(){
	$('#modal-register').foundation('close');
	return false;
});


// Register firstname change
$("body").delegate("#register-firstname", "change", function(){

	$.post('/ajax/create-username/', {
		firstname : $('#register-firstname').val(),
		lastname  : $('#register-lastname').val(),
		csrfmiddlewaretoken : '{{ csrf_token }}'
	},
	function(data) {

		if ('success' == data.status){

			$('#register-username').val(data.username);
			$('#modal-register-alert').html('');

		}

	}, "json");

	return false;
});


// Register lastname change
$("body").delegate("#register-lastname", "change", function(){

	$.post('/ajax/create-username/', {
		firstname : $('#register-firstname').val(),
		lastname  : $('#register-lastname').val(),
		csrfmiddlewaretoken : '{{ csrf_token }}'
	},
	function(data) {

		if ('success' == data.status){

			$('#register-username').val(data.username);
			$('#modal-register-alert').html('');

		}

	}, "json");

	return false;
});


// TODO register-apply

$("body").delegate("[data-do='register-apply']", "click", function(){

	$.post('/ajax/register/', {
		firstname : $('#register-firstname').val(),
		lastname  : $('#register-lastname').val(),
		username  : $('#register-username').val(),
		email     : $('#register-email').val(),
		password1 : $('#register-password1').val(),
		password2 : $('#register-password2').val(),
		csrfmiddlewaretoken : '{{ csrf_token }}'
	},
	function(data) {

		if ('success' == data.status){

			$('#modal-edit-' + model).foundation('close');

			setTimeout(function () {location.reload();}, 100);

		} else if ('error' == data.status){

			// TODO вывести ошибки

		}



	}, "json");

	return false;
});


$("body").delegate("[data-do*='open-profile']", "click", function(){
	$('#modal-profile').foundation('open');
	return false;
});
