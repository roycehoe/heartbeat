import os

# settings.py reads these when it is imported, so they must exist before a test
# imports the app.
for required_setting in (
    "DB_ENCRYPTION_SECRET",
    "SECRET_KEY",
    "ADMIN_PASSWORD",
    "PHONE_NUMBER_ID",
    "WHATSAPP_API_ACCESS_TOKEN",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "SUPERADMIN_CLERK_ID",
):
    os.environ.setdefault(required_setting, "test")
