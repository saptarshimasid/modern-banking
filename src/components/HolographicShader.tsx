'use client';

import React, { useEffect, useRef } from 'react';

export const HolographicShader = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeObserver: ResizeObserver | null = null;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas.parentElement);
    }
    syncSize();

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform float u_light_mode;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      
      float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
      }
      
      void main() {
          vec2 uv = v_texCoord;
          vec2 p = uv * 2.0 - 1.0;
          p.x *= u_resolution.x / u_resolution.y;
          float t = u_time * 0.2;
          
          float noise1 = hash(uv + t * 0.1);
          float noise2 = hash(uv - t * 0.15);
          
          // Interpolate background and glow colors based on light mode
          vec3 color1 = mix(vec3(0.0, 0.94, 1.0), vec3(0.0, 0.5, 0.6), u_light_mode); // Neon Cyan / Deeper Cyan
          vec3 color2 = mix(vec3(0.5, 0.0, 1.0), vec3(0.4, 0.1, 0.6), u_light_mode); // Electric Purple / Deeper Purple
          vec3 color3 = mix(vec3(0.05, 0.05, 0.1), vec3(0.97, 0.97, 0.98), u_light_mode); // Dark Background / Light Background
          
          float dist = length(p);
          float wave = sin(dist * 5.0 - t * 2.0) * 0.5 + 0.5;
          wave *= exp(-dist * 0.5);
          
          vec3 finalColor = mix(color3, color1, wave * 0.3);
          finalColor = mix(finalColor, color2, pow(uv.y, 3.0) * 0.4);
          
          vec2 grid = fract(uv * 20.0 - t * 0.5);
          float gridLine = smoothstep(0.02, 0.0, abs(grid.x - 0.5)) + smoothstep(0.02, 0.0, abs(grid.y - 0.5));
          finalColor += gridLine * color1 * 0.05;
          
          float scanline = sin(uv.y * 400.0 + t * 10.0) * mix(0.02, 0.005, u_light_mode);
          finalColor += scanline;
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function cs(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;

    const vertexShader = cs(gl.VERTEX_SHADER, vs);
    const fragmentShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uLightMode = gl.getUniformLocation(prog, 'u_light_mode');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    function render(t: number) {
      if (!canvas || !gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      
      const isLight = document.documentElement.classList.contains('light') ? 1.0 : 0.0;
      if (uLightMode) gl.uniform1f(uLightMode, isLight);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
export default HolographicShader;
