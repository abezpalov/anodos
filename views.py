from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext, loader
from django.contrib.auth import authenticate, login, logout


def home(request):
    "Представление: главная страница."

    # Импортируем
    from anodos.models import Article

    # Получаем списки объектов
    articles = Article.objects.all().filter(state = True).filter(on_main = True)

    return render(request, 'anodos/home.html', locals())


def article(request, article_id = None):
    "Представление: статья."

    # Импортируем
    from anodos.models import Article

    try:
        article = Article.objects.get(id = article_id)
    except Article.DoesNotExist:
        return HttpResponse(status = 404)

    return render(request, 'anodos/article.html', locals())


def articles(request):
    "Представление: список статей (с возможностью редактирования)."

    # Импортируем
    from anodos.models import Article, Category, Language

    # Проверяем права доступа TODO TEST
    if request.user.has_perm('anodos.change_article'):

        # Получаем списки объектов
        articles = Article.objects.all().order_by('-created')
        categories = []
        categories = getCategoryTree(categories)
        for category in categories:
            category.name = '— ' * category.level + category.name
        languages = Language.objects.all()

    return render(request, 'anodos/articles.html', locals())


def content(request, string):

    return render(request, 'anodos/article.html', locals())



def editCategories(request):
    "Представление: список категорий (с возможностью редактирования)."

    # Проверяем права доступа
    if request.user.has_perm('anodos.change_category'):

        # Импортируем
        from anodos.models import Category

        # Получаем дерево категорий
        categories = []
        categories = getCategoryTree(categories)
        for category in categories:
            category.name = '— ' * category.level + category.name

    return render(request, 'anodos/edit-categories.html', locals())


def getCategoryTree(tree, parent = None): # TODO Избавиться от рекурсии
    "Функция: дерево категорий (используется рекурсия)."

    # Импортируем
    from anodos.models import Category

    # Получаем список дочерних категорий
    categories = Category.objects.filter(parent=parent)

    # Проходим по списку категорий с рекурсивным погружением
    for category in categories:
        tree.append(category)
        tree = getCategoryTree(tree, category)

    # Возвращаем результат
    return tree




def ajaxGetArticle(request):
    "AJAX-представление: получение данных статьи."

    # Импортируем
    import json
    from anodos.models import Article

    # Проверяем права доступа
    if not request.user.has_perm('anodos.change_article'):
        result = {
            'status': 'alert',
            'message': 'Ошибка 403: отказано в доступе.'}
        return HttpResponse(json.dumps(result), 'application/javascript')

    # Получаем объект
    try:
        article = Article.objects.get(id = request.POST.get('id'))

        # Проверяем
        if article.category: article_category_id = article.category.id
        else: article_category_id = 0
        if article.language: article_language_id = article.language.id
        else: article_language_id = 0

        result = {
            'status': 'success',
            'message': 'Данные статьи получены.',
            'article_id': article.id,
            'article_title': article.title,
            'article_content': article.content,
            'article_alias': article.alias,
            'article_patch': article.patch,
            'article_thumb_src': article.thumb_src,
            'article_intro': article.intro,
            'article_description': article.description,
            'article_category_id': article_category_id,
            'article_language_id': article_language_id,
            'article_source': article.source,
            'article_source_url': article.source_url,
            'article_state': article.state,
            'article_on_main': article.on_main}

    except Article.DoesNotExist:
        result = {
            'status': 'alert',
            'message': 'Ошибка: статья отсутствует в базе.'}

    return HttpResponse(json.dumps(result), 'application/javascript')


