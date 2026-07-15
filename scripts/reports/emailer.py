
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("MAILTRAP_SMTP_HOST", "localhost")
SMTP_USERNAME = os.getenv("MAILTRAP_SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("MAILTRAP_SMTP_PASSWORD", "")
SMTP_PORT = 2525

SENDER = "Private Person <from@example.com>"
RECEIVER = "A Test User <to@example.com>"

def send_email(
    smtp_host: str = SMTP_HOST,
    smtp_port: int = SMTP_PORT,
    smtp_username: str = SMTP_USERNAME,
    smtp_password: str = SMTP_PASSWORD,
    sender: str = SENDER,
    receiver: str = RECEIVER,
    html_content: str = None,
    subject: str = None
):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = sender
        msg["To"] = receiver
        # Add HTML part
        mime_html = MIMEText(html_content, "html")
        msg.attach(mime_html)

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            print("Connected")
            server.starttls()
            print("TLS started")
            server.login(smtp_username, smtp_password)
            print("Logged in")
            server.sendmail(sender, receiver, msg.as_string())
            print("Mail sent")
    except Exception as e:
        print("Error:", e)
