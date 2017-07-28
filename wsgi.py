import os
import sys
sys.path.append('/home/ubuntu/anodos.ru/anodos/')
os.environ['DJANGO_SETTINGS_MODULE'] = 'anodos.settings'
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
