import styles from './config.scss';

const primaryColor = styles.primary;
const secondaryColor = styles.secondary;

const CUSTOM_STRING = {
  tutorial: {
    "Walk around the city and take photos": "Walk around the city and take photos",
    "Write info about the photos and upload it to the cloud": "Write info about the photos and upload it to the cloud",
    "View your images in our interactive map": "View your images in our interactive map"
  },
};

const PAGES = {
  map: {
    path: "/",
    label: "Map"
  },
  embeddable: {
    path: "/embeddable",
    label: "Map"
  },
  photos: {
    path: "/photo",
    label: "Photo"
  },
  moderator: {
    path: "/moderator",
    label: "Photo Approval"
  },
  account: {
    path: "/account",
    label: "Account"
  },
  about: {
    path: "/about",
    label: "About"
  },
  tutorial: {
    path: "/tutorial",
    label: "Tutorial"
  },
};

const customiseString = (page, key) => (CUSTOM_STRING[page][key] || key);

export default {
  MAX_IMAGE_SIZE: 2048,
  THEME: {
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: { main: primaryColor },
      secondary: { main: secondaryColor },
    },
  },
  MAP_SOURCE: "mapbox://styles/mapbox/streets-v10",
  // MAP_SOURCE: "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json",
  // MAP_ATTRIBUTION: "Contains OS data &copy; Crown copyright and database rights 2018",
  MAPBOX_TOKEN: "pk.eyJ1Ijoic2ViYXN0aWFub3ZpZGVnZW92YXRpb251ayIsImEiOiJjanBqZzRmNHgwNXljM2tydHlkM29id3FwIn0.-1V8Ue9P6eQr8FGghaTYiw",
  FIREBASE: {
    apiKey: "AIzaSyBbN8z-zSqChaQkTyOtIZZ3apq0qg59FzI",
    authDomain: "plastic-patrol-fd3b3.firebaseapp.com",
    databaseURL: "https://plastic-patrol-fd3b3.firebaseio.com",
    projectId: "plastic-patrol-fd3b3",
    storageBucket: "plastic-patrol-fd3b3.appspot.com",
    messagingSenderId: "845679623528"
  },
  GA_TRACKING_ID: "UA-126516084-1",
  PHOTO_ZOOMED_FIELDS: {
    "updated": s => new Date(s).toDateString(),
    "pieces": s => s
  },
  PHOTO_TITLE_FIELD:{
    title: 'Number of collected plastic pieces',
    placeholder: 'eg. 123'
  },
  PAGES,
  customiseString
}
