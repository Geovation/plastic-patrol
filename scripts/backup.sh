#!/bin/sh

# TODO: do it cron
# ..

export PROJECT=plastic-patrol-fd3b3
export FOLDER=`date +%Y-%m-%d`

# save firebase
gcloud beta firestore export gs://plastic-patrol-bks/$FOLDER/firestore --async --project $PROJECT

# save users
mkdir -p bks/users
firebase auth:export bks/users/users.json --project $PROJECT
gsutil -m rsync -r bks/users gs://plastic-patrol-bks/$FOLDER/users

# save storage
gsutil -m rsync -r gs://plastic-patrol-fd3b3.appspot.com gs://plastic-patrol-bks/$FOLDER/storage

# delete older than 1 month
# TODO
