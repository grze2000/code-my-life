gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(MorphSVGPlugin);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(DrawSVGPlugin);


const svg = document.querySelector('#fairytale');
const viewBox = svg.viewBox.baseVal;
const aspectRatio = document.body.clientWidth/document.body.clientHeight;
let lastDocumentWidth = document.querySelector('.timeline').viewBox.baseVal.width;
const parallaxImage = document.querySelector('.parallax-image__image');

let dino, light;
const clouds = gsap.timeline();
const headerScroll = gsap.timeline({defaults: {ease: "none"}});
const smoke = gsap.timeline({repeat: -1, repeatDelay: 0, defaults: {ease: 'none'}});
const walking = gsap.timeline({ defaults: { duration: 0.25 }, repeat: -1 });

function correctVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function animateDino() {
  gsap.set('#dino', {
    x: -500,
    y: 20,
    rotation: -1
  });

  dino = gsap.to('#dino', {
    motionPath: {
      path: [
        {x: -160, y: -3, rotation: -1},
        {x: -90, y: -40, rotation: 0},
        {x: 0, y: -5, rotation: 0},
        {x: 160, y: -5, rotation: 1},
        {x: 230, y: -40, rotation: 2},
        {x: 315, y: 0, rotation: 5},
        {x: 500, y: 20, rotation: 10},
        {x: 750, y: 70, rotation: 15}],
      alignOrigin: [1, 0.5],
      curviness: 0.3,
      autoRotate: false
    },
    duration: 8,
    ease: CustomEase.create("custom", "M0,0 C0,0 0.279,0.303 0.308,0.322 0.34,0.342 0.569,0.563 0.598,0.582 0.626,0.6 1,1 1,1 "),
    repeat: -1,
    repeatDelay: 2
  });
  
  walking.set('#right-leg', {y: '-=7'})
  .addLabel('step1')
  .to('#left-leg', {y: '-=6'}, 'step1')
  .to('#right-leg', {y: '+=7'}, 'step1')
  .addLabel('step2')
  .to('#left-leg', {y: '+=6'}, 'step2')
  .to('#right-leg', {y: '-=7'}, 'step2');
}

function animateCluds() {
  const speed = 50;
  const cloudsValues = [
    [1750, -800, 0],
    [1050, -1500, 20],
    [700, -1800, 32]
  ];

  for (const [i, val] of cloudsValues.entries()) {
    clouds.fromTo(`#clouds${i+1}`, {x: val[0]}, {x: val[1], duration: (val[0]-val[1])/speed, repeat: -1, ease: 'none'}, val[2]);
  }
  // clouds.progress(0.5);
}

function animateLights() {
  light = gsap.to('.light path', {
    opacity: '0.4',
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'none'
  });
}

function animateSmoke() {
  smoke.to('#sm11', {duration: 1.5, morphSVG: '#sm21'})
  .to('#sm11', {duration: 2, morphSVG: '#sm31'})
  .to('#sm11', {duration: 2.5, morphSVG: '#sm41'});
}

function animateTerminal() {
  headerScroll.to(viewBox, {
    x: aspectRatio <= 1.77 ? -90.23*aspectRatio+475.60 : 315,
    y: aspectRatio > 1.77 ? -40.91*aspectRatio+605.82 : 533,
    width: 320, height: 180,
    duration: 3
  }).to('.terminal', {
    opacity: 1,
    duration: 1
  }).to('.terminal__content', {
    text: {
      value: document.querySelector('.terminal__content--target').innerHTML
    },
    duration: 10,
    delay: 0.5
  }).to('.terminal', {
    opacity: 0,
    duration: 1,
    delay: 0.5
  }).to(viewBox, {
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
    duration: 3
  });

  ScrollTrigger.create({
    trigger: ".header",
    scrub: true,
    pin: ".header",
    start: "top top",
    end: "bottom -400%",
    animation: headerScroll
  });
}

function autoScrollTerminal() {
  const terminal = document.querySelector('.terminal__content');
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(() => {
    if(terminal.scrollHeight > terminal.clientHeight) terminal.scrollTop = terminal.scrollHeight;
  });
  observer.observe(terminal, config);
}

