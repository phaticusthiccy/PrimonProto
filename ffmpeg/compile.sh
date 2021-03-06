# Primon Proto 
# Headless WebSocket, type-safe Whatsapp Bot
# 
# Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
# Multi-Device Lightweight ES6 Module (can usable with mjs)
#
# Phaticusthiccy - 2022


header() {
  echo "" || true
  echo "-----> $*" || true
}

output() {
  while IFS= read -r LINE; do
    if [[ "$LINE" =~ ^-----\>.* ]]; then
      echo "$LINE" || true
    else
      echo "       $LINE" || true
    fi
  done
}

header "Installing ffmpeg"

BUILD_DIR="./"
VENDOR_DIR="vendor"
FFMPEG_ARCHIVE_NAME="ffmpeg.tar.xz"

mkdir -p $VENDOR_DIR
cd $VENDOR_DIR
mkdir -p ffmpeg
cd ffmpeg

if [[ -z $FFMPEG_DOWNLOAD_URL ]]; then
  echo "Variable FFMPEG_DOWNLOAD_URL isn't set, using default value" | output
  FFMPEG_DOWNLOAD_URL="https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-amd64-static.tar.xz"
fi

echo "Downloading $FFMPEG_DOWNLOAD_URL" | output

code=$(curl "$FFMPEG_DOWNLOAD_URL" -L --silent --fail --retry 5 --retry-max-time 15 -o ./$FFMPEG_ARCHIVE_NAME --write-out "%{http_code}")

if [ "$code" != "200" ]; then
  echo "Unable to download ffmpeg: $code" | output && exit 1
fi

echo "Unpacking the archive" | output

tar xJf "./$FFMPEG_ARCHIVE_NAME" --strip-components=1

if [ "$?" != "0" ]; then
  echo "Failed to unpack" | output && exit 1
fi

rm $FFMPEG_ARCHIVE_NAME

PROFILE_PATH="./.profile.d/ffmpeg.sh"
mkdir -p $(dirname $PROFILE_PATH)
echo 'export PATH="./"' >> $PROFILE_PATH

echo "Installation successful" | output