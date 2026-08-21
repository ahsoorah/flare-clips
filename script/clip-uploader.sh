# fedora daemon i made to run on my machine at startup
WATCH_DIR="/home/USER/Videos/Vice/Uploads"
BUCKET_NAME="vice-clips"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-your_account_id_here}"
ENDPOINT_URL="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"
DOMAIN="clips.yourdomain.com"

# ensure the upload directory exists
mkdir -p "$WATCH_DIR"

# watch the directory for completed file writes OR files moved into it
inotifywait -m -e close_write,moved_to --format '%w%f' "$WATCH_DIR" | while read FILE
do
    # upload if it matches any of the formats
    if [[ "$FILE" =~ \.(mp4|mov|mkv|avi|webm|m4v)$ ]]; then

        # get filename for the public link
        FILENAME=$(basename "$FILE")

        # upload to r2 using the s3 compatibility api
        aws s3 cp "$FILE" "s3://$BUCKET_NAME/" --endpoint-url "$ENDPOINT_URL"

        # generate url + copy to clipboard
        PUBLIC_URL="https://$DOMAIN/$FILENAME"
        echo -n "$PUBLIC_URL" | wl-copy

        # trigger plasma desktop noti with url link
        notify-send "clip uploaded, url copied" "successfully pushed to cloudflare, link copied: $PUBLIC_URL" -i video-x-generic
    fi
done
