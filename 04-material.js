import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App {
  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true }); // 3차원 장면이 렌더링 될 때, Object들의 경계선이 계단 현상 없이 부드럽게 표현됨
    renderer.setPixelRatio(window.devicePixelRatio); // pixel 비율에 대한 정보를 가져와야함
    divContainer?.appendChild(renderer.domElement); // canvas type의 DOM 객체
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this); // renderer나 Camera는 창 크기가 변경될 때 마다 크기에 맞게 속성 값을 재설정 해줘야함
    this.resize(); // renderer나 Camera의 속성을 창 크기에 맞추기 위해 한번 호출

    requestAnimationFrame(this.render.bind(this)); // render는 3차원 그래픽 장면을 만들어주는 메쏘드. requestAnimationFrame에 넘겨서 최대한 빠르게 호출하도록 함
  }
  _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
  }
  _setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3;
    this._camera = camera;
    this._scene.add(camera);
  }

  _setupLight() {
    // geometry를 균등하게 비추는 광원
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this._scene.add(ambientLight);

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    // this._scene.add(light); // 광원을 scene 객체의 구성 요소에 추가
    this._camera.add(light); // 카메라 이동에 맞춰서 광원이 이동하도록
  }

  _setupModel() {
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load(
      "images/glass/Glass_Window_002_basecolor.jpg"
    );
    const mapAO = textureLoader.load(
      "images/glass/Glass_Window_002_ambientOcclusion.jpg"
    );
    const mapHeight = textureLoader.load(
      "images/glass/Glass_Window_002_height.png"
    );
    const mapNormal = textureLoader.load(
      "images/glass/Glass_Window_002_normal.jpg"
    );
    const mapRoughness = textureLoader.load(
      "images/glass/Glass_Window_002_roughness.jpg"
    );
    const mapMetalic = textureLoader.load(
      "images/glass/Glass_Window_002_metallic.jpg"
    );
    const mapAlpha = textureLoader.load(
      "images/glass/Glass_Window_002_opacity.jpg"
    );
    const material = new THREE.MeshStandardMaterial({
      map: map,
      /*
       normalMap을 사용하면 box의 normal vector를 normalMap의 RGB값을 이용해서 계산함
       Mesh 표면의 각 픽셀에 대한 normal vector를 계산하게 됨 -> 픽셀 단위로 광원 효과가 달라져서 입체감을 표현할 수 있게 됨
       단 이 입체감은 착시현상임. (geometry의 형상이 바뀌는게 아니기 떄문에)
       */
      normalMap: mapNormal,

      displacementMap: mapHeight, // 실제로 mesh의  geometry 좌표를 변형시켜 입체감을 표현
      displacementScale: 0.2, // 변이 효과를 20%만 적용.
      displacementBias: -0.15, // displacement를 적용하기 위해서는 geometry의 좌표가 주어져야 하기 때문에 geometry의 segment를 나눠야함.

      /**
       * image에 미리 세밀한 음영을 처리하는 작업
       * 1. AmbientLight가 필요함
       * 2. geometry의 uv 좌표를 설정해줘야함
       */
      aoMap: mapAO,
      aoMapIntensity: 2,

      roughnessMap: mapRoughness,
      roughness: 0.5,

      metalnessMap: mapMetalic,
      metalness: 0.5,

      alphaMap: mapAlpha,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 256, 256, 256),
      material
    );
    box.position.set(-1, 0, 0);
    box.geometry.attributes.uv2 = box.geometry.attributes.uv;
    this._scene.add(box);

    // const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00);
    // this._scene.add(boxHelper);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 512, 512),
      material
    );
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
    sphere.position.set(1, 0, 0);

    // const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00);
    // this._scene.add(sphereHelper);

    this._scene.add(sphere);
  }

  resize() {
    const width = this._divContainer?.clientWidth;
    const height = this._divContainer?.clientHeight;

    this._camera.aspect = width / height;
    this._camera?.updateProjectionMatrix();
    this._renderer.setSize(width, height);
  }

  // time: 랜더링이 처음 시작된 이후 경과된 값(ms). requestAnimationFrame이 render 함수에 넣어주는 값임
  render(time) {
    this._renderer.render(this._scene, this._camera); // scene을 camera의 시점을 이용해서 렌더링 해라!
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001;
  }
}

window.onload = function () {
  new App();
};
