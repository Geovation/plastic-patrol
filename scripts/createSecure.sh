#!/bin/sh

pushd cordova-app

tar cvf secrets.tar build.json *.cer *.p12 *.mobileprovision *.keystore serviceAccountKey-plastic-patrol.json GooglePlayAndroidDeveloper.json
travis encrypt-file secrets.tar secrets.tar.enc -p -r Geovation/plastic-patrol

popd
