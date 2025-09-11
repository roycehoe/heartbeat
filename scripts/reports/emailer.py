
import os
import smtplib


SMTP_HOST = os.getenv("MAILTRAP_SMTP_HOST", "localhost")
SMTP_USERNAME = os.getenv("MAILTRAP_SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("MAILTRAP_SMTP_PASSWORD", "")
SMTP_PORT = 2525

SENDER = "Private Person <from@example.com>"
RECEIVER = "A Test User <to@example.com>"
MESSAGE = f"""\
Subject: Hi Mailtrap
To: {RECEIVER}
From: {SENDER}

This is a test e-mail message."""

def send_email(
    smtp_host: str = SMTP_HOST,
    smtp_port: int = SMTP_PORT,
    smtp_username: str = SMTP_USERNAME,
    smtp_password: str = SMTP_PASSWORD,
    sender: str = SENDER,
    receiver: str = RECEIVER,
    message: str = MESSAGE
):
    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            print("Connected")
            server.starttls()
            print("TLS started")
            server.login(smtp_username, smtp_password)
            print("Logged in")
            server.sendmail(sender, receiver, message)
            print("Mail sent")
    except Exception as e:
        print("Error:", e)
