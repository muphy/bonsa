angular.module('starter.services', ['firebase'])

.factory('UserService', function($firebase, $firebaseAuth,$localstorage) {
  var keyName = 'firebase:session::sizzling-heat-271';
  var userIdKeyName = 'userId';
  // console.log($firebaseAuth.facebook.cachedUserProfile);
  var profile = $localstorage.getObject(keyName);
  var self = this;
  self.userProfile = profile?profile.facebook.cachedUserProfile:null;
  var ref = new Firebase("https://sizzling-heat-271.firebaseio.com/");
  var auth = $firebaseAuth(ref);

  var login = function(provider) {
    auth.$authWithOAuthPopup(provider).then(function(authData) {
      console.log(authData);
      if(self.onLoginSuccess) {
        self.onLoginSuccess(authData);
      }
    }).catch(function(error) {
      console.error("Authentication failed: ", error);
    });
  };

  var logout = function() {
    auth.$logout();
  };

  ref.onAuth(function(authData) {
    if (authData) {
      self.userId = authData.uid;
      $localstorage.set(userIdKeyName,authData.uid);
      self.userProfile = authData.facebook.cachedUserProfile;
      ref.child("users").child(authData.uid).set(authData.facebook.cachedUserProfile);
      console.log(self.userProfile );
    }
  });
  // find a suitable name based on the meta info given by each provider
  function getName(authData) {
    switch (authData.provider) {
      case 'password':
        return authData.password.email.replace(/@.*/, '');
      case 'twitter':
        return authData.twitter.displayName;
      case 'facebook':
        return authData.facebook.displayName;
    }
  }

  return {
    login: function(provider) {
      return login(provider);
    },
    logout: function() {
      return logout();
    },
    hasSession: function() {
      return self.userProfile != null;
    },
    getUserProfile: function() {
      return self.userProfile;
    },
    getUserId: function() {
      return self.userId;
    }
  }
})
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || false);
    },
    remove: function(key) {
      $window.localStorage.removeItem(key);
    }
  }
}])
