
import os
import smtplib

SMTP_HOST = os.getenv("MAILTRAP_SMTP_HOST", "localhost")
SMTP_USERNAME = os.getenv("MAILTRAP_SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("MAILTRAP_SMTP_PASSWORD", "")

# email template
sender = "Private Person <from@example.com>"
receiver = "A Test User <to@example.com>"

message = f"""\
Subject: Hi Mailtrap
To: {receiver}
From: {sender}

This is a test e-mail message."""

def send_email():

    try: 
        with smtplib.SMTP(SMTP_HOST, 2525) as server:
            print("Connected")
            server.starttls()
            print("TLS started")
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            print("Logged in")
            server.sendmail(sender, receiver, message)
            print("Mail sent")

    except Exception as e:
        print("Error:", e)
