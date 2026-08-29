// WebXR Hand Tracking Skeleton & Spatial Gesture Recognition Engine

export interface HandJoint {
  name: string;
  x: number;
  y: number;
  z: number;
}

export interface DetectedGesture {
  type: 'PINCH_SELECT' | 'PALM_GRAB_ROTATE' | 'INDEX_POINT' | 'OPEN_HAND';
  confidence: number;
  targetNodeId?: string;
  pinching: boolean;
}

export function detectSpatialGesture(pinchDist: number): DetectedGesture {
  if (pinchDist < 25) {
    return {
      type: 'PINCH_SELECT',
      confidence: 0.98,
      pinching: true,
      targetNodeId: 'node-core-router',
    };
  }

  return {
    type: 'OPEN_HAND',
    confidence: 0.92,
    pinching: false,
  };
}
