#!/bin/sh

# TODO: do it cron
# ..

export PROJECT=plastic-patrol-fd3b3
export FOLDER=`date +%Y-%m-%d`

# save firebase
gcloud beta firestore export gs://plastic-patrol-bks/$FOLDER/firestore --async --project $PROJECT

# save users
# TODO

# save storage
gsutil -m rsync -r gs://plastic-patrol-fd3b3.appspot.com gs://plastic-patrol-bks/$FOLDER/storage

# delete older than 1 month
# TODO
