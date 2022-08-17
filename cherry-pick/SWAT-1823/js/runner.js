///////////////////////////////////|
//////////// CONTENTS /////////////|
///////////////////////////////////|
// --| UTILS
// --| STORAGE
// --| DYNAMIC CONTENT
// --| SEARCH RESULTS API
// --| VALIDATION
// --| ANIMATIONS
// --| STEPS
// ----| STEP HELPERS
// ----| STEPS CREATION
// ----| STEPS MANAGER
// --| DOWNSELL MODAL
// --| MISCELLANEOUS
// --| INITIALIZE
///////////////////////////////////|

(function ($) {
  // =======================================================================
  // UTILS -----------------------------------------------------------------
  // =======================================================================
  const Utils = (function () {

    function googleAnalyticsTracking(obj) {
      const gaData = {
        event: obj.trigger || 'flowrida_visitor_event',
        eventAction: obj.action || 'uncategorized',
        eventCategory: obj.category || 'uncategorized',
        eventLabel: obj.label || '',
      };
      // Value must be an integer and these values get accumulated/added together in the GA data
      if (obj.value) gaData.value = parseInt(obj.value);
      // visitorEventInfo is a custom dimension that can be used to send over JSON data
      if (obj.props) gaData.visitorEventInfo = JSON.stringify(obj.props);
      if (window.dataLayer) window.dataLayer.push(gaData);
    }

    function reloadCachePage() {
      // Reload page if back navigation cache -- https://developer.mozilla.org/en-US/docs/Web/API/PageTransitionEvent/persisted
      $(window).on('pageshow', function (event) {
        if (event.persisted || window.performance.navigation.type === 2) {
          window.location.reload();
        }
      });
    }

    function getUrlQueryParams() {
      const urlSearchParams = new URLSearchParams(location.search);
      const queryParams = {};
      urlSearchParams.forEach(function (paramValue, paramKey) {
        if (paramValue) queryParams[paramKey] = paramValue.trim();
      });
      return queryParams;
    }

    function capitalize(str) {
      let capitalizedText = '';
      let i = 0;
      let splitted = str.split(' ');
      splitted.forEach(function(t) {
        let letters;
        letters = t.split('');
        if (letters.length === 0) {
          return '';
        }
        letters[0] = letters[0].toUpperCase();
        capitalizedText += letters.join('');
        i++;
        if (splitted.length > i) capitalizedText += ' ';
      });
      
      return capitalizedText;
    }

    function __removeDiacritics(str) {
      if (typeof String.prototype.normalize !== 'undefined') {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
      return str;
    }

    function __parseMiddleName(data) {
      if (!data.fn) {
        return data;
      }
      let fn = data.fn;
      let parsedMiddleName = fn.match(/^\S*\s\S+$/i);
      if (parsedMiddleName) {
        let mi = fn.split(' ')[1];
        fn = fn.split(' ')[0];
        data.mi = mi;
      }
      data.fn = fn.replace(/\s+/g, '');
      return data;
    }

    function serializeToObject(serializedArray) {
      if (!serializedArray) return {};
      const obj = {};
      for (i = 0; i < serializedArray.length; i++) {
        obj[serializedArray[i].name] = serializedArray[i].value;
      }
      return obj;
    }
    
    function __formatData(data) {
      const pattern = new RegExp("[^ A-Za-z'-]", 'gi');
      for (const key of Object.keys(data)) {
        if (['fn', 'ln', 'mi', 'city', 'state'].includes(key)) {
          data[key] = capitalize(__removeDiacritics(data[key])).replace(pattern, '').trim();
        }
        if (key === 'state' && data[key] !== 'All') {
          data[key] = data[key].toUpperCase();
        }
      }
      return data;
    }

    function storeFormattedData(data) {
      let currentLocalStorage = Storage.get() || {};
      let mergedData = {...currentLocalStorage, ...data};
      let parsedData = __parseMiddleName(mergedData);
      let formattedData = __formatData(parsedData);
      Storage.set(formattedData);
    }

    function setTrafficType() {
      let URLParams = getUrlQueryParams();
      if (!$.isEmptyObject(URLParams)) {
        // set affiliate traffic type
        if (URLParams.utm_medium && URLParams.utm_medium === 'affiliate') {
          sessionStorage.setItem('traffic_src', URLParams.utm_medium);
        }
      }
    }

    function setURLParamsData() {
      // Check for URL Params + store data
      let URLParams = getUrlQueryParams();
      if (!$.isEmptyObject(URLParams)) {
        if (URLParams.town && !URLParams.city) {
          URLParams.city = URLParams.town;
        }
        if (URLParams.fn || URLParams.ln || URLParams.city || URLParams.state) {
          storeFormattedData({
            fn: URLParams.fn || '',
            ln: URLParams.ln || '',
            age: '',
            mi: '',
            city: URLParams.city || '',
            state: URLParams.state || '',
          });
        }
      }
    }

    function removeValidationIfEmpty(input) {
      if (!$(input).val()) $(input).removeClass('valid');
      $(input).on('keyup blur', function () {
        if (!$(input).val()) $(input).removeClass('valid');
      });
    }

    function triggerInputFocus(element) {
      const desktopView = window.matchMedia('(min-width: 991px)');
      if (desktopView.matches) {
        $(element).trigger('focus');
      }
    }

    function disableOrEnableButton(form, disableOrEnable) {
      const $submitButton = $(form).find('.js-cta-btn');
      const isEnable = disableOrEnable === 'enable';
      isEnable ? $submitButton.prop('disabled', false) : $submitButton.prop('disabled', true);
    }

    function showOrHideCatfishLogo() {
      if (window.pageview_flow_category !== 'homepage') {
        $('.js-catfish-logo').show();
      }
    }

    return {
      track: googleAnalyticsTracking,
      reloadCachePage,
      getUrlQueryParams,
      capitalize,
      storeFormattedData,
      serializeToObject,
      setTrafficType,
      setURLParamsData,
      removeValidationIfEmpty,
      triggerInputFocus,
      disableOrEnableButton,
      showOrHideCatfishLogo,
    };

  })();
  
  // =======================================================================
  // STORAGE ---------------------------------------------------------------
  // =======================================================================
  let Storage = (function () {
    const legacyPrefix = '__amplify__';
  
    function set(value, key = 'searchData') {
      localStorage.setItem(key, JSON.stringify(value));
      localStorage.setItem(legacyPrefix + key, JSON.stringify({data: value}));
    }
    
    function get(key = 'searchData') {
      let storedData = JSON.parse(localStorage.getItem(legacyPrefix + key)) || JSON.parse(localStorage.getItem(key));
      if (storedData && storedData.data) storedData = storedData.data; // legacy code is inside storedData.data, new code is not.
      return storedData;
    }
  
    function remove(key = 'searchData') {
      localStorage.removeItem(key);
      localStorage.removeItem(legacyPrefix + key);
    }
  
    function clear() {
      localStorage.clear();
    }
  
    return {
      set,
      get,
      remove,
      clear,
    };
  })();

  // =======================================================================
  // DYNAMIC CONTENT -------------------------------------------------------
  // =======================================================================
  const DynamicContent = (function () {

    const DYNAMIC_CONTENT_MAP = {
      'default': {
        title: 'Public',
        desc: 'public records.<br> See what new info you may discover!',
      },
      'criminalrecords': {
        title: 'Criminal',
        desc: 'CRIMINAL RECORDS.<br> See what new info you may discover!',
      },
      'marriagerecords': {
        title: 'Marriage',
        desc: 'MARRIAGE RECORDS.<br> See what new info you may discover!',
      },
      'divorcerecords': {
        title: 'Divorce',
        desc: 'DIVORCE RECORDS.<br> See what new info you may discover!',
      },
      'trafficrecords': {
        title: 'Traffic Ticket',
        desc: 'TRAFFIC TICKETS.<br> See what new info you may discover!',
      },
      'driverrecords': {
        title: 'Driver',
        desc: 'DRIVER RECORDS.<br> See what new info you may discover!',
      },
      'warrants': {
        title: 'Warrant',
        desc: 'WARRANTS.<br> See what new info you may discover!',
      },
      'courtrecords': {
        title: 'Court',
        desc: 'COURT RECORDS.<br> See what new info you may discover!',
      },
      'reportsrecords': {
        title: 'Report &',
        desc: 'REPORTS & RECORDS.<br> See what new info you may discover!',
      },
      'criminalrecordsdmv': {
        title: 'Criminal',
        desc: 'CRIMINAL RECORDS.<br> Plans start as low as $14.86/mo.',
      },
      'marriagerecordsdmv': {
        title: 'Marriage',
        desc: 'MARRIAGE RECORDS.<br> Plans start as low as $14.86/mo.',
      },
      'divorcerecordsdmv': {
        title: 'Divorce',
        desc: 'DIVORCE RECORDS.<br> Plans start as low as $14.86/mo.',
      },
      'trafficrecordsdmv': {
        title: 'Traffic',
        desc: 'TRAFFIC RECORDS.<br> Plans start as low as $14.86/mo.',
      },
      'driverrecordsdmv': {
        title: 'Driver',
        desc: 'DRIVER RECORDS.<br> Plans start as low as $14.86/mo.',
      },
      'reportsrecordsdmv': {
        title: 'Report &',
        desc: 'REPORTS & RECORDS.<br> Plans start as low as $14.86/mo.',
      },
      'warrantsdmv': {
        title: 'Warrant',
        desc: 'WARRANTS.<br> Plans start as low as $14.86/mo.',
      },
      'courtrecordsdmv': {
        title: 'Court',
        desc: 'COURT RECORDS.<br> Plans start as low as $14.86/mo.',
      },
      'dmv': {
        title: 'Public',
        desc: 'public records.<br> Plans start as low as $14.86/mo.',
      },
    };

    function setContent() {
      let pageType;
      if (typeof (segmentRuleQueryParams) !== 'undefined' && segmentRuleQueryParams) {
        pageType = segmentRuleQueryParams.pagetype || 'default';
      } else {
        let URLParams = Utils.getUrlQueryParams();
        pageType = URLParams.pagetype || 'default';
      }
      
      const dynamicContentMap = DYNAMIC_CONTENT_MAP[pageType.toLowerCase()] || DYNAMIC_CONTENT_MAP['default'];
      $('.js-search-type-title').text(dynamicContentMap.title);
      $('.js-search-type-desc').html(dynamicContentMap.desc);
    }

    return {
      setContent,
    }
  })();

  // =======================================================================
  // SEARCH RESULTS API ----------------------------------------------------
  // =======================================================================
  const SearchResults = (function () {
    const endpointBaseURL = 'https://www.beenverified.com/hk/teaser/?exporttype=jsonp&rc=100';
    let endpointURL = '';
    let previousEndpointURL = '';

    function __buildEndPointURL() {
      const searchData = Storage.get();
      const state = searchData.state === 'All' ? '' : searchData.state;
      let endpointURL = endpointBaseURL +
        '&fn=' + searchData.fn +
        '&ln=' + searchData.ln +
        '&state=' + (state || '') +
        '&city=' + (searchData.city || '') +
        '&age=' + (searchData.age || '') +
        '&mn=' + (searchData.mi || '');
      return endpointURL;
    }

    function __ifSameRequest() {
      return endpointURL === previousEndpointURL;
    }

    function initialize() {
      endpointURL = __buildEndPointURL();
      if (__ifSameRequest()) return;

      const endpointCall = $.ajax({
        url: endpointURL,
        dataType: 'jsonp',
        jsonpCallback: 'parseResults'
      });
      
      // On success:
      endpointCall.done(function (resp) {
        const recordCount = resp.response && resp.response.RecordCount;
      

        // GA Tracking
        if (isNaN(recordCount) || resp.response.Header.Provider !== '1') {
          // if API is down and returns weird response:
          Utils.track({ label: 'API failure backup skip results'});
        } else {
          Utils.track({ 
            label: 'Refine Modal Final Result Count', 
            props: {
              result_count: recordCount
            }
          });
        }

        // Store results
        const searchData = Storage.get() || {};
        searchData.searchResults = {
          totalRecords: +recordCount,
        };
        Storage.set(searchData);
      });
      
      // On fail:
      endpointCall.fail(function (resp) {
        // TODO later down the line --
        // As of now: when the API doesn't work,
        // it returns a weird format back instead of fail,
        // hence the check on line 385
      });
      
      // On complete, regardless of success or fail:
      endpointCall.always(function (resp) {
        previousEndpointURL = endpointURL;
      });
    }

    return {
      init: initialize
    }
    
  })();

  // =======================================================================
  // VALIDATION ------------------------------------------------------------
  // =======================================================================
  const Validate = (function () {

    // Initialize custom methods
    $.validator.addMethod('atLeastOneLetter', function (value) {
      return /[a-z]+/i.test(value);
    }, 'Alphabetic characters required');
    $.validator.addMethod('noEmptySpacesOnly', function (value) {
      return value === '' || value.trim().length !== 0;
    }, 'Empty/blank search not allowed');
    $.validator.addMethod('notEmail', function (value, element) {
      return this.optional(element) || !/^[ a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[ a-zA-Z0-9](?:[ a-zA-Z0-9-]{0,61}[ a-zA-Z0-9])?(?:\.[ a-zA-Z0-9](?:[ a-zA-Z0-9-]{0,61}[ a-zA-Z0-9])?)*$/.test(value);
    }, 'Email addresses are not searchable here');
    $.validator.addMethod('emptyOrletters', function (value) {
      return (value.trim() !== '' && /[a-z]+/i.test(value)) || (value.trim() === '');
    }, 'Alphabetic characters required');
    $.validator.addMethod('onlyNumbers', function (value) {
      return (value.trim() !== '' && /[0-9]+/i.test(value)) || value.trim() === '';
    }, 'Enter only numbers');
    $.validator.methods.email = function (value, element) {
      return this.optional(element) || /^([^*@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
    .test(value);
    };

    // ----- PEOPLE FORM -----------
    function peopleForm(form) {
      const peopleConfig = {
        rules: {
          fn: {
            required: true,
            notEmail: true,
            noEmptySpacesOnly: true,
            atLeastOneLetter: true
          },
          ln: {
            required: true,
            notEmail: true,
            noEmptySpacesOnly: true,
            atLeastOneLetter: true
          }
        },
        messages: {
          fn: {required: 'Please enter a first name'},
          ln: {required: 'Please enter a last name'},
        },
        errorPlacement: (error, element) => {
          error.insertAfter(element.parent());
        },
        onkeyup: (element) => {
          $(element).valid();
        },
        submitHandler: function (form) {
          Utils.disableOrEnableButton(form, 'disable');
          Utils.track({ label: 'Submitted Search Form - People'});

          let formDataArray = $(form).serializeArray();
          const formDataObj = Utils.serializeToObject(formDataArray);
          Utils.storeFormattedData(formDataObj);
          Storage.remove('currentRecord');
          StepManager.goToNextStep();
        }
      };

      $(form).validate(peopleConfig);
    }

    // ----- LOCATION FORM ---------
    function locationForm(form) {
      const locationConfig = {
        rules: {
          city: {
            notEmail: true,
            emptyOrletters: true,
          },
        },
        messages: {
          city: 'Please enter a valid city'
        },
        errorPlacement: (error, element) => {
          error.insertAfter(element.parent());
        },
        onkeyup: false,
        submitHandler: function (form) {
          Utils.disableOrEnableButton(form, 'disable');
          Utils.track({ label: 'Submitted Search Form - Location'});
          // Remove checkmark if city input is blank
          Utils.removeValidationIfEmpty('.js-city-input');

          let formDataArray = $(form).serializeArray();
          const formDataObj = Utils.serializeToObject(formDataArray);
          Utils.storeFormattedData(formDataObj);
          StepManager.goToNextStep();
        }
      };

      $(form).validate(locationConfig);
    }

    return {
      peopleForm,
      locationForm,
    }

  })(); 

  // =======================================================================
  // ANIMATIONS ------------------------------------------------------------
  // =======================================================================

  const Animation = (function () {
    function searchingLocation() {
      const $map = $('.js-map');
      const $mapRadar = $('.js-radar');
      const $radarDot = $('.js-radar-dot');
  
      // destroy any active tween on the different element
      gsap.killTweensOf([$map, $mapRadar]);
      var timeline = gsap.timeline({ defaults: { ease: 'power1.inOut' } });
  
      // setting starting point for animations
      timeline.set($map, { scale: '1', 'background-position': '6% 6%' });
      timeline.set($radarDot, { height: 0, width: 0 });
  
      // map movement
      timeline.to($map, { 'background-position': '33% 26%', scale:'2.5', duration: 3});
  
      // radar dot fade in
      timeline.to($radarDot, { opacity: 1, height: '80%', width: '80%', duration: 0.3, delay: 1 });
  
      // radar sensor rotation
      timeline.to($mapRadar, { duration: 1.5, rotation: -180});
      timeline.to($mapRadar, { duration: 1.5, rotation: 0});
      timeline.to($mapRadar, { duration: 1, rotation: -95});
      timeline.to($mapRadar, { duration: 1, rotation: -25});
      timeline.to($mapRadar, { duration: 0.5, rotation: -45});
      timeline.to($mapRadar, { duration: 0.5, rotation: -25});
    }

    function __shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let newIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[newIndex]] = [array[newIndex], array[i]];
      }
    }
    function __animateCircularProgress($targetItem) {
      let $circle = $targetItem.find('.svg-progress .svg-bar');
      // setting strokeDashoffset to zero will trigger transition of progressbar
      $circle.css({ strokeDashoffset: 0});
    }
  
    function unlockProgressRandomly($targetItem) {
      const promise = new Promise((resolve) => {
        const durationEachStep = 4800;
        // randomise the sequence
        __shuffleArray($targetItem);
        let itemIndex = $targetItem.length - 1;
        // Using 2 - iterators index for iterating through the elements
        // multiplier for assigning the progressbar duration 
        // add 1700 to the progressbar to account for delay of 900 + 800
        for (let index = 0, multiplier = $targetItem.length; index < $targetItem.length; index++, multiplier--) {
          $targetItem.eq(index).find('.svg-bar').css('transition', 'stroke-dashoffset ' + (durationEachStep + 1700)*multiplier + 'ms ease');
        }
        setTimeout(() => {
          __animateCircularProgress($targetItem);
        }, 150);
        let interval = setInterval(function () {
          $targetItem.eq(itemIndex).addClass('active').delay(900).queue(function (next) {
            $(this).addClass('fade-out-right').delay(800).queue(function () {
              $(this).addClass('hide-height');
            });
            next();
            itemIndex--;
          });
          if (itemIndex === 2 && !$('.js-last-list').hasClass('d-none')) {
            $('.js-remaining-time').html(10);
          }
          if (itemIndex < 0) {
            clearInterval(interval);
            resolve('done');
          }
        }, durationEachStep);
      });
      
      return promise;
    }

    return {
      searchingLocation,
      unlockProgressRandomly,
    }
  })();

  // =======================================================================
  // STEPS -----------------------------------------------------------------
  // =======================================================================

  //----------------------------------------
  // ------ Step Helpers ----------
  //----------------------------------------
  const StepHelpers = (function () {

    function getFirstNameLastInitial() {
      const searchData = Storage.get();
      const firstName = searchData.fn;
      const lastInitial = searchData.ln.slice(0, 1);
      let firstNameNoDash = firstName;
      if (firstName.match(/-/)) {
        firstNameNoDash = $.map(firstName.split('-'), part => Utils.capitalize(part)).join(' ');
      }
      return {
        firstName, 
        firstNameNoDash, 
        lastInitial
      };
    }

    function validateLocation() {
      const searchData = Storage.get() || {};
      const isValidCity = searchData.city && searchData.city.toLowerCase() !== 'town';
      const isValidState = searchData.state && searchData.state.toLowerCase() !== 'all' && searchData.state.toLowerCase() !== 'state';
      return {isValidCity, isValidState};
    }

    function getLocationText() {
      const searchData = Storage.get() || {};
      const isValidLocation = validateLocation();
      const isValidCity = isValidLocation.isValidCity;
      const isValidState = isValidLocation.isValidState;
      let searchLocationText = '';
      if (isValidCity) {
        searchLocationText += searchData.city;
        if (isValidState) searchLocationText += ', ';
      }
      if (isValidState) searchLocationText += searchData.state;
      return searchLocationText;
    }

    function hasLowResults () {
      const searchResults = Storage.get().searchResults || {};
      const hasLittleResults = searchResults.totalRecords < 3;
      if (isNaN(searchResults.totalRecords) || hasLittleResults) {
        return true;
      }
    }

    return {
      getFirstNameLastInitial,
      validateLocation,
      getLocationText,
      hasLowResults,
    }

  })();

  //----------------------------------------
  // ------ Steps Creation -----------
  //----------------------------------------
  const stepsList = [
    // Enter a Name
    {
      name: 'formSearchName',
      $element: $('.js-form-search-name'),
      shouldSkip: () => {
        const searchData = Storage.get() || {};
        return (searchData.fn && searchData.ln);
      },
      onBeforeStart: () => {
        $('.js-before-start-loader').hide();
      },
      onStart: () => {
        Utils.disableOrEnableButton('.js-people-search', 'enable');
        Validate.peopleForm('.js-people-search');
        
        const searchData = Storage.get() || {};
        const $firstNameInput = $('.js-fn-input');
        const $lastNameInput = $('.js-ln-input');
        let firstName = '';
        const $nameSearchTitle = $('.js-name-search-title');
        Utils.triggerInputFocus('.js-fn-input');
        if (searchData.fn && searchData.ln) {
          (searchData.mi) ? firstName = `${searchData.fn} ${searchData.mi}` : firstName = searchData.fn;
          $firstNameInput.val(firstName).valid();
          $lastNameInput.val(searchData.ln).valid();
        } else if (searchData.fn) {
          (searchData.mi) ? firstName = `${searchData.fn} ${searchData.mi}` : firstName = searchData.fn;
          $nameSearchTitle.html(`Do you know <strong>${searchData.fn}'s last name? </strong>`);
          $firstNameInput.val(firstName).valid();
          Utils.triggerInputFocus('.js-ln-input');
        } else if (searchData.ln) {
          $nameSearchTitle.html(`Please enter a <strong>first name</strong> to begin`);
          $lastNameInput.val(searchData.ln).valid();
        }
      },
    },
    // Searching Subject
    {
      name: 'searchingSubject',
      $element: $('.js-searching-subject'),
      duration: 6,
      // using classic func declaration for scope of `this`
      onStart: function () {
        DynamicContent.setContent();
        const subjectName = StepHelpers.getFirstNameLastInitial();
        $('.js-search-subject').html(`for: <br><strong>${subjectName.firstName} ${subjectName.lastInitial}.</strong>`);

        this.$elem.find('.progress-bar').css({width:'0'}).animate({
          width: '100%',
        }, this.duration - 1000);

        SearchResults.init();
      },
      onBeforeStart: () => {
        $('.js-before-start-loader').hide();
      },
    },
    // Results Found
    {
      name: 'resultsFound',
      $element: $('.js-results-found'),
      duration: 6,
      shouldSkip: () => {
        return StepHelpers.hasLowResults();
      },
      onStart: () => {
        const searchResults = Storage.get().searchResults;
        let totalRecordsText = searchResults.totalRecords;
        if (totalRecordsText > 99) totalRecordsText = 99;

        const $odoText = $('.js-odometer');
        let celebrationDelay = 300;
        let delayBeforeAddPlusSign = 1700;

        odometer.innerHTML = totalRecordsText;

        setTimeout(function () {
          totalRecordsText === 99 ? $odoText.addClass('plus-added') : $odoText.removeClass('plus-added');
        }, delayBeforeAddPlusSign);
  
        setTimeout(function() {
          celebration.play();
        }, celebrationDelay);
        
      },
    },
    // Where Do They Live?
    {
      name: 'formSearchLocation',
      $element: $('.js-form-search-location'),
      shouldSkip: () => {
        const noEnoughResults = StepHelpers.hasLowResults();
        const searchData = Storage.get() || {};
        const hasCity = searchData.city ? true : false;
        if (noEnoughResults || hasCity) {
          return true;
        }
      },
      onStart: function () {
        DynamicContent.setContent();
        const subjectName = StepHelpers.getFirstNameLastInitial();
        this.$elem.find('.js-searched-name').text(`${subjectName.firstName} ${subjectName.lastInitial}`);

        Utils.disableOrEnableButton('.js-location-search', 'enable');
        Validate.locationForm('.js-location-search');
        // Remove checkmark if city input is blank
        Utils.removeValidationIfEmpty('.js-city-input');

        const searchData = Storage.get() || {};
        const validateLocation = StepHelpers.validateLocation();
        const isValidState = validateLocation.isValidState;
        // if searchData has city, the step is skipped, so, we don't fill it.
        if (isValidState) $('.js-state-input').val(searchData.state).valid();

        Utils.triggerInputFocus('.js-city-input');
      },
    },
    // Searching Location
    {
      name: 'searchingLocation',
      $element: $('.js-searching-location'),
      duration: 11,
      shouldSkip: () => {
        return StepHelpers.hasLowResults();
      },
      onBeforeStart: function () {
        $('.js-anim-without-location, .js-anim-with-location').addClass('d-none');
        $('.js-search-subject-location').html('');
      },
      onStart: function() {
        SearchResults.init();

        const subjectName = StepHelpers.getFirstNameLastInitial();
        this.$elem.find('.js-search-subject').html(`<strong>${subjectName.firstNameNoDash} ${subjectName.lastInitial}.</strong>`);

        const validateLocation = StepHelpers.validateLocation();
        const isValidCity = validateLocation.isValidCity;
        const isValidState = validateLocation.isValidState;
        if (isValidCity || isValidState) {
          // Search With Location:
          $('.js-anim-with-location').removeClass('d-none');
          const searchLocationText = StepHelpers.getLocationText();
          $('.js-search-subject-location').html(` in <strong>${searchLocationText}</strong>`);
          Animation.searchingLocation();
        } else {
          // Search Without Location:
          $('.js-anim-without-location').removeClass('d-none');
        }
      },
    },
    // Searching Data
    {
      name: 'searchingData',
      $element: $('.js-searching-data'),
      onStart: function () {

        const subjectName = StepHelpers.getFirstNameLastInitial();
        this.$elem.find('.js-search-subject').html(`<strong>${subjectName.firstNameNoDash} ${subjectName.lastInitial}.</strong>`);

        setTimeout(function () {
          $('.js-first-list').removeClass('d-none').addClass('fade-in-left');
        }, 100);

        const $firstListWrapper = this.$elem.find('.js-first-list');
        const $lastListWrapper = this.$elem.find('.js-last-list');
        const $firstListItems = $firstListWrapper.find('.animated');
        const $lastListItems = $lastListWrapper.find('.animated');

        Animation.unlockProgressRandomly($firstListItems).then(function () {
          $firstListWrapper.addClass('d-none');
          $lastListWrapper.removeClass('d-none').addClass('fade-in-left');
          $('.js-remaining-time').html(20);

          Animation.unlockProgressRandomly($lastListItems).then(function () {
            $lastListWrapper.addClass('d-none');
            $('.info-list .checkmark').show('slow');
            $('.js-countdown').hide();

            setTimeout(function () {
              window.location.href = $('body').data('next-page');
            }, 5000);
          });
        });
      }
    }
  ];

  //----------------------------------------
  // ------ Steps Manger ----------
  //----------------------------------------
  const StepManager = (function (onAllStepsComplete) {
    let currentStepIndex = 0;
    const fadeTime = 300;
    const steps = stepsList.map(__stepsMap);
    let currentTimeout;
    const onCompleteManager = onAllStepsComplete || function () {};

    function __stepsMap(currentStep) {
      const name = currentStep.name;
      const $elem = currentStep.$element;
      const duration = currentStep.duration ? currentStep.duration * 1000 : 0;
      // flag to control if step should be skipped only once:
      const skipOnce = currentStep.skipOnce || false;
      const shouldSkip = currentStep.shouldSkip || function () {};
      const onBeforeStart = currentStep.onBeforeStart || function () {};
      const onStart = currentStep.onStart || function () {};
      const goToStep = currentStep.goToStep || function () {};
      const stepBackTo = currentStep.stepBackTo || function () {};
      const onComplete = currentStep.onComplete || function () {};
      return {
        name,
        $elem,
        duration,
        skipOnce,
        shouldSkip,
        onBeforeStart,
        onStart,
        goToStep,
        stepBackTo,
        onComplete,
      };
    }

    function __getCurrentStep() {
      return steps[currentStepIndex];
    }

    function __hasNextStep() {
      return currentStepIndex + 1 < steps.length;
    }

    function __increaseIndex(obj = {}) {
      const currentStep = __getCurrentStep();
      let stepToGoTo;
      const currentStepSkipped = obj.skip ? true : false;
      if ((currentStep.shouldSkip() && !currentStepSkipped) || !currentStep.shouldSkip()) {
        stepToGoTo = currentStep.goToStep();
      }
      if (typeof stepToGoTo === 'string') {
        const indexOfStep = steps.findIndex((obj) => obj.name === stepToGoTo);
        currentStepIndex = indexOfStep;
      } else if (__hasNextStep()) {
      currentStepIndex++;
      }
    }
    
    function __decreaseIndex() {
      const currentStep = __getCurrentStep();
      const stepBackToStep = currentStep.stepBackTo();
      if (typeof stepBackToStep === 'string') {
        const indexOfStep = steps.findIndex((obj) => obj.name === stepBackToStep);
        currentStepIndex = indexOfStep;
      } else {
        currentStepIndex--;
      }
    }

    function stepBack() {
      __stopTimeout();
      const previousStep = __getCurrentStep();
      __decreaseIndex();
      previousStep.$elem.hide();
      __startCurrentStep();
    }

    function __stopTimeout() {
      clearTimeout(currentTimeout);
      currentTimeout = null;
    }

    function __trackStep(step) {
      const dataGA = step.$elem.data('ga');
      const googleAnalyticsLabel = 'people ' + dataGA + ' reached';
      Utils.track({ label: googleAnalyticsLabel });
    }
    
    function __startCurrentStep() {
      const currentStep = __getCurrentStep();
      __trackStep(currentStep);
      $('html, body').animate({ scrollTop: 0});
      if (!currentStep.skipOnce && currentStep.shouldSkip()) {
        goToNextStep({ skip: true });
        return;
      }
      currentStep.onBeforeStart();
      currentStep.$elem.fadeIn(fadeTime);
      currentStep.onStart();
      if (currentStep.duration) {
        currentTimeout = setTimeout(function () {
          goToNextStep();
        }, currentStep.duration);
      }
    }

    function goToNextStep(obj = {}) {
      const previousStep = __getCurrentStep();
      __stopTimeout();
      previousStep.onComplete();
      if (__hasNextStep()) {
        const currentStepSkipped = obj.skip ? true : false;
        currentStepSkipped ? __increaseIndex(obj) : __increaseIndex();
        previousStep.$elem.fadeOut(fadeTime, function () {
          __startCurrentStep();
        });
      } else {
        onCompleteManager();
      }
    }

    function init() {
      __startCurrentStep();
    }

    return {
      init,
      goToNextStep,
      stepBack,
    }

  })();

  // =======================================================================
  // DOWNSELL MODAL --------------------------------------------------------
  // =======================================================================
  (function () {
    
    $('.js-downsell-modal-close').on('click', () => {
      $('#downsell-modal').modal('hide');
      Utils.track({ label: 'Exit Downsell Modal - Exited' });
    });
    
    $('.js-downsell-modal-accept').on('click', () => {
      $('#downsell-modal').modal('hide');
      Utils.track({ label: 'Exit Downsell Modal - Accepted' });
    });

    const populateModal = () => {
      const $downsellModal = $('#downsell-modal');
      const searchData = Storage.get() || {};
      let subjectName = StepHelpers.getFirstNameLastInitial();
      let totalRecords = searchData && searchData.searchResults && searchData.searchResults.totalRecords;
      
      let $subjectNameText = $downsellModal.find('.js-search-name');
      $subjectNameText.text(`${subjectName.firstNameNoDash} ${subjectName.lastInitial}.`);

      if(totalRecords > 2) {
        if (totalRecords >= 99) totalRecords = '99+';

        let $totalRecordsText = $downsellModal.find('.js-total-records');
        $totalRecordsText.text(totalRecords);
      }

      $downsellModal.modal({
        backdrop: 'static',
        keyboard: false,
        show: true
      });
    };

    // Init file from downsell.new.js
    if (typeof downsell !== 'undefined' && typeof downsell.init === 'function') {
      let downsellModalInterval = setInterval(function () {
        const searchData = Storage.get() || {};
        if (searchData && searchData.fn) {
          const options = {
            elem: '#downsell-modal',
            override: true,
            cb: populateModal,
          }
          downsell.init({
            onBack: options,
            onBlur: options,
            onBreakingPlane: options,
            onIdle: options,
          });
          clearInterval(downsellModalInterval);
        }
      }, 1000);
    }

  })(); 
  
  // =======================================================================
  // MISCELLANEOUS ---------------------------------------------------------
  // =======================================================================
  function initGlobalEventListeners() {
    // Skip
    $('.js-skip').on('click', () => {
      StepManager.goToNextStep();
    });
  }

  // =======================================================================
  // INITIALIZE ------------------------------------------------------------
  // =======================================================================

  const initialize = (function () {
    Utils.reloadCachePage();
    Utils.setTrafficType();
    Utils.setURLParamsData();
    Utils.showOrHideCatfishLogo();
    StepManager.init();
    BVGO.init(StepManager.goToNextStep);
    initGlobalEventListeners();
  })();

})(jQuery);
