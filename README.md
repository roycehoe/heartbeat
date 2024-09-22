# To Do

## Backend

Incorporate generation of table data
Create and integrate new folder `scripts` to hold all on-startup scripts for automatic state management
Create and integrate new folder `gateway` to hold all external services logic, namely the telegram notifier bot
Create telegram notifier bot
Ensure that telegram notifier bot will send alert messages if users do not record mood for a given day, or if users record more than five `sad` moods in a row
Create `.env` file to store telegram secret keys
Create new `name` field in user table to enable Telegram bot to send alert to caregiver with user's  name
Implement coins on user table:
    - On mood record, coins +10
    - On mood record 5 days in a row, coins + 10
Implement tree growth logic:
    - Every 5th consecutive day, the tree grows to the next state
    - There are only 5 tree states
    - After the 5th tree state, the tree restarts to the first state
Return user coins as part of the user dashboard response

## Frontend

Implement figma design
