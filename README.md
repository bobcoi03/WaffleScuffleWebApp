# TakeAWalk
post anything, share with only your friends no influencers, no addictive algorithms no distractions.

Requires:
Python3.6+
Mysql 8

To run locally
1. cd webApp
2. python3 manage.py runserver

Initial setup
1. python3 -m venv env #create virtual environment
2. source env/bin/activate #activate virtual environment
3. pip install -r requirements.txt #install pip dependancies
3. cd webApp
3. python3 manage.py runserver

STEPS TO UPDATE TO EC2 Server
1. npm run build in /frontend app
2. set DEBUG = False in settings.py
3. Git commit, push changes
4. Git pull on ec2 instance
5. source env/bin/activate | go into python3 virtualenv on ec2
6. python3 manage.py collectstatic | update static folders
7. python3 manage.py makemigrations |
8. python3 manage.py migrate
9. pkill gunicorn
10. gunicorn -b 0.0.0.0:8000 webApp.wsgi:application --reload | restart gunicorn
11. bg | make gunicorn run on background
12. sudo nginx -s reload | restart nginx web server
