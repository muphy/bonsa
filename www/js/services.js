angular.module('starter.services', ['firebase'])

.factory('UserService', function($firebase, $firebaseAuth,$localstorage) {
  
  var userIdKeyName = 'userId';
  // console.log($firebaseAuth.facebook.cachedUserProfile);
  
  var self = this;

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
      return this.getUserProfile() != null;
    },
    getUserProfile: function() {
      var keyName = 'firebase:session::sizzling-heat-271';
      var profile = $localstorage.getObject(keyName);
      return profile?profile.facebook.cachedUserProfile:null;
    },
    getUserId: function() {
      return self.userId;
    },
    getUserProfileImage: function() {
      return this.getUserProfile().picture.data.url;
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


/* key = firebase:session::sizzling-heat-271 */
/*
{  
   "uid":"facebook:10205539218736818",
   "provider":"facebook",
   "facebook":{  
      "id":"10205539218736818",
      "accessToken":"CAAWcTxFteh0BAEiGj0iQGXmdnHmtPZBYZBZBJQrVuCLOBQwy517BLQLg3BY9i0IDrG2MeXZA22XJXE8O1STlqvLfhm6hkXbilfdpJY8qHdTY2qpEu4gLR5S3FEqDE8BJtOfPs6tSvhlYbY2eNPODXn0bVmJn1DHSP6YBGExWMm2HzCBYSozPIwff84ks2aYriSH1ZCsKD6mRZBIHk114oF",
      "displayName":"Oh Jong Am",
      "cachedUserProfile":{  
         "id":"10205539218736818",
         "name":"Oh Jong Am",
         "last_name":"Am",
         "first_name":"Oh",
         "middle_name":"Jong",
         "gender":"male",
         "link":"https://www.facebook.com/app_scoped_user_id/10205539218736818/",
         "picture":{  
            "data":{  
               "is_silhouette":false,
               "url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/p100x100/430917_10200116844100841_274663657_n.jpg?oh=53322d36b0401740f9c1b84c4658c95b&oe=5588B37C&__gda__=1433571561_ad70f40a18dda32c764df4f5376f1e8d"
            }
         },
         "age_range":{  
            "min":21
         },
         "locale":"ko_KR",
         "timezone":9
      }
   },
   "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6ImZhY2Vib29rOjEwMjA1NTM5MjE4NzM2ODE4IiwicHJvdmlkZXIiOiJmYWNlYm9vayJ9LCJpYXQiOjE0MjU3MTA5NTZ9.1qYgVr9354tJUIBs-vxh7JsV7qVd-NpSOT1MsWYE0Kw",
   "auth":{  
      "uid":"facebook:10205539218736818",
      "provider":"facebook"
   },
   "expires":1425797356
}

*/