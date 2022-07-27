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
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light); // 광원을 scene 객체의 구성 요소에 추가
  }

  _setupModel() {
    // const material = new THREE.MeshBasicMaterial({
    //   // material의 기본 속성들
    //   visible: true, // 렌더링 시 mesh가 보일지 말지
    //   transparent: true, // opacity를 사용할지 말지
    //   opacity: 0.1,
    //   depthTest: true, // mesh의 픽셀 위치의 z값을 깊이 buffer로 테스트할지 여부
    //   depthWrite: true, // mesh의 픽셀에 대한 z값을 깊이 buffer에 기록할지 여부
    //   side: THREE.FrontSide, // 앞면만 보일지, 뒷면만 할것인지, 둘다 할것인지 -> 광원의 영향을 받는 재질

    //   color: 0xffff00,
    //   wireframe: false,
    // });

    // Mesh를 구성하는 정점에서 광원의 영향을 계산하는 물질
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0xffff00,
    //   emissive: 0xff0000, // mesh가 방출하는 색상값
    //   wireframe: false,

    //   transparent: true,
    //   opacity: 0.5,
    //   side: THREE.DoubleSide, // 앞면만 보일지, 뒷면만 할것인지, 둘다 할것인지 -> 광원의 영향을 받는 재질
    // });

    // Mesh가 렌더링되는 픽셀 단위로 광원의 영향을 계싼
    // const material = new THREE.MeshPhongMaterial({
    //   color: 0xff0000,
    //   emissive: 0x000000, // mesh가 방출하는 색상값
    //   specular: 0xffff00, // 광원에 의해 반사되는 색
    //   shininess: 4, // 반사 정도
    //   flatShading: false,
    // });

    // const material = new THREE.MeshStandardMaterial({
    //   color: 0xff0000,
    //   emissive: 0x000000, // mesh가 방출하는 색상값
    //   roughness: 0.25, // 표면 거친 정도. 값이 거칠수록 반사정도가 달라짐
    //   metalness: 0.6,
    //   flatShading: false,
    // });

    // MeshStandardMaterial를 상속
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      emissive: 0x000000, // mesh가 방출하는 색상값
      roughness: 1, // 표면 거친 정도. 값이 거칠수록 반사정도가 달라짐
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      flatShading: false,
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    box.position.set(-1, 0, 0);
    this._scene.add(box);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      material
    );
    sphere.position.set(1, 0, 0);
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
