import * as THREE from 'three';

/**
 * Traverses a Three.js Material and disposes all bound textures to prevent GPU memory leaks.
 */
export function disposeSingleMaterial(mat: THREE.Material) {
  if (!mat) return;
  const matAny = mat as any;
  const textureSlots = [
    'map',
    'lightMap',
    'bumpMap',
    'normalMap',
    'specularMap',
    'envMap',
    'roughnessMap',
    'metalnessMap',
    'emissiveMap',
    'alphaMap',
    'displacementMap',
    'gradientMap',
  ];
  for (const slot of textureSlots) {
    if (matAny[slot] && typeof matAny[slot].dispose === 'function') {
      matAny[slot].dispose();
    }
  }
  mat.dispose();
}

/**
 * Traverses an Object3D, disposing its geometries, materials, and attached textures.
 */
export function disposeObject(obj: THREE.Object3D) {
  if (!obj) return;

  if ('geometry' in obj && (obj as any).geometry && typeof (obj as any).geometry.dispose === 'function') {
    (obj as any).geometry.dispose();
  }

  if ('material' in obj && (obj as any).material) {
    const mat = (obj as any).material;
    if (Array.isArray(mat)) {
      mat.forEach(disposeSingleMaterial);
    } else {
      disposeSingleMaterial(mat);
    }
  }
}

/**
 * Comprehensively disposes a Three.js Scene and forces WebGL context loss
 * to guarantee that no GPU resources or contexts leak across component unmounts.
 */
export function disposeThreeScene(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  if (scene) {
    scene.traverse(disposeObject);
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }

  if (renderer) {
    try {
      renderer.dispose();
      renderer.forceContextLoss();
      const gl = renderer.getContext();
      if (gl) {
        const loseExt = gl.getExtension('WEBGL_lose_context');
        if (loseExt) {
          loseExt.loseContext();
        }
      }
    } catch (err) {
      // Non-fatal if context is already terminated
    }
  }
}