function revealElement(element, direction=-1) {
  let x = 0, y = 0;
  if(element.classList.contains('reveal-left')) {
    x = -100;
  } else if(element.classList.contains('reveal-right')) {
    x = 100;
  } else {
    y = direction*100;
  }
  gsap.fromTo(element, {x: x, y: y, autoAlpha: 0}, {x: 0, y: 0, autoAlpha: 1, ease: 'expo', overwrite: 'auto', duration: 1.5});
}

function animateElementReveal() {
  gsap.utils.toArray('.reveal').forEach(element => {
    gsap.set(element, {autoAlpha: 0});
    ScrollTrigger.create({
      trigger: element,
      onEnter: () => { revealElement(element, -1) },
      onEnterBack: () => { revealElement(element, 1) },
      onLeave: () => { gsap.set(element, {autoAlpha: 0}) }
    })
  });
}

function animateSkew() {
  let proxy = {skew: 0};
  let skewSetter = gsap.quickSetter('.skew', 'skewY', 'deg');
  let clamp = gsap.utils.clamp(-15, 15);

  ScrollTrigger.create({
    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / -500);
      if(Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: "power3",
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew)
        })
      }
    }
  });

  gsap.set('.skew', {
    transformOrigin: 'left center',
    force3D: true
  });
}

function animateImageGallery() {
  gsap.utils.toArray('.loc').forEach((element, i) => {
    const index = i%4;
    gsap.set(element, {
      x: index%2 ? 100 : -100,
      y: index<2 ? -100: 100,
      scale: 0.5,
      autoAlpha: 0,
      rotation: [0, 3].includes(index) ? -15 : 15,
      transformOrigin: `${index%2 ? 'right' : 'left'} ${index<2 ? 'bottom' : 'top'}`
    });
  });

  gsap.utils.toArray('.images4').forEach((element) => {
    Array.from(element.children).forEach((child) => {
      gsap.to(child, {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        rotation: 0,
        scrollTrigger: {
          trigger: element,
          scrub: true,
          start: 'top bottom',
          end: 'top top'
        }
      });
    });
  });
}

function animateParallax() {
  gsap.to('.parallax-image__content', {
    yPercent: -100,
    ease: 'none',
    scrollTrigger: {
      trigger: '.parallax-image',
      scrub: true
    }, 
  });

  gsap.to('.parallax-image__image', {
    yPercent: 50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.parallax-image',
      scrub: true
    }, 
  });
}

function scalePrallax() {
  const parallax = document.querySelector('.parallax-image');
  const parallaxContent = document.querySelector('.parallax-image__content');

  gsap.set(parallax, {
    'padding-top': parallaxImage.height/2-parallaxContent.offsetHeight/2,
    'min-height': parallaxImage.height*1.5
  });

  const t2Start = document.querySelector('#timeline2-start');
  const t3Start = document.querySelector('#timeline3-start');
  gsap.set('#timeline2', {
    top: t2Start.offsetTop-150
  });
  gsap.set('#timeline3', {
    top: t3Start.offsetTop-200
  });
}

function animateCarousel() {
  gsap.utils.toArray('.carousel__line').forEach(line => {
    gsap.fromTo(line, {
      x: line.classList.contains('carousel-left') ? -line.scrollWidth : '100%'
    }, {
      x: line.classList.contains('carousel-left') ? 0 : (line.scrollWidth-line.offsetWidth)*-1,
      scrollTrigger: {
        trigger: '.carousel',
        scrub: 0.5,
        start: 'top bottom',
        end: 'top top'
      }
    });
  });
}

function pauseOffScreen() {
  ScrollTrigger.create({
    trigger: '.content',
    start: 'center top',
    onEnter: () => {
      [dino, walking, smoke, clouds, light].forEach(anim => {
        anim.pause();
      });
    },
    onLeaveBack: () => {
      [dino, walking, smoke, clouds, light].forEach(anim => {
        anim.play();
      });
    }
  });
}

