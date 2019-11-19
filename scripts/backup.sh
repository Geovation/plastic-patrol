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

# delete old one. Leave the newyer 6
TO_DELETE=`(gsutil ls gs://plastic-patrol-bks/ | awk 'n>=6 { print a[n%6] } { a[n%6]=$0; n=n+1 }')`
echo $TO_DELETE | xargs gsutil -m rm -r
# echo $TO_DELETE | gsutil -m rm -r -I

gsutil ls gs://plastic-patrol-bks/
