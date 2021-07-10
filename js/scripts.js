gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(MorphSVGPlugin);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

const svg = document.querySelector('#fairytale');
const viewBox = svg.viewBox.baseVal;
const aspectRatio = document.body.clientWidth/document.body.clientHeight;

gsap.set('#dino', {
  x: -500,
  y: 20,
  rotation: -1
});

gsap.to('#dino', {
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

const walking = gsap.timeline({
  defaults: {
    duration: 0.25
  },
  repeat: -1
});

walking.set('#right-leg', {y: '-=7'})
  .addLabel('step1')
  .to('#left-leg', {y: '-=6'}, 'step1')
  .to('#right-leg', {y: '+=7'}, 'step1')
  .addLabel('step2')
  .to('#left-leg', {y: '+=6'}, 'step2')
  .to('#right-leg', {y: '-=7'}, 'step2')

const cloudsValues = [
  [1750, -800, 0],
  [1050, -1500, 20],
  [700, -1800, 32]
]
const speed = 50;

const clouds = gsap.timeline();

for (const [i, val] of cloudsValues.entries()) {
  clouds.fromTo(`#clouds${i+1}`, {x: val[0]}, {x: val[1], duration: (val[0]-val[1])/speed, repeat: -1, ease: 'none'}, val[2]);
}
// clouds.progress(0.5);

gsap.to('#light path', {opacity: '0.4', duration: 2, repeat: -1, yoyo: true, ease: 'none'});

// const sky = new TimelineLite({repeat: -1, ease: 'none'});
// sky.to('#sky-bg', {fill: '#d6bfbf', duration: 5})
//   .to('#sky-bg', {fill: '#768ac2', duration: 10})
//   .to('#sky-bg', {fill: '#c4daf2', duration: 10})
//   .to('#sky-bg', {fill: '#D6CEBF', duration: 5});
// gsap.to('#bg-trees', {fill: '#506191', duration: 15, repeat: -1, yoyo: true, ease: 'none', delay: 1});
// gsap.to('#hand', {rotation: -90, transformOrigin: 'bottom right', duration: 1, repeat: -1, repeatDelay: 3, yoyo: true, ease: 'none'});

// gsap.set('#hand', {rotation: -90, transformOrigin: 'bottom right'});

const smoke = gsap.timeline({repeat: -1, repeatDelay: 0, defaults: {ease: 'none'}});
smoke.to('#sm11', {duration: 1.5, morphSVG: '#sm21'})
  .to('#sm11', {duration: 2, morphSVG: '#sm31'})
  .to('#sm11', {duration: 2.5, morphSVG: '#sm41'})

const headerScroll = gsap.timeline({defaults: {ease: "none"}});
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