from django import forms
from django.contrib.auth.models import User

class RegisterForm(forms.Form):

	username  = forms.CharField()
	firstname = forms.CharField()
	lastname  = forms.CharField()
	email     = forms.EmailField()
	password  = forms.CharField()

	def clean_username(self):
	# Проверим уникальность юзернейма

		username = self.cleaned_data.get('username')

		if User.objects.filter(username=username).count() > 0:
			raise forms.ValidationError, 'User %s is already exists' % username
		return username

	def clean_team(self):
		# Проверим уникальность имени команды

		name = self.cleaned_data.get('teamname')

		if Team.objects.filter(name=name).count() > 0:
			raise forms.ValidationError, 'Team %s is already exists' % name
		return name

    def clean(self):
		# Подготовка чистых данных для вставки в модель

		data = super(RegisterForm, self).clean()

		data['user'] = User.objects.create_user(
			username = data['username'],
			password = data['password'],
			email    = data['email'],
		)
		data['team'] = Team.objects.create(
			name = data['teamname'],
		)

		return data
