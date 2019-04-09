import React from 'react';
import EventIcon from '@material-ui/icons/Event';

import styles from './config.scss';
import enums from '../types/enums';
import TitleTextField from '../components/PhotoPage/TitleTextField';
import MultiFields from '../components/PhotoPage/MultiFields';
import { data } from './categories';

const primaryColor = styles.primary;
const secondaryColor = styles.secondary;

const CUSTOM_STRING = {
  drawer: {
    "photos published so far!": "pieces found so far!"
  },
  tutorial: {
    "Walk around the city and take photos": "Get outside and photograph your #plasticpatrol haul",
    "Write info about the photos and upload it to the cloud": "Count how many pieces you collected and upload your photo",
    "View your images in our interactive map": "View images in our interactive map and see how you have helped fight the plastic problem"
  },
  about: {
    "We are Geovation and we Geovate": "#PlasticPatrol is about engaging people with the issue of plastic pollution through adventure and nature, helping to safeguard our seas for the future.\n\n" +
    "Our mission is to combat the global plastic crisis by stopping the problem at its source – in our waterways.\n\n" +
    "Every single piece of plastic collected and shared on social media as part of the #PlasticPatrol movement is captured in our interactive map, creating a picture of the problem on a global scale for the very first time.\n\n" +
    "Using this app you can get involved. Simply take a photo of what you find by pressing the camera button and upload it directly to the map. After it has been approved you will be able to view the images by pressing the globe button."
  },
  writeFeedback: {
    "admin@geovation.uk": "lizzieoutside@icloud.com"
  }
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
  writeFeedback: {
    path: "/write-feedback",
    label: "Feedback"
  },
  events: {
    path: "/events",
    label: "Clean-ups"
  },
  partners: {
    path: "/partners",
    label: "Partners"
  },
};

const customiseString = (page, key) => (CUSTOM_STRING[page][key] || key);

const getStats = async (photos) => {
  let totalPieces = 0;
  const photoObj = await photos;
  Object.keys(photoObj.features).forEach(key => {
    const properties = photoObj.features[key].properties;
    const pieces = Number(properties.pieces);
    if (!isNaN(pieces) && pieces > 0 ) totalPieces += pieces;
  });
  return totalPieces;
}

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
    spacing: {
      unit: 10
    }
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
  ZOOM: 5,
  CENTER: [-2, 55],
  PHOTO_FIELDS: {
    pieces: {
      name: 'pieces',
      title: 'Number of pieces collected',
      type: enums.TYPES.number,
      placeholder: 'eg. 123',
      inputProps: {min: 0, step: 1},
      regexValidation: '^[0-9]+',
      component: TitleTextField
    },
    categories: {
      component: MultiFields.MultiFieldsWithStyles,
      nakedComponent: MultiFields.MultiFieldsOriginal,
      name: 'categories',

      placeholder: 'Add litter category',
      data: data,
      noOptionsMessage: 'No more categories',

      subfields: {
        number: {
          component : TitleTextField,
          inputProps: { min: 0, step: 1},
          name: 'number',
          title: 'Number',
          type: enums.TYPES.number,
          placeholder: 'eg. 123',
          regexValidation: '^[0-9]+'
        },
        brand: {
          component : TitleTextField,
          name: 'brand',
          title: 'Brand',
          type: enums.TYPES.string,
          placeholder: 'eg. whatever',
          regexValidation: '^\\w+( \\w+)*$'
        },
      }
    }
  },
  PAGES,
  CUSTOM_PAGES:[
    {
      visible: true,
      icon: <EventIcon/>,
      label: PAGES.events.label,
      click: () => window.location = 'https://plasticpatrol.co.uk/clean-ups/'
    },
  ],
  customiseString,
  getStats
}
