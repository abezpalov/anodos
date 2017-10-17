{% if user.is_authenticated %}

// Открыть окно профиля
$("body").delegate("[data-do*='open-profile']", "click", function(e){
    $('#modal-profile').modal('show');
});

// Выйти
$("body").delegate("[data-do='apply-logout']", "click", function(){
    $.post('/ajax/logout/', {
        csrfmiddlewaretoken : '{{ csrf_token }}'
    },
    function(data) {
        if (data.status == 'success'){
            location.reload();
        }
    }, "json");
    return false;
});

{% else %}

// Открыть окно авторизации
$("body").delegate("[data-do='open-login']", "click", function(){
    $('#modal-login').modal('show');
    return false;
});

// Авторизоваться
$("body").delegate("[data-do='apply-login']", "click", function(){
    $.post('/ajax/login/', {
        username: $('#login-username').val(),
        password: $('#login-password').val(),
        csrfmiddlewaretoken: '{{ csrf_token }}'
    },
    function(data) {
        if (data.status == 'success'){
            location.reload();
        } else if (data.status == 'error'){
            $('#modal-login-alert').html('<div class="ui message"><i class="close icon"></i><div class="header">Ошибка!</div>' + data.message + '</div>');
        }
    }, "json");
    return false;
});

// Открыть окно регистрации
$("body").delegate("[data-do='open-register']", "click", function(){
    $('#modal-register').modal('show');
    return false;
});

// Обновление логина при изменении имени
$("body").delegate("#register-firstname", "change", function(){
    $.post('/ajax/create-username/', {
        firstname: $('#register-firstname').val(),
        lastname: $('#register-lastname').val(),
        csrfmiddlewaretoken: '{{ csrf_token }}'
    },
    function(data) {
        if (data.status == 'success'){
            $('#register-username').val(data.username);
        }
    }, "json");
    return false;
});

// Обновление логина при изменении фамилии
$("body").delegate("#register-lastname", "change", function(){
    $.post('/ajax/create-username/', {
        firstname: $('#register-firstname').val(),
        lastname: $('#register-lastname').val(),
        csrfmiddlewaretoken: '{{ csrf_token }}'
    },
    function(data) {
        if (data.status == 'success'){
            $('#register-username').val(data.username);
        }
    }, "json");
    return false;
});

// TODO Зарегистрироваться
$("body").delegate("[data-do='register-apply']", "click", function(){
    $.post('/ajax/register/', {
        firstname: $('#register-firstname').val(),
        lastname: $('#register-lastname').val(),
        username: $('#register-username').val(),
        email: $('#register-email').val(),
        password1: $('#register-password1').val(),
        password2: $('#register-password2').val(),
        csrfmiddlewaretoken: '{{ csrf_token }}'
    },
    function(data) {
        if (data.status == 'success'){
            location.reload();
        } else if (data.status == 'error'){
            $('#modal-register-alert').html('<div class="ui message"><i class="close icon"></i><div class="header">Ошибка!</div>' + data.message + '</div>');
        }
    }, "json");
    return false;
});

{% endif %}