function scaleTimeline() {
  const width = document.body.clientWidth;

  ['#line2', '#line7', '#line8', '#line9'].forEach(elem => {  
    const line = document.querySelector(elem);
    const lineSize = line.getBBox();
    gsap.set(line, {
      x: (width-lineSize.width)-lineSize.x,
    });
  });

  ['#text2', '#text7', '#text8', '#text9'].forEach(elem => {
    const text = document.querySelector(elem);
    const textSize = text.getBBox();
    gsap.set(text, {
      x: width-textSize.width-10
    });
  });
  
  ['#path', '#path2', '#path3'].forEach(elem => {
    const path = document.querySelector(elem).getAttribute('d').replace('M', 'M,').replace(/[sScC]/g, match => '*'+match+',').replace(/\d-/g, match => match[0]+',-').split('*')
    let newPath = '';

    path.forEach(curve => {
      let newCurve = []
      curve.split(',').forEach((elem, i) => {
        if(i % 2 == 1) {
          newCurve.push(Math.round((parseFloat(elem) * document.body.clientWidth / lastDocumentWidth*100)/100).toString());
        } else {
          newCurve.push(elem);
        }
      });
      newPath += newCurve[0]+newCurve.slice(1).join(',');
    });

    gsap.set(elem, {
      attr: {
        d: newPath
      }
    });
  });
}

function createTimeline(elem) {
  return gsap.timeline({
    defaults: {
      duration: 1
    },
    scrollTrigger: {
      trigger: elem,
      scrub: true,
      start: 'top center',
      end: 'bottom center'
    },
  });
}

function prepareLinesAndTexts() {
  gsap.set('#line1, #line3, #line4, #line5, #line6', {
    transformOrigin: 'center left',
    scale: [0, 1]
  });

  gsap.set('.timeline text', {
    scale: 0,
    transformOrigin: 'top center'
  });

  gsap.set('#line2, #line7, #line8, #line9', {
    transformOrigin: 'center right',
    scale: [0, 1]
  });
}

function animateTimeline() {
  const timeline = createTimeline('#timeline1');
  const timeline2 = createTimeline('#timeline2');
  const timeline3 = createTimeline('#timeline3');

  timeline.from('#path', {
    drawSVG: 0,
    ease: CustomEase.create("custom", "M0,0,C0,0,0.036,0.036,0.095,0.095,0.095,0.198,0.076,0.2,0.5,0.5,0.534,0.664,0.512,0.636,0.646,0.732,0.839,0.87,1,1,1,1"),
  }, 0);

  timeline2.from('#path2', {
    drawSVG: 0,
    ease: 'power1.inOut'
  }, 0);

  timeline3.from('#path3', {
    drawSVG: 0,
    ease: 'none'
  }, 0);

  [0.01, 0.1, 0.57, 0.66, 0.9].forEach((delay, i) => {
    timeline.to(`#line${i+1}, #text${i+1}`, {
      scale: 1,
      duration: 0.03
    }, delay);
  });

  [0.01, 0.5, 0.65].forEach((delay, i) => {
    timeline2.to(`#line${i+6}, #text${i+6}`, {
      scale: 1,
      duration: 0.3
    }, delay);
  });

  timeline3.to('#line9, #text9', {
    scale: 1,
    duration: 0.6
  }, 0);
}

function setEventListeners() {
  window.addEventListener('resize', () => {
    correctVh();
    scalePrallax();
    scaleTimeline();
    lastDocumentWidth = document.body.clientWidth;
  });

  scalePrallax();
  scaleTimeline();
  correctVh();
  lastDocumentWidth = document.body.clientWidth;
}

window.addEventListener('DOMContentLoaded', (event) => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  imagesLoaded('img, video, .content', {background: true}, () => {
    animateDino();
    animateLights();
    animateCluds();
    animateSmoke();

    gsap.to('.loader', {
      autoAlpha: 0,
      duration: 2,
      ease: 'power3.in',
      onComplete: () => {
        document.body.classList.remove('loading');

        setEventListeners();
        autoScrollTerminal();
        pauseOffScreen();

        animateTerminal();
        animateElementReveal();
        animateSkew();
        animateImageGallery();
        animateParallax();
        animateCarousel();
        if(document.body.clientWidth > 900) {
          prepareLinesAndTexts();
          animateTimeline();
        }
      }
    });
  });
});