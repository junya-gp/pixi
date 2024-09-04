// Create a new application
const app = new PIXI.Application();

(async () =>
{
  // Initialize the application
  await app.init({ background: '#000', resizeTo: window });
  document.body.appendChild(app.canvas);

  // Load the maggot texture
    const [texture1, texture2, texture3] = await Promise.all([
      PIXI.Assets.load('star.png'),
      PIXI.Assets.load('star02.png'),
      PIXI.Assets.load('star03.png')
    ]);

    // Create a container for all the maggots particles and add it to the stage
    const sprites = new PIXI.Container();

    app.stage.addChild(sprites);

    // Create an array to store all the sprites
    const maggots = [];

    const totalSprites = 50000;

    for (let i = 0; i < totalSprites; i++)
    {
      // Create a new maggot Sprite
        const texture = [texture1, texture2, texture3][Math.floor(Math.random() * 3)];
        const dude = new PIXI.Sprite(texture);

        // Set the anchor point so the texture is centerd on the sprite
        dude.anchor.set(0.5);

        // Different maggots, different sizes
        dude.scale.set(0.08 + Math.random() * 0.03);
        
        dude.alpha = 0.75;

        //dude.blendMode = 'add';

        // Scatter them all
        dude.x = Math.random() * app.screen.width;
        dude.y = Math.random() * app.screen.height;

        //dude.tint = Math.random() * 0x808080;

        // Create a random direction in radians
        dude.direction = Math.random() * Math.PI * 2;

        // This number will be used to modify the direction of the sprite over time
        dude.turningSpeed = Math.random() - 0.8;

        // Create a random speed between 0 - 2, and these maggots are slooww
        dude.speed = (2 + Math.random() * 2) * 0.2;

        dude.offset = Math.random() * 100;

        // Finally we push the dude into the maggots array so it it can be easily accessed later
        maggots.push(dude);

        sprites.addChild(dude);
    }

    // Create a bounding box box for the little maggots
    const dudeBoundsPadding = 100;
    const dudeBounds = new PIXI.Rectangle(
        -dudeBoundsPadding,
        -dudeBoundsPadding,
        app.screen.width + dudeBoundsPadding * 2,
        app.screen.height + dudeBoundsPadding * 2,
    );

    let tick = 0;

    app.ticker.add(() =>
    {
        // Iterate through the sprites and update their position
        for (let i = 0; i < maggots.length; i++)
        {
            const dude = maggots[i];

            dude.scale.y = 0.095 + Math.sin(tick + dude.offset) * 0.05;
            dude.direction += dude.turningSpeed * 0.01;
            dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
            dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
            dude.rotation = -dude.direction + Math.PI;

            // Wrap the maggots
            if (dude.x < dudeBounds.x)
            {
                dude.x += dudeBounds.width;
            }
            else if (dude.x > dudeBounds.x + dudeBounds.width)
            {
                dude.x -= dudeBounds.width;
            }

            if (dude.y < dudeBounds.y)
            {
                dude.y += dudeBounds.height;
            }
            else if (dude.y > dudeBounds.y + dudeBounds.height)
            {
                dude.y -= dudeBounds.height;
            }
        }

        // Increment the ticker
        tick += 0.1;
    });
    console.log('Current renderer:', app.renderer.constructor.gpu);
})();
