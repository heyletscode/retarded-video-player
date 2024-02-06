import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import videoSrcs from '../videos.json';

const screens = [];
const rowSize = 4;
const videoWidth = 1.778;
const videoHeight = 1;
const videoThickness = 0.05;

const xOffset = -6;
const zOffset = -4.2;
const yOffset = videoHeight + 0.1;

const spacing = 0.15;
const videoWidthThree = videoWidth * 2;
const videoHeightThree = videoHeight * 2;

function create(scene, world) {
  for (let i = 0;i < 12;i++) {
    addScreen(scene, world);
  }
  return screens;
}

function addScreen(scene, world) {
  const rowPos = screens.length % rowSize;
  const colPos = Math.floor(screens.length / rowSize);

  const screenShape = new CANNON.Box(
    new CANNON.Vec3(videoWidth, videoHeight, videoThickness)
  );

  const screenBody = new CANNON.Body({
    mass: 0,
    shape: screenShape,
  });
  world.addBody(screenBody);

  screenBody.position.set(
    xOffset + (videoWidthThree + spacing)*rowPos,
    yOffset + (videoHeightThree + spacing)*colPos,
    zOffset
  );

  const vidObj = getVideoObject(scene);
  vidObj.surface.position.copy(screenBody.position);

  screens.push({
    body: screenBody,
    ...vidObj
  });
}

function getVideoObject(scene) {
  let i = screens.length;

  const video = document.createElement('video');
  video.src = videoSrcs[i].src;
  video.dataset.title = videoSrcs[i].title;

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBAFormat;

  const geometry = new THREE.BoxGeometry(
    videoWidthThree,
    videoHeightThree,
    videoThickness * 2
  );
  const material = new THREE.MeshBasicMaterial({ 
    map: videoTexture
  });
  const surface = new THREE.Mesh(geometry, material);
  addBorderBox(surface);

  scene.add(surface);

  return {
    video,
    surface
  };
}

function addBorderBox(surface) {
  const borderBox = new THREE.BoxGeometry(
    videoWidthThree + 0.1,
    videoHeightThree + 0.1,
    videoThickness
  );

  const borderBoxMaterial = new THREE.MeshBasicMaterial({
    color: "red",
    transparent: true,
    opacity: 0
  });

  const borderMesh = new THREE.Mesh(borderBox, borderBoxMaterial);
  surface.add(borderMesh);
}

export default { create };