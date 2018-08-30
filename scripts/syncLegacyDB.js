#!/usr/bin/env node
const _ = require('lodash');
const request = require('superagent');
const admin = require('firebase-admin');
const md5 = require('md5');
const fs = require('fs');
const Jimp = require('jimp');

const config = require('./config.json');
const serviceAccount = require(config.serviceAccountKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});
const bucket = admin.storage().bucket();
const db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

// read new photos
// OPTION 1:
//  * read files from http://plasticpatrol-approval.herokuapp.com/api/files
//  * read view-source:https://embed.zerosixzero.org/map/plasticpatrol
//  * get from https://storage.googleapis.com
//
//   PROBLEMS:
//    * It is the list of ALL files. It doesn't say if the files have been approved.
//    * It doesn't contain the last 2 pages ??????
//
// OPTION 2:
//  * read http://plasticpatrol-approval.herokuapp.com/?sort=unapproved&page=8 page by page
//  * read view-source:https://embed.zerosixzero.org/map/plasticpatrol
//  * get from https://storage.googleapis.com
//
//   PROBLEMS:
//    * need to parse the html (not a real problem)
//    * it has less photos ?? just 800
//    * inconsistent data (????)

// OPTION 3: (this implementation)
//  * read from the map: view-source:https://embed.zerosixzero.org/map/plasticpatrol
//  * get the old pictires: from https://storage.googleapis.com
//  * read http://plasticpatrol-approval.herokuapp.com/api/approved
//  * merge them because the data is inconsistent.
//
//    PROBLEM:
//    * cannot read un-approved ones but some can be inferred. (in the API but not in the map)
async function getPhotosFromMap() {
  const TIMERNAME= "reading from the map";
  console.time(TIMERNAME);
  console.log("Getting photos from the map ...");

  const response = await request.get(config.map_url);
  const lines = response.text.split('\n');

  let searchPhase = 'latLng';
  let photo = {};
  let photos = {};
  let numPhotos = 0;

  lines.forEach(line => {
    switch (searchPhase) {
      case 'latLng':
        if (line.match("var image_[0-9]")) {
          const latitude = Number(line.match("\\[(-?[0-9]+\.[0-9]+),")[1]);
          const longitude = Number(line.match(",(-?[0-9]+\.[0-9]+)\\],")[1]);
          const location = new admin.firestore.GeoPoint(latitude, longitude);

          photo.location = location;
          searchPhase = 'url'
        }
        break;

      case 'url':
        if (line.match("popup\.setContent")) {
          photo.url = line.match("(https?://.*?)\'>")[1];

          let pieces = line.match("___(\\d+)_\\d+x\\d+.png")
          if (pieces) {
            photo.pieces = pieces[1];
          }

          // date
          let dateTime = line.match("/pp/(\\d{4}-\\d{2}-\\d{2})-(\\d+)___");
          if (dateTime) {
            const date = dateTime[1];
            const time = Number(dateTime[2]);
            photo.updated = new Date((new Date(date)).getTime() + time)
          }

          // google
          if (!photo.updated) {
            const time = line.match("_(\\d{10,})\.jpg");
            if (time) {
              photo.updated = new Date(Number(time[1]));
            }
          }

          // google
          if (!photo.updated) {
            const time = line.match("/Photo_(\\d{2})_(\\d{2})_(\\d{4})_(\\d{2})_(\\d{2})_(\\d{2}).*?\.jpg");

            if (time) {
              photo.updated = new Date(time[3], time[2], time[1], time[4], time[5], time[6]);
            }
          }

          if (!photo.updated ) {
            console.log("Coud not process this line: ", line, "\n", photo, "\n");
          } else {
            photo.published = true;
            photo.moderated = photo.updated;
            photos[photo.url] = photo;
          }

          searchPhase = 'latLng';
          numPhotos++;
          photo = {};
        }
        break;
    }

  });
  console.timeEnd(TIMERNAME);
  console.log(`... found ${numPhotos} photos`);
  return photos;
}

