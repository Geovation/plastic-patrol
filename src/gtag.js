import firebase from "firebase/app";

let analytics;

export const gtagInit = () => {
  if (window.cordova && window.cordova.plugins && window.cordova.plugins.firebase) {
    analytics = window.cordova.plugins.firebase.analytics;
    analytics.logEvent("type", {
      event_category: "Tech",
      event_label: "mobile",
      non_interaction: true
    });
  } else {
    analytics = firebase.analytics();
    analytics.logEvent("type", {
      event_category: "Tech",
      event_label: "web",
      non_interaction: true
    });
  }

  analytics.setCurrentScreen("/#");

  analytics.logEvent('app version', {
    event_category: "Tech",
    event_label: process.env.REACT_APP_VERSION,
    non_interaction: true
  });

  analytics.logEvent("build number", {
    event_category: "Tech",
    event_label: process.env.REACT_APP_BUILD_NUMBER,
    non_interaction: true
  });
};

export const gtagPageView = (pathname) => {
  analytics.setCurrentScreen("/#" + pathname)
};

export const gtagEvent = (name, category=null, label=null,non_interaction=false) => {
    analytics.logEvent( name, {
      'event_category' : category,
      'event_label' : label,
      'non_interaction': non_interaction
    });
};

export const gtagSetId = (id) => {
  analytics.setUserId(id)
};
