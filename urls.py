from django.conf.urls import include, url
from django.contrib import admin

import anodos.views

admin.autodiscover()

urlpatterns = [

	url(r'^$', anodos.views.home),
	url(r'^catalog/', include('catalog.urls')),
	url(r'^tenders/', include('tenders.urls')),
	url(r'^admin/', include(admin.site.urls)),

	url(r'^articles/$', anodos.views.articles),
	url(r'^article/(?P<article_id>[0-9]+)/$', anodos.views.article),

	url(r'^content/ajax/get-article/$', anodos.views.ajaxGetArticle),
	url(r'^content/ajax/save-article/$', anodos.views.ajaxSaveArticle),

	url(r'^content/categories/$', anodos.views.editCategories),

	url(r'^content/ajax/add-category/$', anodos.views.ajaxAddCategory),
	url(r'^content/ajax/save-category/$', anodos.views.ajaxSaveCategory),
	url(r'^content/ajax/switch-category-state/$', anodos.views.ajaxSwitchCategoryState),
	url(r'^content/ajax/trash-category/$', anodos.views.ajaxTrashCategory),

	url(r'^logs/$', anodos.views.logs),

	url(r'^ajax/login/$', anodos.views.ajax_login),
	url(r'^logout/$', anodos.views.logout_view),

	url(r'^ajax/create-username/$', anodos.views.ajax_create_username),
	url(r'^ajax/register/$', anodos.views.ajax_register),

]
