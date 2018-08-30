import styles from './config.scss';
const primaryColor = styles.primary;
const secondaryColor = styles.secondary;

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
  }
}
