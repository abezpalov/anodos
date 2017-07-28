from django.db import models
from django.utils import timezone


# Category
class Category(models.Model):
    name        = models.TextField()
    name_search = models.CharField(max_length=512)
    alias       = models.CharField(max_length=100)
    description = models.TextField()
    parent      = models.ForeignKey('self', null=True, default=None)
    level       = models.IntegerField()
    order       = models.IntegerField()
    path        = models.CharField(max_length=512, null=True)
    state       = models.BooleanField(default=True)
    created     = models.DateTimeField()
    created_by  = models.CharField(max_length=100, null=True, default=None)
    modified    = models.DateTimeField()
    modified_by = models.CharField(max_length=100, null=True, default=None)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']


# Doc Type
class DocType(models.Model):
    name        = models.TextField()
    name_search = models.CharField(max_length=512)
    alias       = models.CharField(max_length=100)
    state       = models.BooleanField(default=True)
    created     = models.DateTimeField()
    created_by  = models.CharField(max_length=100, null=True, default=None)
    modified    = models.DateTimeField()
    modified_by = models.CharField(max_length=100, null=True, default=None)

    def __str__(self):
        return self.alias

    class Meta:
        ordering = ['alias']


# Language
class Language(models.Model):
    name        = models.TextField()
    name_search = models.CharField(max_length=512)
    alias       = models.CharField(max_length=100)
    state       = models.BooleanField(default=True)
    created     = models.DateTimeField()
    created_by  = models.CharField(max_length=100, null=True, default=None)
    modified    = models.DateTimeField()
    modified_by = models.CharField(max_length=100, null=True, default=None)

    def __str__(self):
        return self.alias

    class Meta:
        ordering = ['alias']


# License
class License(models.Model):
    name        = models.TextField()
    name_search = models.CharField(max_length=512)
    alias       = models.CharField(max_length=100)
    description = models.TextField()                                           # Описание
    state       = models.BooleanField(default=True)
    created     = models.DateTimeField()
    created_by  = models.CharField(max_length=100, null=True, default=None)
    modified    = models.DateTimeField()
    modified_by = models.CharField(max_length=100, null=True, default=None)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['alias']


# Article
class Article(models.Model):
    title        = models.TextField()                                           # Заголовок
    title_search = models.CharField(max_length=512)
    alias        = models.CharField(max_length=100, null=True)                  # Псевдоним (служебное поле)
    patch        = models.CharField(max_length=512, null=True)                  # Путь
    thumb_src    = models.CharField(max_length=512, null=True)                  # Ссылка на изображение-предпросмотр

    intro        = models.TextField()                                           # Вводный текст
    content      = models.TextField()                                           # Текст статьи
    description  = models.TextField()                                           # Описание

    category     = models.ForeignKey(Category, null=True, default=None)         # Категория
    language     = models.ForeignKey(Language, null=True, default=None)         # Язык
    license      = models.ForeignKey(License,  null=True, default=None)         # Лицензия
    copyright    = models.CharField(max_length=512, null=True)                  # Копирайт

    source       = models.CharField(max_length=512, null=True)                  # Источник
    source_url   = models.CharField(max_length=512, null=True)                  # Ссылка на источник

    state        = models.BooleanField(default=True)                            # Статус (опубликована ли статья)
    on_main      = models.BooleanField(default=False)                           # На главной ли статья

    created      = models.DateTimeField()
    created_by   = models.CharField(max_length=100, null=True, default=None)
    modified     = models.DateTimeField()
    modified_by  = models.CharField(max_length=100, null=True, default=None)
    published    = models.DateTimeField(null=True, default=None)
    published_by = models.CharField(max_length=100, null=True, default=None)
    pub_from     = models.DateTimeField(null=True, default=None)
    pub_to       = models.DateTimeField(null=True, default=None)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created']


# Document
class Document(models.Model):
    title        = models.TextField()                                           # Заголовок
    title_search = models.CharField(max_length=512)
    alias        = models.CharField(max_length=100, null=True)                  # Псевдоним (служебное поле)
    patch        = models.CharField(max_length=512, null=True)                  # Путь
    src          = models.CharField(max_length=512, null=True)                  # Ссылка на расположение
    thumb_src    = models.CharField(max_length=512, null=True)                  # Ссылка на изображение-предпросмотр
    doc_type     = models.ForeignKey(DocType, null=True, default=None)          # Тип документа

    description  = models.TextField()                                           # Описание

    category     = models.ForeignKey(Category, null=True, default=None)         # Категория
    language     = models.ForeignKey(Language, null=True, default=None)         # Язык
    license      = models.ForeignKey(License,  null=True, default=None)         # Лицензия
    copyright    = models.CharField(max_length=512, null=True)                  # Копирайт

    source       = models.CharField(max_length=512, null=True)                  # Источник
    source_url   = models.CharField(max_length=512, null=True)                  # Ссылка на источник

    state        = models.BooleanField(default=True)

    created      = models.DateTimeField()
    created_by   = models.CharField(max_length=100, null=True, default=None)
    published    = models.DateTimeField(null=True, default=None)
    published_by = models.CharField(max_length=100, null=True, default=None)
    pub_from     = models.DateTimeField(null=True, default=None)
    pub_to       = models.DateTimeField(null=True, default=None)

    hash_md5     = models.CharField(max_length=100, null=True, default=None)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created']


# Document Collection
class DocumentCollection(models.Model):
    title        = models.TextField()                                           # Заголовок
    title_search = models.CharField(max_length=512)
    alias        = models.CharField(max_length=100, null=True)
    state        = models.BooleanField(default=True)
    created      = models.DateTimeField()
    created_by   = models.CharField(max_length=100, null=True, default=None)
    modified     = models.DateTimeField()
    modified_by  = models.CharField(max_length=100, null=True, default=None)

    to_article   = models.ManyToManyField(
        Article,  db_table='anodos_collection_to_article')
    to_document  = models.ManyToManyField(
        Document, db_table='anodos_collection_to_document')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created']


# Log manager
class LogManager(models.Manager):

    def add(self, subject, channel, title, description):

        log = Log(
            subject     = subject[:100],
            channel     = channel[:100],
            title       = title[:100],
            description = description,
            created     = timezone.now())
        print(log)
        log.save()
        return log


# Log
class Log(models.Model):

    subject     = models.CharField(max_length=100)
    channel     = models.CharField(max_length=100)
    title       = models.CharField(max_length=100)
    description = models.TextField()
    created     = models.DateTimeField()

    objects     = LogManager()

    def __str__(self):
        return "{} | {} | {} | {}".format(self.subject, self.channel, self.title, self.description) 

    class Meta:
        ordering = ['-created']
