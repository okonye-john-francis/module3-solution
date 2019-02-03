(function() {

  "use strict";

  angular.module("NarrowItDownApp", [])
         .controller("NarrowItDownController", NarrowItDownController)
         .service("MenuSearchService", MenuSearchService)
         .directive("foundItems", FoundItemsDirective)
         .constant("ApiBasePath", "https://davids-restaurant.herokuapp.com");

  NarrowItDownController.$inject = ["MenuSearchService"];

  function NarrowItDownController(MenuSearchService) {

    var narrow_it = this;

    narrow_it.found = [];

    narrow_it.search_item = "";

    narrow_it.search_results = ""; 

    narrow_it.search = function() {

      if(narrow_it.search_item && narrow_it.search_item.length > 0) {

        narrow_it.search_results = "";

        var promise = MenuSearchService.getMatchingMenuItems(narrow_it.search_item);
        
        promise.then(function(result) {

          narrow_it.found = result;

          if(narrow_it.found.length == 0) {

            narrow_it.search_results = "Nothing found";

          }
        });
      }
      else
      {
        narrow_it.search_results = "Nothing found";
      }
    };

    narrow_it.dontWant = function(index) {

      narrow_it.found.splice(index, 1);
    };
  }

  
  MenuSearchService.$inject = ["$http", "ApiBasePath"];

  function MenuSearchService($http, ApiBasePath) {

    var service = this;

    service.getMatchingMenuItems = function(searchTerm) {

      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      })
        .then(function(response){

          var menuItems = response.data;

          var foundItems = filterOnDescription(menuItems.menu_items, searchTerm);

          return foundItems;
        });
    };


    function filterOnDescription(list, searchTerm) {

      var new_list = [];
      
      for(var i = 0; i < list.length; i++) {

        if(list[i].description.indexOf(searchTerm) > 0) {

          new_list.push(list[i]);
        }
      }

      return new_list;
    }
  }


  function FoundItemsDirective() {
    var ddo = {
      templateUrl: "itemList.html",
      scope: {
        list: "<",
        title: "@title",
        result: "@result",
        dontWant: "&"
      },

    };

    return ddo;
  }
})();