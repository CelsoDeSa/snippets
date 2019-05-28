## Rails (creates a new app using postgresql as database)

rails new <app name> -d postgresql
bundle exec rake db:create
(bundle exec) rails g scaffold <Whatever ex: Room> <something  ex: topic>:string<ou :boolean :integer :text :decimal :datetime :float :time :binary :timestamp :date :primary_key> (--skip-stylesheets)
(bundle exec) rake db:migrate
rails s

----

## Postgres

### config > database.yml

development:
  adapter: postgresql
  encoding: unicode
  database: <app_name>_development
  pool: 5
  username: postgres
  password:

----

## Gemfile (some worth using gems)

    gem "bootstrap-sass" (group :assets)
    gem 'thin'
    gem "carrierwave"
    gem 'fog'
    gem 'has_token_id', '~> 0.3.1'
    gem 'devise'
    gem 'cancan'
    gem 'impressionist'
    gem 'activerecord-reputation-system', require: 'reputation_system'
    gem 'will_paginate', '~> 3.0.0'

----

## Git (Version Control)

    git init
    git add .
    git status (shows files waiting to be commited)
    git commit -m “Initial commit.”

----

## Heroku (Deployment via Git)

    heroku login
    heroku create <appname> --stack cedar

### in > environments/production.rb change to
    config.assets.compile = true

    git push heroku master

----

## Heroku (Troubleshooting)

    heroku ps (shows status of the app's processes)
    heroku logs (helps to diagnose any problem in the deployed app)
    heroku run (runs any command directly in the server's shell, i.e.: heroku run rake db:migrate)

----

## Heroku (Maintenance: setting access to images and videos on AWS S3)

    heroku config:add AWS_ACCESS_KEY_ID=*************
    heroku config:add AWS_SECRET_ACCESS_KEY=*************
    heroku config:add AWS_S3_BUCKET=********
    heroku config (shows config status)

----

## Heroku (Maintenance: other commands)

    heroku apps (shows all account apps)
    heroku destroy <app name on the server>
