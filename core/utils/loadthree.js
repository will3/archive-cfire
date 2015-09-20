window['THREE'] = require('three');
require('../../three/shaders/SSAOShader.js');
require('../../three/shaders/CopyShader.js');
require('../../three/shaders/FXAAShader.js');
require('../../three/shaders/MedianFilter.js');
require('../../three/shaders/InvertThreshholdPass.js');
require('../../three/shaders/CannyEdgeFilterPass.js');
require('../../three/shaders/MultiplyBlendShader.js');
require('../../three/shaders/BlendShader.js');

require('../../three/postprocessing/RenderPass.js');
require('../../three/postprocessing/ShaderPass.js');
require('../../three/postprocessing/MaskPass.js');
require('../../three/postprocessing/EffectComposer.js');