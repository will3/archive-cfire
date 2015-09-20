require('../utils/loadthree');

var $ = require('jquery');

var RenderComponent = require('../components/rendercomponent');
var CollisionBody = require('../components/collisionbody');
var THREE = require('three');
var System = require('../system');
var resized = require('../utils/resized');

var Renderer = function(container) {
    System.call(this);

    this.container = container;

    this.componentPredicate = function(component) {
        return component instanceof RenderComponent;
    }

    //object look up, by component id
    this.objectMap = {};

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.rotation.order = 'YXZ';

    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.append(renderer.domElement);

    this.renderer = renderer;

    this.diffuseComposer = null;

    this.depthMaterial = null;

    this.depthRenderTarget = null;

    this.onlyAO = false;
    this.ssao = true;
    this.postprocessingNeedsUpdate = false;

    //set up resize
    resized(this.onWindowResize.bind(this));

    this.initPostprocessing();
};

Renderer.prototype = Object.create(System.prototype);
Renderer.prototype.constructor = Renderer;

Renderer.prototype.onWindowResize = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    //re init postprocessing
    this.initPostprocessing();
};

Renderer.prototype.initPostprocessing = function() {
    // Setup depth pass
    var depthShader = THREE.ShaderLib["depthRGBA"];
    var depthUniforms = THREE.UniformsUtils.clone(depthShader.uniforms);

    this.depthMaterial = new THREE.ShaderMaterial({
        fragmentShader: depthShader.fragmentShader,
        vertexShader: depthShader.vertexShader,
        uniforms: depthUniforms,
        blending: THREE.NoBlending
    });

    var pars = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter
    };
    this.depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, pars);

    //diffuse composer
    this.diffuseComposer = new THREE.EffectComposer(this.renderer);

    //render scene
    var renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.diffuseComposer.addPass(renderPass);

    if (this.ssao) {
        //ssao
        var ssaoPass = new THREE.ShaderPass(THREE.SSAOShader);
        //this.uniforms[ "tDiffuse" ].value will be set by ShaderPass
        ssaoPass.uniforms["tDepth"].value = this.depthRenderTarget;
        ssaoPass.uniforms['size'].value.set(window.innerWidth, window.innerHeight);
        ssaoPass.uniforms['cameraNear'].value = this.camera.near;
        ssaoPass.uniforms['cameraFar'].value = this.camera.far;
        ssaoPass.uniforms['onlyAO'].value = this.onlyAO;
        ssaoPass.uniforms['aoClamp'].value = 0.5;
        ssaoPass.uniforms['lumInfluence'].value = 1.0;
        this.diffuseComposer.addPass(ssaoPass);
    }

    //copy to scene
    var copyPass = new THREE.ShaderPass(THREE.CopyShader);
    copyPass.renderToScreen = true;
    this.diffuseComposer.addPass(copyPass);
};

Renderer.prototype.start = function() {
    this.animate();
};

Renderer.prototype.animate = function() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
};

Renderer.prototype.render = function() {
    if (this.postprocessingNeedsUpdate) {
        this.initPostprocessing();
        this.postprocessingNeedsUpdate = false;
    }

    if (this.ssao) {
        // Render depth into depthRenderTarget
        this.scene.overrideMaterial = this.depthMaterial;
        this.renderer.render(this.scene, this.camera, this.depthRenderTarget, true);
        this.scene.overrideMaterial = null;
    }

    this.diffuseComposer.render();
    // this.renderer.render(this.scene, this.camera);
};

Renderer.prototype.tick = function() {
    for (var id in this.componentMap) {
        var renderComponent = this.componentMap[id];

        if (this.objectNeedsUpdate(renderComponent)) {
            this.removeObject(renderComponent);
            this.addObject(renderComponent);
        }

        if (renderComponent.object == null) {
            continue;
        }

        //copy position, rotation and scale from entity
        renderComponent.object.position.copy(renderComponent.transform.position);
        renderComponent.object.rotation.copy(renderComponent.transform.rotation);
        renderComponent.object.scale.copy(renderComponent.transform.scale);
        renderComponent.object.visible = renderComponent.visible;
    }
};

Renderer.prototype.objectNeedsUpdate = function(renderComponent) {
    return this.objectMap[renderComponent.id] != renderComponent.object;
};

Renderer.prototype.addObject = function(renderComponent) {
    if (renderComponent.object == null) {
        return;
    }

    var object = renderComponent.object;
    this.scene.add(object);
    this.objectMap[renderComponent.id] = object;
};

Renderer.prototype.removeObject = function(renderComponent) {
    var object = this.objectMap[renderComponent.id];
    if (object != null) {
        this.scene.remove(object);
        delete this.objectMap[renderComponent.id];
    }
};

module.exports = Renderer;