def ajaxSaveArticle(request):
    "AJAX-представление: сохранение статьи."

    # Импортируем
    import json
    from django.utils import timezone
    from anodos.models import Article, Category, Language

    # Проверяем тип запроса
    if (not request.is_ajax()) or (request.method != 'POST'):
        return HttpResponse(status = 400)

    # Проверяем права доступа
    try:
        article = Article.objects.get(id = request.POST.get('id'))
        if not request.user.has_perm('anodos.change_article'):
            return HttpResponse(status = 403)
    except Article.DoesNotExist:
        article = Article()
        if not request.user.has_perm('anodos.add_article'):
            return HttpResponse(status = 403)
        article.created = timezone.now()
        article.created_by = "{} {}".format(request.user.first_name, request.user.last_name)

    # title
    if not request.POST.get('article_title').strip():
        result = {
            'status': 'alert',
            'message': 'Ошибка: отсутствует заголовок.'}
        return HttpResponse(json.dumps(result), 'application/javascript')
    article.title   = request.POST.get('article_title').strip()[:100]

    # content
    if not request.POST.get('article_content').strip():
        result = {
            'status': 'alert',
            'message': 'Ошибка: отсутствует содержание статьи.'}
        return HttpResponse(json.dumps(result), 'application/javascript')
    article.content = request.POST.get('article_content').strip()

    # alias
    if request.POST.get('article_alias').strip():
        article.alias = request.POST.get('article_alias').strip()[:100]

    # patch
    if request.POST.get('article_patch').strip():
        article.patch = request.POST.get('article_patch').strip()[:512]

    # thumb_src
    if request.POST.get('article_thumb_src').strip():
        article.thumb_src = request.POST.get('article_thumb_src').strip()[:512]

    # intro
    if request.POST.get('article_intro').strip():
        article.intro = request.POST.get('article_intro').strip()
    else:
        article.intro = request.POST.get('article_content').strip()

    # description
    if request.POST.get('article_description').strip():
        article.description = request.POST.get('article_description').strip()
    else:
        article.description = ''

    # category
    try:
        article.category = Category.objects.get(id = request.POST.get('article_category_id'))
    except Category.DoesNotExist:
        article.category = None

    # language
    try:
        article.language = Language.objects.get(id = request.POST.get('article_language_id'))
    except Language.DoesNotExist:
        article.language = None

    # source
    if request.POST.get('article_source').strip():
        article.source = request.POST.get('article_source').strip()[:512]

    # source_url
    if request.POST.get('article_source_url').strip():
        article.source_url = request.POST.get('article_source_url').strip()[:512]

    # state
    if request.POST.get('article_state') == 'true':
        article.state = True
    else:
        article.state = False

    # on_main
    if request.POST.get('article_on_main') == 'true':
        article.on_main = True
    else:
        article.on_main = False

    # modified
    article.modified = timezone.now()
    article.modified_by = "{} {}".format(request.user.first_name, request.user.last_name)

    # published
    if article.state:
        article.published = timezone.now()
        article.published_by = "{} {}".format(request.user.first_name, request.user.last_name)

    # Сохраняем статью
    article.save()

    # Возвращаем ответ
    result = {
        'status': 'success',
        'message': 'Статья сохранена.'}

    return HttpResponse(json.dumps(result), 'application/javascript')


def ajaxAddCategory(request):
    "AJAX-представление: добавление категории."

    # Импортируем
    from anodos.models import Category
    from django.db.models import Max
    from datetime import datetime
    import json

    # Проверяем тип запроса
    if (not request.is_ajax()) or (request.method != 'POST'):
        return HttpResponse(status = 400)

    # Проверяем права доступа
    if not request.user.has_perm('anodos.change_category'):
        return HttpResponse(status = 403)

    # Проверяем на пустые значения
    if (request.POST.get('name').strip() == '') or (request.POST.get('parent').strip() == ''):
        result = {'status': 'warning', 'message': 'Пожалуй, вводные данные не корректны.'}
    else:

        name = request.POST.get('name').strip()

        alias = name.lower()
        alias = alias.replace(' ', '-')

        if (request.POST.get('parent').strip() == 'null'):
            parent = None
            level = 0
        else:
            try:
                parent = Category.objects.get(id = request.POST.get('parent').strip())
                level = parent.level + 1
            except Category.DoesNotExist: # Указанная родительская категория не существует
                return HttpResponse(status = 406)

        category = Category(name=name, alias=alias, parent=parent, level=level, order=-1, path='', created=datetime.now(), modified=datetime.now())
        category.save()

        if (parent == None):
            category.path = '/' + str(category.id) + '/'
        else:
            category.path = parent.path + str(category.id) + '/'

        category.order = Category.objects.filter(parent=category.parent).aggregate(Max('order'))['order__max'] + 1

        category.save()

        if (parent == None):
            parentId = 'none'
        else:
            parentId = parent.id

    result = {
        'status': 'success',
        'message': 'Категория {} добавлена.'.format(name),
        'categoryId': category.id,
        'categoryName': category.name,
        'categoryAlias': category.alias,
        'parentId': parentId}

    # Получаем дерево категорий
    categories = []
    categories = getCategoryTree(categories)

    # Проводим общую нумерацию категорий
    for order, category in enumerate(categories):
        category.order = order
        category.save()

    # Возвращаем ответ
    return HttpResponse(json.dumps(result), 'application/javascript')


