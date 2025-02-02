# PrimonProto - WhatsApp Bot

PrimonProto is a versatile WhatsApp bot built with Node.js and the Baileys library. It offers a range of features for automation and enhanced group management, making your WhatsApp experience more efficient and enjoyable.

## Features

**Media & Entertainment:**

* **Instagram Downloader:** Download photos and videos from Instagram links.
* **TikTok Downloader:** Download TikTok videos with a simple command.
* **YouTube Downloader:** Download YouTube videos and music in high quality.
* **Lyrics Fetcher:** Quickly get song lyrics using the Genius API.
* **Sticker Creator:** Convert images and stickers to different formats.
* **View Once Message Viewer:** Reveal and download "view once" messages.

**Group Administration:**

* **Group Mute/Unmute:** Control group chat activity by muting and unmuting.
* **Ban/Add Members:** Easily ban and add users to your groups.
* **Promote/Demote Admins:** Manage group administrators efficiently.
* **Tag All/Admins:** Quickly tag all members or just the admins in a group.
* **Global Mute:** Mute specific users across all groups the bot is in.

**Automation & Utilities:**

* **Custom Filters:** Create automated responses to specific keywords or regular expressions.
* **Alive Check:** Confirm the bot is online and responsive.
* **Work Type (Public/Private):** Configure the bot to respond to all users or only authorized users.
* **Sudo Users:** Grant elevated permissions to specific users.
* **Blacklist:** Block specific groups from using the bot.
* **Menu:** View the available commands and their usage.
* **Edit Configurations:** Customize welcome, goodbye, and alive messages directly within WhatsApp.
* **Auto-Updater:** Stay up-to-date with the latest features and improvements.


## Installation

These instructions assume you have Node.js (version 16 or higher) and npm (or yarn) installed.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/phaticusthiccy/PrimonProto.git
   cd PrimonProto
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Generate QR Code and Authenticate:**

   ```bash
   node qr.js
   ```

   Follow the on-screen prompts to scan the QR code with your WhatsApp account. This step is only required for the initial setup.

4. **Start the bot:**

   ```bash
   pm2 start main.js
   ```

   This will run the bot in the background using pm2.

##  Management Commands (Using PM2)

* **View Logs:** `pm2 logs`  (Useful for debugging)
* **Kill (Force Stop):** `pm2 kill`

## Usage

PrimonProto uses handlers to trigger commands.  The default handlers are ".", "/", and "!".  You can customize these in the `database.json` file.  For example, to use the "!alive" command, send "!alive" in a WhatsApp chat where the bot is present.

**Command List:**  Use `!menu` (or your chosen handler + "menu") to see a complete list of available commands and their descriptions within WhatsApp.  You can also use `!menu <command>` to get specific help for a single command.

**All Commands:**

**Media & Entertainment:**

* `!insta <instagram_url>` - Downloads Instagram media.
* `!tiktok <tiktok_url>` - Downloads TikTok videos.
* `!video <query or url>` - Downloads YouTube videos.
* `!music <query or url>` - Downloads YouTube music.
* `!lyrics <song name>` - Fetches song lyrics.
* `!sticker` (reply to an image or sticker) - Converts images to stickers or stickers to images.
* `!show` (reply to a view once message) - Reveals view once messages.


**Group Administration:**

* `!add <number>` - Adds a user to the group.
* `!ban <number or reply>` - Bans a user from the group.
* `!promote <number or reply>` - Promotes a user to admin.
* `!demote <number or reply>` - Demotes a user from admin.
* `!mute <duration(optional)>` - Mutes the group. Provide duration like `!mute 1h` for 1 hour.
* `!unmute` - Unmutes the group.
* `!tagall <message(optional)>` - Tags all group members.  If you provide a message, it will be included after the tags.
* `!tagadmin <message(optional)>` - Tags all group admins. If you provide a message, it will be included after the tags.
* `!gmute` (reply to a user) - Globally mutes a user in all groups the bot is present.
* `!ungmute` (reply to a user) - Globally unmutes a user.


**Automation & Utilities:**

* `!filter add <incoming message> <outgoing message>` - Adds a new filter.
* `!filter delete <incoming message>` - Deletes a filter.
* `!filter` - Lists all filters in the current chat.
* `!filter <on|off>` Enables or disables filters in the current chat.
* `!alive` - Checks if the bot is alive.
* `!worktype <public or private>` - Changes the bot's work type (sudo only).
* `!sudo add <number>` - Adds a user to the sudo list (sudo only).
* `!sudo delete <number>` - Removes a user from the sudo list (sudo only).
* `!blacklist` - Adds or removes the current group to/from the blacklist (sudo only).
* `!menu` - Displays the command menu.
* `!edit <alive|welcome|goodbye>` (reply to a message) - Edits welcome/goodbye messages or alive message (sudo only).
* `!update` - Checks for bot updates (sudo only).
* `!update now` - Updates the bot to the latest version (sudo only).
* `!plugin <query>` - Searches for plugins.
* `!plugin top` - Shows top plugins.
* `!pinstall <plugin_id>` - Installs a plugin (sudo only).
* `!pldelete <plugin_id>` - Deletes a plugin (sudo only).
* `!ping` - Checks the bot's response time.

## Configuration

The `database.json` file stores the bot's configuration.  You can edit this file to customize various settings, including:

* **Handlers:**  The prefixes used to trigger commands.
* **Alive Message:** The message displayed when the `!alive` command is used.
* **Welcome/Goodbye Messages:**  Messages sent when users join or leave a group.
* **Sudo Users:**  Phone numbers (with country code) of users with sudo access.
* **Work Type:** Set to "public" or "private" to control who can use the bot.


## Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request.


## License

MIT License. See the [LICENSE](LICENSE) file for details.