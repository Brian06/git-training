; (function ($, _) {
  var config = {};
  var noop = function () { };
  function trackNL(evtName, props) {
    if (typeof nolimit !== 'undefined' && nolimit.track) {
      props ? nolimit.track(evtName, props) : nolimit.track(evtName);
    }
    if (typeof heap !== 'undefined' && heap.track) {
      props ? heap.track(evtName, props) : heap.track(evtName);
    }
    if (typeof dataLayer !== 'undefined') {
      var gaData;
      if (props) {
        gaData = {
          event: 'flowrida_visitor_event',
          eventLabel: evtName,
          visitorEventInfo: JSON.stringify(props)
        };
        dataLayer.push(gaData);
      } else {
        gaData = {
          event: 'flowrida_visitor_event',
          eventLabel: evtName
        };
        dataLayer.push(gaData);
      }
    }
  };
  function setDefaultConfig() {
    config = {
      activeModal: false,
      beforeActivation: {
        override: false,
        cb: noop,
        defaultAction: hideOtherModals,
      },
      onBlur: {
        elem: '#downsell-blur',
        override: false,
        cb: noop,
        wasShown: false,
        outOfFocusDurationMaxTime: 60 * 1000,
        blurStartTime: false,
      },
      onBack: {
        elem: '#downsell-back',
        override: false,
        cb: noop,
        wasShown: false,
        backStartTime: 3 * 1000,
      },
      onIdle: {
        elem: '#downsell-idle',
        override: false,
        cb: noop,
        wasShown: false,
        checkingInterval: false,
        inactiveThreshold: 30 * 10000, // 5 minutes
        lasActiveTime: Date.now(),
      },
      onUnload: {
        elem: '#downsell-unload',
        wasShown: false,
        active: false,
        text: '\n*************************************************\nWANT UNLIMITED REPORTS FOR JUST $1?\n*************************************************\n\n\n*** Please stay on this page for more details. ***\n\n\n\n',
        redirectTo: 'https://www.beenverified.com/subscribe/view_report_trial',
        bounceElement: '#subscribe_bounce_text',
        bounceAttribute: 'sub-bounce-url'
      },
      onBreakingPlane: {
        elem: '#downsell-breaking',
        override: false,
        cb: noop,
        wasShown: false,
        delayBeforeFiring: 0 * 1000,
        sensitivity: 20, // pixels from the top
      }
    };
  }
  function overrideDefaultConfig(options) {
    _.merge(config, options);
  }
  //////////////////////////////
  /////      ShowModal     ///// 
  //////////////////////////////
  function hideOtherModals() {
    $('.modal.in').modal('hide');
  }

  function showModal(id) {
    // Don't show any other downsell if back/unload modals are already shown.
    if (config.activeModal === config.onBack.elem || config.activeModal === config.onUnload.elem) {
      return;
    }

    config.beforeActivation.override ? config.beforeActivation.cb() : config.beforeActivation.defaultAction;
    $(config.activeModal).modal('hide');
    $(id).modal({
      backdrop: 'static',
      keyboard: false,
      show: true
    });

    config.activeModal = id;
  };
  //////////////////////////////
  /////       OnBlur       ///// 
  //////////////////////////////
  function determineDurationBucket(duration) {
    var buckets = {
      30: '30s - 44s',
      45: '45s - 59s',
      60: '60s - 74s',
      75: '75s - 89s',
      90: '90s - 104s',
      105: '105s - 119s',
      120: '120s - 134s',
      135: '135s - 149s',
      150: '150s - 164s'
    };

    if (duration < 30) return 'Less than 30s';

    if (duration > 165) return 'More than 165s';

    var msg = '', found = false;
    _.forEach(buckets, function (v, k) {
      var nextVal = (parseInt(k, 10) + 15);
      if (!found && duration >= parseInt(k, 10) && duration < nextVal) {
        found = true;
        msg = v;
      }
    });
    return msg;
  };
  function detachOnBlur() {
    $(window).off('.onBlur');
  }
  function initializeOnBlur() {
    if (config.onBlur.wasShown || (!config.onBlur.override && !$(config.onBlur.elem).length)) {
      return;
    }
    $(window).on('blur.onBlur', function () {
      config.onBlur.blurStartTime = Date.now();
    });

    $(window).on('focus.onBlur', function () {
      var blurStopTime = Date.now();
      var outOfFocusDuration = blurStopTime - config.onBlur.blurStartTime;
      if (config.onBlur.blurStartTime && outOfFocusDuration > config.onBlur.outOfFocusDurationMaxTime) {
        config.onBlur.wasShown = true;
        config.onBlur.override ? config.onBlur.cb() : showModal(config.onBlur.elem);
        var secondsOutOfPage = outOfFocusDuration / 1000;
        trackNL(' onBlur Modal - Viewed', {
          downsell_id: config.onBlur.elem,
          duration: determineDurationBucket(secondsOutOfPage)
        });

        detachOnBlur();
      }
    });
  }
  //////////////////////////////
  /////       OnBack       /////
  //////////////////////////////
  function detachOnBack() {
    $(window).off('.onBack')
  }
  function listenToHashChanges() {
    $(window).on('hashchange.onBack', function () {
      var hash = window.location.hash;
      if (!hash || hash === '#') {
        config.onBack.wasShown = true;
        config.onBack.override ? config.onBack.cb() : showModal(config.onBack.elem);
        trackNL('onBack Modal - Viewed', { downsell_id: config.onBack.elem });
        detachOnBack();
      }
    });
  }
  function removeHash() {
    window.location.hash = '';
  }
  function addHashMark() {
    window.location.hash = '.';
  }
  function initializeOnBack() {
    if (!config.onBack.override && !$(config.onBack.elem).length) {
      return;
    }
    removeHash();

    window.setTimeout(function () {
      addHashMark();
      listenToHashChanges();
    }, config.onBack.backStartTime);
  }
  //////////////////////////////
  /////       OnIdle       ///// 
  //////////////////////////////
  function detachOnIdle() {
    $(window).off('.onIdle');
    var interval = _.get(config, 'onIdle.checkingInterval');
    if (interval) clearInterval(interval)
  }
  function initializeOnIdle() {
    if (config.onIdle.wasShown || (!config.onIdle.override && !$(config.onIdle.elem).length)) {
      return;
    }
    $(window).on('touchstart.onIdle', function () {
      config.onIdle.lasActiveTime = Date.now();
    });

    $(window).on('click.onIdle', function () {
      config.onIdle.lasActiveTime = Date.now();
    });

    $(window).on('scroll.onIdle', function () {
      config.onIdle.lasActiveTime = Date.now();
    });

    config.onIdle.checkingInterval = window.setInterval(function () {
      // Needed because the possibilty to avoid triggering this event 2 times by the interval frame time
      if (config.onIdle.wasShown) {
        return;
      }
      var timeDelta = Date.now() - config.onIdle.lasActiveTime;
      if (timeDelta >= config.onIdle.inactiveThreshold) {
        config.onIdle.wasShown = true;
        config.onIdle.override ? config.onIdle.cb() : showModal(config.onIdle.elem);
        trackNL('onIdle Modal - Viewed', { downsell_id: config.onIdle.elem });
        detachOnIdle();
      }
    }, 1000);
  };
  //////////////////////////////
  /////      OnUnload      ///// 
  //////////////////////////////
  function detachOnUnload() {
    window.onbeforeunload = noop;
  }
  function overrideOnUnloadAction() {
    trackNL('onBeforeUnload Popup - Viewed');

    config.beforeActivation.override ? config.beforeActivation.cb() : config.beforeActivation.defaultAction;

    var $subscribeBounceTB = $(config.onUnload.bounceElement),
      text = config.onUnload.text,
      redirectTo = config.onUnload.redirectTo;

    if ($subscribeBounceTB.length) {
      text = $subscribeBounceTB.text();
      redirectTo = $subscribeBounceTB.data(config.onUnload.bounceAttribute);
    }

    window.setTimeout(function () {
      trackNL('onBeforeUnload Popup - Accepted', { redirected_to: redirectTo });
      window.location = redirectTo;
    }, 500);

    detachOnUnload();
    config.onUnload.wasShown = true;
    return text;
  }
  function initializeOnUnload() {
    if (config.onUnload.wasShown || !config.onUnload.active) {
      return;
    }
    window.onbeforeunload = overrideOnUnloadAction;
  }
  //////////////////////////////
  /////   OnBreakingPlane  ///// 
  //////////////////////////////
  function detachOnBreakingPlane() {
    $(document).off('.onBreakingPlane');
  }
  function breakingPlaneAction() {
    // Necessary because of the custom time you can send to the timeout, avoiding to fire events on queue
    if (config.onBreakingPlane.wasShown) {
      return;
    }
    config.onBreakingPlane.wasShown = true;
    config.onBreakingPlane.override ? config.onBreakingPlane.cb() : showModal(config.onBreakingPlane.elem);
    trackNL('onBreakingPlane Modal - Viewed', { downsell_id: config.onBlur.elem });
    detachOnBreakingPlane();
  };
  function initializeOnBreakingPlane() {
    var delayTimer;
    if (config.onBreakingPlane.wasShown || (!config.onBreakingPlane.override && !$(config.onBreakingPlane.elem).length)) {
      return;
    }
    $(document).on('mouseleave.onBreakingPlane', function (evt) {
      if (evt.clientY > config.onBreakingPlane.sensitivity) {
        return;
      }
      delayTimer = setTimeout(breakingPlaneAction, config.onBreakingPlane.delayBeforeFiring);
    });

    $(document).on('mouseenter.onBreakingPlane', function () {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
    });
  }
  //////////////////////////////
  /////     Public API     ///// 
  //////////////////////////////
  function removeAllEventsListeners() {
    detachOnBlur();
    detachOnIdle();
    detachOnBack();
    detachOnUnload();
    detachOnBreakingPlane();
  }
  function init(options) {
    removeAllEventsListeners();
    setDefaultConfig();
    overrideDefaultConfig(options);
    initializeOnBlur();
    initializeOnBack();
    initializeOnIdle();
    initializeOnUnload();
    initializeOnBreakingPlane();
  }
  // expose Downsell as a global object
  window.downsell = {
    init: init,
    stop: removeAllEventsListeners,
  }
}(jQuery, _));