def ajaxSwitchCategoryState(request):
    "AJAX-представление: изменение статуса категории."

    # Импортируем
    from anodos.models import Category
    from datetime import datetime
    import json

    # Проверяем тип запроса
    if (not request.is_ajax()) or (request.method != 'POST'):
        return HttpResponse(status = 400)

    # Проверяем права доступа
    if not request.user.has_perm('anodos.change_category'):
        return HttpResponse(status = 403)

    # Проверяем корректность вводных данных
    if not request.POST.get('id') or not request.POST.get('state'):
        result = {'status': 'warning', 'message': 'Пожалуй, вводные данные не корректны.'}
    else:
        try:
            category = Category.objects.get(id = request.POST.get('id'))
            if request.POST.get('state') == 'true':
                category.state = True;
            else:
                category.state = False;
            category.save();
            result = {'status': 'success', 'message': 'Статус категории {} изменен на {}.'.format(category.name, category.state)}
        except Category.DoesNotExist:
            result = {'status': 'alert', 'message': 'Категория с идентификатором {} отсутствует в базе.'.format(request.POST.get('id'))}

    # Возвращаем ответ
    return HttpResponse(json.dumps(result), 'application/javascript')


def ajaxSaveCategory(request):
    "AJAX-представление: сохранение категории."

    # Импортируем
    from anodos.models import Category
    from datetime import datetime
    import json

    # Проверяем тип запроса
    if (not request.is_ajax()) or (request.method != 'POST'):
        return HttpResponse(status = 400)

    # Проверяем права доступа
    if not request.user.has_perm('anodos.change_category'):
        return HttpResponse(status = 403)

    if not request.POST.get('id') or not request.POST.get('name') or not request.POST.get('alias') :
        result = {'status': 'warning', 'message': 'Пожалуй, вводные данные не корректны.'}
    else:
        try:
            category = Category.objects.get(id=request.POST.get('id'))
            category.name = request.POST.get('name')
            category.alias = request.POST.get('alias')
            if request.POST.get('description'): category.description = request.POST.get('description')
            category.save()
            result = {'status': 'success', 'message': 'Изменения категории {} сохранены.'.format(category.name)}
        except Category.DoesNotExist:
            result = {'status': 'alert', 'message': 'Категория с идентификатором {} отсутствует в базе.'.format(request.POST.get('id'))}

    # Возвращаем ответ
    return HttpResponse(json.dumps(result), 'application/javascript')


def ajaxTrashCategory(request):
    "AJAX-представление: удаление категории."

    # Импортируем
    from anodos.models import Category
    from datetime import datetime
    import json

    # Проверяем тип запроса
    if (not request.is_ajax()) or (request.method != 'POST'):
        return HttpResponse(status = 400)

    # Проверяем права доступа
    if not request.user.has_perm('anodos.change_category'):
        return HttpResponse(status = 403)

    if not request.POST.get('id'):
        result = {'status': 'warning', 'message': 'Пожалуй, вводные данные не корректны.'}
    else:
        try:
            category = Category.objects.get(id = request.POST.get('id'))
            category.delete()
            result = {'status': 'success', 'message': 'Категория удалена.'}
        except Category.DoesNotExist:
            result = {'status': 'alert', 'message': 'Категория с идентификатором {} отсутствует в базе.'.format(request.POST.get('id'))}

    # Возвращаем ответ
    return HttpResponse(json.dumps(result), 'application/javascript')


def logs(request):
    "Представление: логи."

    # Импортируем
    from anodos.models import Log

    # Проверяем права доступа
    if request.user.has_perm('anodos.change_log'):

        # Получаем списки объектов
        logs = Log.objects.all().order_by('-created')

    return render(request, 'anodos/logs.html', locals())


