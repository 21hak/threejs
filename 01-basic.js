import * as THREE from "../build/three.module.js";
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

		window.onresize = this.resize.bind(this); // renderer나 Camera는 창 크기가 변경될 때 마다 크기에 맞게 속성 값을 재설정 해줘야함
		this.resize(); // renderer나 Camera의 속성을 창 크기에 맞추기 위해 한번 호출

		requestAnimationFrame(this.render.bind(this)); // render는 3차원 그래픽 장면을 만들어주는 메쏘드. requestAnimationFrame에 넘겨서 최대한 빠르게 호출하도록 함
	}
	_setupCamera() {
		const width = this._divContainer?.clientWidth;
		const height = this._divContainer?.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100); // container의 가로, 세로를 가져와서 카메라 설정
		camera.position.z = 2;
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
		const geometry = new THREE.BoxGeometry(1, 1, 1); // 가로, 세로, 높이에 대한 값
		const material = new THREE.MeshPhongMaterial({ color: 0x44a88 }); // 바란색 계열의 재질

		const cube = new THREE.Mesh(geometry, material);
		this._scene.add(cube); // cube는 scene의 구성 객체가 됨
		this._cube = cube;
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
		this._cube.rotation.x = time; // rotation의 x값에 시간을 할당해서 시간이 지남에 따라 계속 회전함
		this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
