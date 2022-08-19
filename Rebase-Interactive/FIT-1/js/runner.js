///////////////////////////////////|
//////////// CONTENTS /////////////|
///////////////////////////////////|
// UTILS
// TRACKING
// SEARCH
// DYNAMIC CONTENT
// INIT
///////////////////////////////////|
(function ($) {

  // =======================================================================
  // UTILS -----------------------------------------------------------------
  // =======================================================================

  var Utils = (function () {
    function trackNL(evtName, props) {
      if (typeof dataLayer !== 'undefined') {
        var gaData;
        if (props) {
          gaData = {
            event: 'flowrida_visitor_event',
            eventLabel: evtName,
            visitorEventInfo: JSON.stringify(props),
          };
          dataLayer.push(gaData);
        } else {
          gaData = {
            event: 'flowrida_visitor_event',
            eventLabel: evtName,
          };
          dataLayer.push(gaData);
        }
      }
    }

    function __checkMobile() {
      var isMobile = false;
      (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true;
      })(navigator.userAgent || navigator.vendor || window.opera);

      if (isMobile) {
        document.documentElement.classList.add('is-mobile');
      }
    }

    function __backNavCacheRefresh() {
      // Reload page if back navigation cache -- https://developer.mozilla.org/en-US/docs/Web/API/PageTransitionEvent/persisted
      $(window).on('pageshow', function (event) {
        if (event.persisted || window.performance.navigation.type == 2) {
          window.location.reload();
        }
      });
    }

    function init() {
      __backNavCacheRefresh();
      __checkMobile();
    }

    return {
      trackNL,
      init
    }
  })();

  // =======================================================================
  // CUSTOM TRACKING -------------------------------------------------------
  // =======================================================================
  var customTracking = (function () {
    function init() {

      $('#search-type-VIN-Lookup').on('click', function () {
        Utils.trackNL('vin_link_click');
      });
    }

    return {
      init
    }
  })();

  // =======================================================================
  // SEARCH ----------------------------------------------------------------
  // =======================================================================
  var $multiInput = $('.bv-input--multi input');
  var $input = $('.bv-input input');
  var $anyInput = $('.bv-input--multi input, .bv-input input');
  var $inputFirstName = $('#fn');
  var $inputLastName = $('#ln');
  var $inputPhone = $('#phone');
  var $inputFullAddress = $('#fullAddress');
  var $inputEmaiLAddress = $('#emailaddress');

  var initInputEvents = function () {
    // focus input field on page load (desktop only)
    var desktopView = window.matchMedia('(min-width: 991px)');
    if (desktopView.matches) {
      $inputFirstName.focus();
      $multiInput.parent().parent().addClass('active');
    }

    // Set active state for focused input fields on mobile viewport widths
    var mobileView = window.matchMedia('(max-width: 767px)');
    if (mobileView.matches) {
      $input.on('focus', function () {
        $(this).parent().addClass('active');
      });
      $input.on('focusout', function () {
        $(this).parent().removeClass('active');
      });
    }

    // Focus input field when switching forms (Desktop Only)
    $('#home-search-carousel').on('slid.bs.carousel', function () {
      var $currentIndex = $('div.active').index();
      if (desktopView.matches) {
        switch ($currentIndex) {
          case 0:
            $inputFirstName.focus();
            break;
          case 1:
            $inputPhone.focus();
            break;
          case 2:
            $inputFullAddress.focus();
            break;
          case 3:
            $inputEmaiLAddress.focus();
            break;
        }
      }
    });

    // Apply active class to style entire search form when any input is focused on.
    $multiInput.on('focus', function () {
      $(this).parent().parent().addClass('active');
    });
    $multiInput.on('focusout', function () {
      $(this).parent().parent().removeClass('active');
    });
    $input.on('focus', function () {
      $(this).parent().addClass('active');
    });
    $input.on('focusout', function () {
      $(this).parent().removeClass('active');
    });

    var errorCheck = function ($element) {
      if ($element) {
        setTimeout(function () {
          $element.hasClass('error') ? $element.parent().addClass('error') : $element.parent().removeClass('error');
          ($inputFirstName.hasClass('error') || $inputLastName.hasClass('error')) ? $element.parent().parent().addClass('error') : $element.parent().parent().removeClass('error');
        }, 10);
      }
    };

    $('.submit-btn').click(function () {
      errorCheck();
      $anyInput.blur();
    });

    // Set data attribute to use for styling label when not a required field
    // and apply error class to parent element for styling purposes.
    $input.on('blur', function () {
      $.trim($(this).val()) ? $(this).attr('filled', 'true') : $(this).attr('filled', 'false');
      errorCheck($(this));
    });
  };

  var initInputValidations = function () {
    var STORE_KEY = 'searchData';
    amplify.store(STORE_KEY, {});

    // Search carousel selector
    $('.home-carousel-indicator').on('click', function () {
      var currentIndex = $('.home-carousel-indicator').index($(this));
      $('.home-carousel-indicator').removeClass('active');
      $(this).addClass('active');
      setTimeout(function () {
        if (currentIndex === 2) validateProperties();
      }, 400);
    });

    $.validator.addMethod('atLeastOneLetter', function (value) {
      return /[a-z]+/i.test(value);
    }, 'Alphabetic characters required');
    $.validator.addMethod('noEmptySpacesOnly', function (value) {
      return value === '' || value.trim().length !== 0;
    }, 'Empty/blank search not allow');
    $.validator.addMethod('notEmail', function (value, element) {
      return this.optional(element) || !/^[ a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[ a-zA-Z0-9](?:[ a-zA-Z0-9-]{0,61}[ a-zA-Z0-9])?(?:\.[ a-zA-Z0-9](?:[ a-zA-Z0-9-]{0,61}[ a-zA-Z0-9])?)*$/.test(value);
    }, 'Email addresses are not searchable here');
    $.validator.addMethod('emptyOrletters', function (value) {
      return (value.trim() !== '' && /[a-z]+/i.test(value)) || (value.trim() === '');
    }, 'Alphabetic characters required');
    $.validator.addMethod(
      'phoneUS',
      function (phoneNumber, element) {
        phoneNumber = phoneNumber.replace(/\s+/g, '');
        return (
          this.optional(element) ||
          (phoneNumber.length > 9 &&
            phoneNumber.match(
              /^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/
            ))
        );
      },
      'Please specify a valid phone number'
    );
    // Custom email validation
    $.validator.methods.email = function (value, element) {
      return this.optional(element) || /^([^*@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i.test(value);
    };

    function storeQuery(formData) {
      var parsedData = formData.reduce(function (prev, item) {
        prev[item.name] = item.value.properCaps();
        return prev;
      }, amplify.store(STORE_KEY) || {});

      amplify.store(STORE_KEY, parsedData);
    }

    function clearCurrentRecord() {
      localStorage.removeItem('__amplify__currentRecord');
    }

    // People Search Validation
    function validatePeople() {
      var $searchPeople = $('#search-people');

      $searchPeople.validate({
        validClass: 'success',
        rules: {
          fn: {
            required: true,
            notEmail: true,
            noEmptySpacesOnly: true,
            atLeastOneLetter: true,
          },
          ln: {
            required: true,
            notEmail: true,
            noEmptySpacesOnly: true,
            atLeastOneLetter: true,
          },
        },
        messages: {
          fn: 'Please enter a first name',
          ln: 'Please enter a last name',
        },
        onkeyup: false,
        onclick: false,
        onsubmit: true,
        submitHandler: function (form, event) {
          event.preventDefault();
          Utils.trackNL('Submitted Search Form - People');
          var data = $(form).serializeArray();
          clearCurrentRecord();
          storeQuery(data);
          $('body').addClass('hide');
          var nextPage = $('body').attr('data-next-page');
          window.location = nextPage;
        },
      });
    }

    // Phone Search Validation
    function validatePhone() {
      var $searchPhone = $('#search-phone');

      $searchPhone.validate({
        validClass: 'success',
        errorElement: 'p',
        errorPlacement: function (error) {
          error.insertAfter('#bv-input--phone');
        },
        rules: {
          phone: {
            required: true,
            phoneUS: true,
          },
        },
        messages: {
          phone: 'Please enter a phone number. e.g., (212) 555-6789',
        },

        onkeyup: false,
        onclick: false,
        onsubmit: true,
        submitHandler: function (form, event) {
          event.preventDefault();
          Utils.trackNL('Submitted Search Form - Phone');

          var phoneNumber = $('#phone').val();
          var cleanNumber = phoneNumber.replace(/\D/g, '');
          $('#phone').val(cleanNumber);
          var encodedPhone = encodeURIComponent(base64.encode(cleanNumber));

          var nextPage = $('#search-phone').attr('action') || 'https://www.beenverified.com';
          window.location = nextPage + '?' + 'phone=' + encodedPhone;
        },
      });
    }

    // Email Search Validation
    function validateEmail() {
      var $searchEmail = $('#search-email');
      $searchEmail.validate({
        validClass: 'success',
        errorElement: 'p',
        errorPlacement: function (error) {
          error.insertAfter('#bv-input--email');
        },
        rules: {
          emailaddress: {
            required: true,
            email: true,
          },
        },
        messages: {
          emailaddress: 'Please enter an Email Address',
        },

        onkeyup: false,
        onclick: false,
        onsubmit: true,
        submitHandler: function (form, event) {
          event.preventDefault();
          Utils.trackNL('Submitted Search Form - Email');
          var urlArray = $('#search-email').serializeArray();
          var encodedEmail = encodeURIComponent(
            base64.encode(urlArray[0].value)
          );
          var nextPage = $('#search-email').attr('action') || 'https://www.beenverified.com';
          window.location = nextPage + '?' + 'emailaddress=' + encodedEmail;
        },
      });
    }

    // Property Search Validation
    function validateProperties() {
      var $headerSearchProperty = $('#search-property');
      var initAddress = function () {
        // address verification
        var liveaddress = $.LiveAddress({
          debug: false,
          key: '137296413373292866',
          addresses: [{
            street: $inputFullAddress,
          }],
          ambiguousMessage: 'Choose the exact address',
          invalidMessage: "We did not find that address in our records<br><span class='line_two'>Be sure to include a building number and leave out resident names</span>",
          stateFilter: 'AL,AK,AZ,AR,CA,CO,CT,DE,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY',
          submitVerify: true,
        });

        liveaddress.on('AddressWasAmbiguous', function (
          event,
          data,
          previousHandler
        ) {
          previousHandler(event, data);
        });

        // refocus search form if invalid
        liveaddress.on('InvalidAddressRejected', function (event, data, previousHandler) {
          $inputFullAddress.focus();
        });

        liveaddress.on('AddressChanged', function (event, data, previousHandler) {
          $inputFullAddress.removeClass('success');
          previousHandler(event, data);
        });

        liveaddress.on('AddressAccepted', function (event, data, previousHandler) {
          var chosen = data.response.chosen;

          amplify.store('propertySearchData', {
            address: chosen.delivery_line_1 + ' ' + chosen.last_line,
            street: chosen.delivery_line_1 || '',
            last_line: chosen.last_line || '',
            city: chosen.components.city_name || '',
            state: chosen.components.state_abbreviation || '',
            unit: chosen.components.secondary_number || '',
            zip5: chosen.components.zipcode || '',
            zip4: chosen.components.plus4_code || '',
          });
          amplify.store('propertyCurrentRecord', {
            _framerida_click: 'store propertyCurrentRecord',
            _framerida_mapped: 'TeaserRecord',
            parcel_address: {
              address: chosen.delivery_line_1 + ' ' + chosen.last_line,
              full: chosen.delivery_line_1 || '',
              parts: {
                carrier_route: chosen.metadata.carrier_route || '',
                city: chosen.components.city_name || '',
                house_number: chosen.components.primary_number || '',
                post_direction: chosen.components.street_postdirection || '',
                pre_direction: chosen.components.street_predirection || '',
                state: chosen.components.state_abbreviation || '',
                street_name: chosen.components.street_name || '',
                street_type: chosen.components.street_suffix || '',
                unit: chosen.components.secondary_number || '',
                zip: chosen.components.zipcode || '',
                zip4: chosen.components.plus4_code || '',
              },
            },
          });

          $inputFullAddress.addClass('success');
          $inputFullAddress.focus();

          previousHandler(event, data);
        });
      };

      $headerSearchProperty.validate({
        errorElement: 'p',
        errorPlacement: function (error) {
          error.insertAfter('#bv-input--address');
        },
        rules: {
          $fullAddress: 'required',
        },
        messages: {
          address: 'Please enter an address',
        },
        onkeyup: false,
        onclick: false,
        onsubmit: true,
        submitHandler: function (form) {
          Utils.trackNL('Submitted Search Form - Reverse Property');
          form.submit();
        },
      });
      initAddress();
    }

    function validateForms() {
      validatePeople();
      validatePhone();
      validateEmail();
      // validateProperties();
      $('.people-input').on('keyup', function () {
        $(this).valid();
      });
    }

    validateForms();
  };

  // =======================================================================
  // DYNAMIC CONTENT -------------------------------------------------------
  // =======================================================================
  var DynamicQueryArgs = (function () {
    var SEARCH_TYPE = {
      'phone': {
        'trigger': '#search-type-phone',
        'input': '#phone',
      },
      'email': {
        'trigger': '#search-type-email',
        'input': '#emailaddress',
      },
      'property': {
        'trigger': '#search-type-property',
        'input': '#fullAddress',
      },
    };

    //  Parses query arguments and returns them as an object.
    function __parseQueryArgs(query) {
      if (!query) {
        return null;
      }
      var args = _.chain(query.split('&'))
        .map(function (params) {
          var p = params.split('=');
          var key = p[0];
          var val = window.decodeURIComponent(p[1]);
          val = val.replace(/\/+$/g, ''); // clean up trailing slash
          val = val.replace(/\+/g, ' '); // replace white spaces
          return [key, val];
        })
        .object()
        .value();
      return args;
    };

    function __getQueryArgs() {
      // segmentRuleQueryParams is an injected global variable that stores all query args on flow position 1 pages from specific traffic sources
      if (typeof (segmentRuleQueryParams) !== 'undefined' && segmentRuleQueryParams) {
        queryArgs = segmentRuleQueryParams;
      } else {
        var query = window.location.search.substring(1);
        queryArgs = __parseQueryArgs(query);
      }
      return queryArgs;
    };

    function __showForm(searchType) {
      var desktopView = window.matchMedia('(min-width: 992px)');
      var searchType = SEARCH_TYPE[searchType];

      $(searchType.trigger).trigger('click');
      if (desktopView.matches) {
        $('#home-search-carousel').on('slid.bs.carousel', function () {
          $(searchType.input).trigger('focus');
        });
      }
    };

    function __displaySearchForm(queryArgs) {
      if (queryArgs && queryArgs.searchtype) {
        switch (queryArgs.searchtype) {
          case 'phone':
            __showForm('phone');
            break;
          case 'email':
            __showForm('email');
            break;
          case 'property':
            __showForm('property');
            break;
        }
      }
    };

    function __displayTargetedContent(queryArgs, $dynamicElems) {
      var ref = queryArgs.pagetype;
      var keyWord = ref && ref.toLowerCase().replace(' ', '');

      if (!ref) return;

      _.forEach($dynamicElems, function (elem) {
        var $elem = $(elem);
        var $defaults = $elem.find('[data-bv-ref=default]');
        var $target = $elem.find('[data-bv-ref=' + keyWord + ']');
        if (!$target || $target.length === 0) {
          $defaults.show();
        } else {
          $defaults.hide();
          $target.not('.collapse').show();
          if (keyWord === 'branded') $('.js-nav-toggle').addClass('d-md-none');
        }
      });
    };

    function __setTrafficType(queryArgs) {
      if (queryArgs.utm_medium === 'affiliate') {
        sessionStorage.setItem('traffic_src', queryArgs.utm_medium);
      }
    }

    function initialize() {
      var queryArgs = __getQueryArgs();
      if (queryArgs) {
        __setTrafficType(queryArgs);
        var $dynamicElems = $('[data-bv-content]');
        __displayTargetedContent(queryArgs, $dynamicElems);
        __displaySearchForm(queryArgs);
      }
    }

    return {
      init: initialize,
    }
  })();

  // =======================================================================
  // INIT ------------------------------------------------------------------
  // =======================================================================
  var initialize = (function () {
    Utils.init();
    initInputEvents();
    initInputValidations();
    DynamicQueryArgs.init();
    customTracking.init();
  })();

})(jQuery);
