# plastic-patrol

This app is built based on [Geovation Photos](https://github.com/Geovation/photos) stack.

# Travis
After changing any secret file:
```
cd cordova-app
tar cvf secrets.tar build.json *.cer *.p12 *.mobileprovision *.keystore
travis encrypt-file secrets.tar secrets.tar.enc -p -r Geovation/plastic-patrol
```
