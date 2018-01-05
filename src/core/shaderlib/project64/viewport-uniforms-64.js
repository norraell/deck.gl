// TODO - import these utils from fp64 package
function fp64ify(a, array = [], startIndex = 0) {
  const hiPart = Math.fround(a);
  const loPart = a - hiPart;
  array[startIndex] = hiPart;
  array[startIndex + 1] = loPart;
  return array;
}

// calculate WebGL 64 bit matrix (transposed "Float64Array")
function fp64ifyMatrix4(matrix) {
  // Transpose the projection matrix to column major for GLSL.
  const matrixFP64 = new Float32Array(32);
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      const index = i * 4 + j;
      fp64ify(matrix[j * 4 + i], matrixFP64, index * 2);
    }
  }
  return matrixFP64;
}

// 64 bit projection support
export function getFP64ViewportUniforms({project_uViewProjectionMatrix, project_uScale}) {
  // These two uniforms are generated by the fp32 project module
  if (project_uViewProjectionMatrix && project_uScale) {
    // viewport projection is being updated
    const glViewProjectionMatrixFP64 = fp64ifyMatrix4(project_uViewProjectionMatrix);
    const scaleFP64 = fp64ify(project_uScale);

    return {
      project_uViewProjectionMatrixFP64: glViewProjectionMatrixFP64,
      project64_uViewProjectionMatrix: glViewProjectionMatrixFP64,
      project64_uScale: scaleFP64
    };
  }
  return {};
}
