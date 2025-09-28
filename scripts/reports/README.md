# Reports

├── emailer.py: email utils; SMTP setup. 

├── main.py: entry point to run report scheduler. 

├── report.py: generating report  

├── scheduler.py: scheduled job functions. 

└── queries.py: db queries for reporting metrics. 


## MailTrap

Used for testing emails in a sandbox.

## .env Template

Create an .env using the template keys below and place it in `scripts/`

```
# database
SQLALCHEMY_DATABASE_URL_STAGING=

# mailtrap
MAILTRAP_SMTP_HOST=
MAILTRAP_SMTP_USERNAME=
MAILTRAP_SMTP_PASSWORD=
```