async function mergePhotos(photosFromMap, photosFromAPI) {

  const photos = photosFromAPI.reduce( (acc, photo) => {
    acc[photo.uri] = photo;
    return acc;
  }, {});
  _.merge(photos, photosFromMap);

  const newPhotos = _.keys(photos).length - _.keys(photosFromMap).length;
  console.log(`... found ${newPhotos} photos from the API that are not in the Map.. These photos have not been approved.`)
  return photos;
}

async function getPhotosFromAPI() {
  const TIMERNAME= "reading from api";
  console.time(TIMERNAME);
  console.log("Reading from API...");

  const promise  = request
    .get(config.api_url)
    .auth(config.api_user, config.api_password)
    .then( response => {
      const photosFromAPI = JSON.parse(response.text);
      console.timeEnd(TIMERNAME);
      return photosFromAPI;
    });

  return promise;
}

async function readLegacyPhotos() {
  const photosFromMap = await getPhotosFromMap();
  const photosFromAPI = await getPhotosFromAPI();
  const photosMerged = mergePhotos(photosFromMap, photosFromAPI);

  return photosMerged;
}

async function readCurrentPhotos() {
  const TIMERNAME= "reading firebase";
  console.time(TIMERNAME);
  console.log("Reading the list of photos currently in the DB ...");

  let numOfPhotos = 0;
  const querySnapshot = await db.collection("photos").get();
  const photos = querySnapshot.docs.reduce( (r, doc) => {
    r[doc.id] = doc.data();
    numOfPhotos++;
    return r;
  }, {} );

  console.timeEnd(TIMERNAME);
  console.log(`... Read ${numOfPhotos} photos`);
  return photos;
}

function findNewPhotos(legacyPhotos, currentPhotos) {
  return _.reduce(legacyPhotos, (acc, legacyPhoto, id) => {
    const key = md5(id);

    if (!currentPhotos[key]) {
      acc[key] = legacyPhoto;
    }

    return acc;
  }, {} );
}

async function uploadIntoCurrentDB(newPhotos) {
  let ct = 0;
  const keysNewPhotos = _.keys(newPhotos);
  const size = keysNewPhotos.length;
  const startedAt = Date.now();

  for (let keyId in keysNewPhotos) {
    const id = keysNewPhotos[keyId];
    const newPhoto = newPhotos[id];
    console.log(`${id} ==> ${++ct}/${size}`);

    try {
      // download photo
      console.log(`downloading ${newPhoto.url}`);
      const filePath = id + ".jpg";
      await download(newPhoto.url, filePath);

      // upload photo
      const destPath = `photos/${id}/original.jpg`;
      console.log(`uploading ${destPath}`);
      await bucket.upload(filePath, { destination: destPath });
      fs.unlinkSync(filePath);

      // upload metadata
      console.log(`uploading ${id}`);
      await db.collection('photos').doc(id).set(_.pick(newPhoto, ['location', 'moderated', 'published', 'updated']));

      const elapsedTimeInMinutes = (Date.now() - startedAt)/1000/60;
      const perMinute = ct / elapsedTimeInMinutes;
      console.log(`done ${perMinute} per minute`);
      console.log(`Still ${( size - ct) / perMinute} minutes \n`);

    } catch(err) {
      console.error(`Error ${err} \n`);
    }

  }
}

async function main() {
  const legacyPhotos = await readLegacyPhotos();
  const currentPhotos = await readCurrentPhotos();

  console.log("Total num of legacy photos: ", _.keys(legacyPhotos).length);
  console.log("Total num of current photos: ", _.keys(currentPhotos).length);

  const newPhotos = findNewPhotos(legacyPhotos, currentPhotos);

  console.log(`found ${_.keys(newPhotos).length}`);
  await uploadIntoCurrentDB(newPhotos);
}


async function download(url, filePath) {
  const image = await Jimp.read(url);
  return image.writeAsync(filePath);
}

/**********************************************************************************************************************/
main()
  .then(function () {
    console.info('Operation completed');
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
