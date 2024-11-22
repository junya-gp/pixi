import 'pixi.js/advanced-blend-modes';
import { Application, MeshPlane, Geometry, Assets, Graphics } from 'pixi.js';

(async () => {
	// application
	const app = new Application();
	await app.init({ background: '#1099bb', resizeTo: window });
	document.body.appendChild(app.canvas);

	// texture
	const texture = await Assets.load('/pixi/02/texture.jpg');

	// vertices（横に30,縦に10）
	const verticesX = 30;
	const verticesY = 10;

	// vertex positions（画面サイズに対して均等な位置）
	const positions = [];
	for (let y = 1; y <= verticesY; y++) {
		for (let x = 1; x <= verticesX; x++) {
			positions.push((x / verticesX) * app.screen.width);
			positions.push((y / verticesY) * app.screen.height);
		}
	}

	// MeshPlane（画像を貼った平面）
	const plane = new MeshPlane({ texture, verticesX: verticesX, verticesY: verticesY });
	const planeBuffer = plane.geometry.getAttribute('aPosition').buffer;
	plane.position.set(0, 0);
	plane.width = app.screen.width;
	plane.height = app.screen.height;
	plane.blendMode = 'screen';
	plane.alpha = 0.9;
	app.stage.addChild(plane);

	// geometry（頂点用）
	const geometry = new Geometry();
	geometry.addAttribute('aPosition', positions, 2);

	// graphics（描画用）
	const vertexGraphics = new Graphics();
	vertexGraphics.position.set(0, 0);
	vertexGraphics.width = app.screen.width;
	vertexGraphics.height = app.screen.height;
	app.stage.addChild(vertexGraphics);
	
	// animation
	let timer = 0;
	app.ticker.add(() => {
		vertexGraphics.clear();
		for (let i = 0; i < planeBuffer.data.length; i += 2) {
			const sin = Math.sin(timer / 20 + i) * 0.2;
			const cos = Math.cos(timer / 20 + i) * 0.2;
			planeBuffer.data[i] += sin;
			planeBuffer.data[i + 1] += cos;
			positions[i] += sin;
			positions[i + 1] += cos;
			vertexGraphics.circle(positions[i], positions[i + 1], 2).fill(0xff0000);
		}
		planeBuffer.update();
		timer++;
	});
	
})();