def ajax_login(request):
    "AJAX-представление: Log-in."

    import json
    import anodos.models

    if (not request.is_ajax()) or (request.method != 'POST'):
        return HttpResponse(status = 400)


    username = request.POST.get('username')
    password = request.POST.get('password')

    user = authenticate(username = username, password = password)

    if user is None:
        result = {
            'status'  : 'error',
            'message' : 'Имя пользователя или пароль не корректны {} {}.'.format(username, password)}
    elif user.is_active:
        login(request, user)
        result = {'status' : 'success'}
    else:
        result = {
            'status'  : 'error',
            'message' : 'Пользователь заблокирован.'}

    return HttpResponse(json.dumps(result), 'application/javascript')


def ajax_logout(request):
    "AJAX-представление: Log-out"

    import json
    import anodos.models

    if (not request.is_ajax()) or (request.method != 'POST'):
        return HttpResponse(status = 400)

    logout(request)

    result = {'status' : 'success'}

    return HttpResponse(json.dumps(result), 'application/javascript')


def ajax_create_username(request):
    "AJAX-представление: Create Username."

    import json
    import anodos.models
    from django.contrib.auth.models import User

    if (not request.is_ajax()) or (request.method != 'POST'):
        return HttpResponse(status = 400)

    firstname = request.POST.get('firstname').strip()
    lastname  = request.POST.get('lastname').strip()

    if firstname and lastname:

        username = "{}.{}".format(firstname, lastname)

        username = fix_username(username)

        # TODO Проверить существование пользователя

        result = {
            'status'   : 'success',
            'username' : username}

    elif not firstname and not lastname:
        result = {
            'status'  : 'info',
            'message' : 'Не указаны имя и фамилия.'}

    elif not firstname:
        result = {
            'status'  : 'info',
            'message' : 'Не указано имя.'}

    elif not lastname:
        result = {
            'status'  : 'info',
            'message' : 'Не указана фамилия.'}

    return HttpResponse(json.dumps(result), 'application/javascript')


# TODO
def ajax_register(request):
    "AJAX-представление: Register."

    from django.contrib.auth.models import User

    if request.method == 'POST':
        username  = request.POST.get('username').strip()
        password1 = request.POST.get('password1').strip()
        password2 = request.POST.get('password2').strip()
        email     = request.POST.get('email').strip()
        firstname = request.POST.get('firstname').strip()
        lastname  = request.POST.get('lastname').strip()

        redirect_url = request.POST.get('redirect')
        if not redirect_url: redirect_url = '/'

        # TODO Проверить вводные данные

        if not username:
            result = {
                'status'  : 'info',
                'message' : 'Не указано имя пользователя.'}
            return HttpResponse(json.dumps(result), 'application/javascript')

        if not password1:
            result = {
                'status'  : 'info',
                'message' : 'Не указан пароль.'}
            return HttpResponse(json.dumps(result), 'application/javascript')

        if password1 != password2:
            result = {
                'status'  : 'info',
                'message' : 'Пароли не совпадают.'}
            return HttpResponse(json.dumps(result), 'application/javascript')

        if not email:
            result = {
                'status'  : 'info',
                'message' : 'Не указана электронная почта (без неё мы не сможем восстановить учётную запись при необходимости).'}
            return HttpResponse(json.dumps(result), 'application/javascript')





        try:
            user = User.objects.get(username = username)
        except Exception:
            user = User.objects.create_user(
                username   = username,
                password   = password1,
                email      = email,
                first_name = firstname,
                last_name  = lastname)
            user = authenticate(username=username, password=password1)
            result = {'status'   : 'success'}
        else:
            result = {
                'status'  : 'info',
                'message' : 'Уже есть пользователь с таким именем.'}





        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(redirect_url)
            else:
                # TODO Сделать человечный ответ
                # Пользователь заблокирован
                return HttpResponse(status = 401)
        else:
            # TODO Сделать человечный ответ
            # Пользователь неавторизован
            return HttpResponse(status = 401)
    else:
        return HttpResponse(status = 400)





def fix_username(username):

    import unidecode

    username = username.lower()

    username = unidecode.unidecode(username)

    username = username.replace(' ', '_')
    username = username.replace('&', 'and')
    username = username.replace('\'', '')
    username = username.replace('(', '')
    username = username.replace(')', '')

    username = username.strip()[:100]

    return username








