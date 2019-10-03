import dms2dec from "dms2dec";

import { isIphoneWithNotchAndCordova, device } from "utils";

const getLocationFromExifMetadata = imgExif => {
  let location, latitude, longitude;
  try {
    if (!window.cordova) {
      // https://www.npmjs.com/package/dms2dec
      const lat = imgExif.GPSLatitude.split(",").map(Number);
      const latRef = imgExif.GPSLatitudeRef;
      const lon = imgExif.GPSLongitude.split(",").map(Number);
      const lonRef = imgExif.GPSLongitudeRef;
      const latLon = dms2dec(lat, latRef, lon, lonRef);
      latitude = latLon[0];
      longitude = latLon[1];
    } else {
      if (device() === "iOS") {
        const iosGPSMetadata = this.props.cordovaMetadata.GPS;
        const latRef = iosGPSMetadata.LatitudeRef;
        const lonRef = iosGPSMetadata.LongitudeRef;
        latitude = iosGPSMetadata.Latitude;
        longitude = iosGPSMetadata.Longitude;
        latitude = latRef === "N" ? latitude : -latitude;
        longitude = lonRef === "E" ? longitude : -longitude;
      } else if (device() === "Android") {
        const androidMetadata = this.props.cordovaMetadata;
        const lat = androidMetadata.gpsLatitude;
        const latRef = androidMetadata.gpsLatitudeRef;
        const lon = androidMetadata.gpsLongitude;
        const lonRef = androidMetadata.gpsLongitudeRef;
        const latLon = dms2dec(lat, latRef, lon, lonRef);
        latitude = latLon[0];
        longitude = latLon[1];
      }
    }
    location = { latitude, longitude };
  } catch (e) {
    console.debug(`Error extracting GPS from file; ${e}`);
  }

  return location;
};
