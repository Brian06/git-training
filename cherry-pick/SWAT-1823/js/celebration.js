// Inspired from : https://codepen.io/anthonygreco/pen/PGPVJz
var celebration = (function() {
  var emitterSize = 20;
  var dotQuantity = 80;
  var dotSizeMin = 2;
  var dotSizeMax = 8;
  var speed = 2.4;
  var gravity = 0.5;
  var explosionQuantity = 5;
  var emitter = document.querySelector('#emitter');
  var explosions = [];
  var currentExplosion = 0;
  var container;
  var move;
  var totalExplosions = 5;

  function getRGBValues() {
    return( getRandom(30, 255) + ',' + getRandom(30, 230) + ',' + getRandom(30, 230));
  }

  function getDotAngle() {
    // a vector pointed up
    return getRandom(0, 1) * Math.PI * 2;
  }

  function getDotLength(size) {
    // get maximum distance from the center, factoring in size of dot, and then pick a random spot along that vector to plot a point
    return Math.random() * (emitterSize / 2 - size / 2);
  }

  function getDotSize() {
    return getRandom(dotSizeMin, dotSizeMax);
  }

  function getDotDuration() {
    // min duration 3s + random value
    return 3 + Math.random();
  }

  function createExplosion(container) {
    var timeLine = gsap.timeline({paused: true});
    var dots = [];
    var angle;
    var duration;
    var length;
    var dot;
    var size;
    var i;

    for (i = 0; i < dotQuantity; i++) {
      dot = document.createElement('div');
      dot.className = 'dot';
      dots.push(dot);
      gsap.set(dot, {
        backgroundColor: 'rgb(' + getRGBValues() +')',
        visibility: 'hidden'
      });
      container.appendChild(dot);
      size = getDotSize();
      angle = getDotAngle();      
      length = getDotLength(size);
      duration = getDotDuration();
      // place the dot at a random spot within the emitter, and set its size
      gsap.set(dot, {
        x: Math.cos(angle) * length, 
        y: Math.sin(angle) * length, 
        width: size, 
        height: size, 
        xPercent: -50, 
        yPercent: -50,
        visibility: 'hidden',
        force3D: true
      });
      timeLine.to(dot, duration / 2, {
        opacity: 0,
      }, 0).to(dot, duration, {
        visibility: 'visible',
        // Random 3d rotate between 0 to 360 degrees
        rotationX: '-='+getRandom(0, 360),
        rotationZ: '+='+getRandom(0, 360),
        physics2D: {
          angle: angle * 180 / Math.PI, // translate radians to degrees
          velocity: (100 + Math.random() * 250) * speed, // initial velocity
          gravity: 700 * gravity,
          friction: getRandom(0.1, 0.15) // friction value to give some small resistance to the animation
        }
      }, 0).to(dot, 1.25 + Math.random(), {
        opacity: 0
      }, duration / 2);
    }
    // hide the dots at the end
    timeLine.set(dots, {visibility: 'hidden'});
    return timeLine;
  }

  function explode(element) {
    var bounds = element.getBoundingClientRect();
    var explosion;
    if (++currentExplosion === explosions.length) {
      currentExplosion = 0;
    }
    explosion = explosions[currentExplosion];
    gsap.set(explosion.container, {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2
    });
    explosion.animation.restart();
  }

  function getRandom(min, max) {
    var randomNumber = min + Math.random() * (max - min);
    return randomNumber;
  }

  function playCelebration() {
    move.play(0);
    var intervalCount = 0,
    interval = setInterval(function() {
      if (intervalCount < totalExplosions) {
        explode(emitter);
        intervalCount++;
      } else {
        clearInterval(interval);
      }
    }, 150);
  }

  function setup() {
    for (i = 0; i < explosionQuantity; i++) {
      container = document.createElement('div');
      container.className = 'dot-container';
      wrapper = document.getElementById('celebration-wrapper').appendChild(container);
      explosions.push({
        container: container,
        animation: createExplosion(container)
      });
    }
    
    move = new gsap.timeline({
      paused: true
    }).fromTo(emitter, 0.4, {
      left: '0%'
    }, {
      left: '100%',
      ease: 'none'
    }).fromTo(emitter, 0.4, {
      left: '100%'
    }, {
      left: '0%',
      ease: 'none'
    });
  }

  setup();

  return {
    play: playCelebration,
  }
})();
