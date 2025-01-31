# PrimonProto

PrimonProto is a powerful and flexible WhatsApp bot designed for automation and enhanced group management. This bot is built using Node.js and the Baileys library, providing a wide range of features to improve your WhatsApp experience.

## Features

- **Alive Check**: Verify if the bot is running with a simple command.
- **Lyrics Fetcher**: Retrieve lyrics for any song using the Genius API.
- **Sticker Creation**: Convert images to stickers directly within WhatsApp.
- **TikTok Downloader**: Download TikTok videos using a link.
- **YouTube Downloader**: Download videos and music from YouTube.
- **View Once Messages**: View and download view-once messages.
- **Group Management**: Add, remove, promote, and demote users in groups.
- **Filters**: Set up automatic responses based on specific keywords.
- **Tagging**: Tag all users or only admins in a group.
- **Update Mechanism**: Easily update the bot to the latest version.

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/phaticusthiccy/PrimonProto.git
    cd PrimonProto
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Start the bot**:
    ```sh
    node index.js
    ```

## Usage

### Commands

- **Alive Check**: `!alive`
- **Fetch Lyrics**: `!lyrics <song name>`
- **Create Sticker**: `!sticker`
- **Download TikTok Video**: `!tiktok <url>`
- **Download YouTube Video**: `!video <query or url>`
- **Download YouTube Music**: `!music <query or url>`
- **View Once Message**: `!show`
- **Add User to Group**: `!add <number>`
- **Remove User from Group**: `!ban <number or reply>`
- **Promote User to Admin**: `!promote <number or reply>`
- **Demote User from Admin**: `!demote <number or reply>`
- **Mute Group**: `!mute <duration>`
- **Unmute Group**: `!unmute`
- **Tag All Users**: `!tagall`
- **Tag Admins**: `!tagadmin`
- **Add Filter**: `!filter add <incoming> <outgoing>`
- **Delete Filter**: `!filter delete <incoming>`
- **List Filters**: `!filter`

### Configuration

Edit the `database.json` file to configure the bot's settings, such as handlers, messages, and sudo users.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please open an issue on the GitHub repository.
