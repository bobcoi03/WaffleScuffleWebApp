# TakeAWalk
post anything, share with only your friends no influencers, no addictive algorithms no distractions.

Requires:
Python3.6+
Mysql 8

Initial setup

Database setup

0. Create a mysql user and database give user all privileges for that db
1. SET environment variables
2. RDS_DB_NAME=your db name
3. RDS_USERNAME=username of mysql user
4. RDS_PASSWORD=password of mysql user
5. RDS_HOSTNAME=127.0.0.1
6. RDS_PORT=3306

------------------------------------------------------------

App setup

1. python3 -m venv env #create virtual environment
2. source env/bin/activate #activate virtual environment
3. pip install -r requirements.txt #install pip dependancies
4. cd webApp/frontend
5. npm install
6. cd ..
7. python3 manage.py migrate
7. python3 manage.py createsuperuser
8. python3 manage.py collectstatic
9. python3 manage.py runserver



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
