import * as THREE from "three";

const motion = `
uniform float uScatter;
attribute vec3 aCentre, aRest, aAxis;
attribute float aSpin, aDelay;
mat3 rotateShard(vec3 a, float r) {
 float c=cos(r), s=sin(r), t=1.0-c;
 return mat3(t*a.x*a.x+c,t*a.x*a.y+s*a.z,t*a.x*a.z-s*a.y,
 t*a.x*a.y-s*a.z,t*a.y*a.y+c,t*a.y*a.z+s*a.x,
 t*a.x*a.z+s*a.y,t*a.y*a.z-s*a.x,t*a.z*a.z+c);
}
float shardProgress() { return smoothstep(aDelay, 1.0, uScatter); }
vec3 shardPosition(vec3 p) {
 float f=shardProgress();
 vec3 centre=mix(aCentre,aRest,f);
 // A controlled arc lifts shards clear of the sand before they meet their neighbours.
 centre.y += sin(f*3.14159265)*.80;
 return rotateShard(aAxis,f*aSpin)*(p-aCentre)*mix(1.0,.23,f)+centre;
}`;

const studio = `
vec3 studio(vec3 ray) {
 vec3 d=normalize(ray);
 float strip=exp(-pow((d.x+.31*d.z-.16)*12.0,2.0));
 float box=pow(max(dot(d,normalize(vec3(-.7,.8,.6))),0.0),24.0);
 float rim=exp(-pow((d.z-.24*d.x+.38)*18.0,2.0));
 float flash=pow(max(dot(d,normalize(vec3(.7,.65,.4))),0.0),180.0);
 return vec3(.022,.019,.020)+vec3(2.6)*strip+vec3(3.5,3.3,3.1)*box
 +vec3(1.8)*rim+vec3(6.0)*flash+vec3(.11)*max(d.y,0.0);
}`;

export function createCutMaterial(state, planes = null) {
  const uniforms = { uScatter: { value: state.scatter } };
  if (planes)
    Object.assign(uniforms, {
      uPlanes: { value: Array.from({ length: 96 }, (_, i) => planes[i] ?? new THREE.Vector4(0, 1, 0, 100)) },
      uPlaneCount: { value: planes.length },
      uCameraLocal: { value: new THREE.Vector3() },
      uBasis: { value: new THREE.Matrix3() },
    });
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
    ${planes ? "" : motion}
    varying vec3 vNormal,vWorld,vLocal,vLocalNormal;
    void main() {
      vec3 p=position, n=normal;
      ${planes ? "" : "p=shardPosition(position); n=rotateShard(aAxis,shardProgress()*aSpin)*normal;"}
      vec4 world=modelMatrix*vec4(p,1.0);
      vNormal=normalize(mat3(modelMatrix)*n); vWorld=world.xyz;
      vLocal=p; vLocalNormal=n;
      gl_Position=projectionMatrix*viewMatrix*world;
    }`,
    fragmentShader: `
    varying vec3 vNormal,vWorld,vLocal,vLocalNormal;
    ${studio}
    ${
      planes
        ? `
    uniform vec4 uPlanes[96]; uniform int uPlaneCount;
    uniform vec3 uCameraLocal; uniform mat3 uBasis;
    vec3 internalRay(vec3 origin, vec3 ray) {
      for(int bounce=0;bounce<3;bounce++) {
        float nearest=100.0; vec3 hit=vec3(0,1,0);
        for(int i=0;i<96;i++) {
          if(i>=uPlaneCount) break;
          vec4 plane=uPlanes[i]; float denom=dot(ray,plane.xyz);
          if(denom>.0001) {
            float t=(plane.w-dot(origin,plane.xyz))/denom;
            if(t>.001 && t<nearest) { nearest=t; hit=plane.xyz; }
          }
        }
        if(nearest>99.0) break;
        origin+=ray*nearest;
        vec3 exitRay=refract(ray,-hit,2.42);
        if(dot(exitRay,exitRay)>.001) return normalize(exitRay);
        ray=reflect(ray,hit); origin+=ray*.003;
      }
      return normalize(ray);
    }`
        : ""
    }
    void main() {
      vec3 n=normalize(vNormal), incident=normalize(vWorld-cameraPosition);
      float facing=abs(dot(-incident,n));
      vec3 reflection=studio(reflect(incident,n));
      ${
        planes
          ? `
      vec3 entering=refract(normalize(vLocal-uCameraLocal),normalize(vLocalNormal),1.0/2.42);
      vec3 outgoing=normalize(uBasis*internalRay(vLocal+entering*.006,entering));
      vec3 fire=normalize(cross(outgoing,vec3(.1,1,.2)))*.012;
      vec3 refraction=vec3(studio(outgoing+fire).r,studio(outgoing).g,studio(outgoing-fire).b);`
          : "vec3 refraction=studio(reflect(refract(incident,n,1.0/2.42),-n));"
      }
      float fresnel=.172+.828*pow(1.0-facing,5.0);
      vec3 light=mix(refraction,reflection,fresnel)+vec3(.022)*facing;
      gl_FragColor=vec4(light,1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  });
}

export function createShardDepth(uniform) {
  const material = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uScatter = uniform;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${motion}`)
      .replace("#include <begin_vertex>", "vec3 transformed=shardPosition(position);");
  };
  material.customProgramCacheKey = () => "mj-cut-sand-shards-v1";
  return material;
}

/** Procedural grain: no external texture downloads or repeated photographic tiles. */
export function createSandMaterial() {
  const material = new THREE.MeshStandardMaterial({ color: "#1e2022", roughness: 0.87, metalness: 0.08 });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vSand;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSand=position;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
      varying vec3 vSand;
      float grain(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      // Jittered cells create packed individual grains, including dark seams between them.
      vec4 sandCell(vec2 p) {
        vec2 base=floor(p), local=fract(p), delta=vec2(0.0);
        float nearest=8.0, second=8.0, tone=0.0;
        for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++) {
          vec2 cell=vec2(float(x),float(y)), id=base+cell;
          vec2 jitter=vec2(grain(id),grain(id+vec2(71.3,29.8)));
          vec2 offset=cell+.15+.7*jitter-local;
          float d=dot(offset,offset);
          if(d<nearest) { second=nearest; nearest=d; delta=offset; tone=grain(id+18.5); }
          else second=min(second,d);
        }
        return vec4(delta,tone,sqrt(second)-sqrt(nearest));
      }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
      vec4 cell=sandCell(vSand.xz*75.0);
      float footprint=max(length(dFdx(vSand.xz)),length(dFdy(vSand.xz)))*75.0;
      float detail=1.0-smoothstep(.6,1.6,footprint);
      float seams=smoothstep(.015,.14,cell.w);
      float fine=mix(.78,(.46+cell.z*.74)*(.45+.55*seams),detail);
      float sandRelief=.0025*pow(max(0.0,1.0-length(cell.xy)*1.6),.7)*detail;
      float ridge=sin(vSand.z*3.1+sin(vSand.x*.39)*.7)*.5+.5;
      diffuseColor.rgb*=.45+fine*.9+ridge*.12;`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
      // Derivative bump uses the actual view-space surface basis, so side light catches each grain.
      vec3 sx=dFdx(-vViewPosition), sy=dFdy(-vViewPosition);
      vec3 r1=cross(sy,normal), r2=cross(normal,sx);
      float determinant=dot(sx,r1)*faceDirection;
      vec3 gradient=sign(determinant)*(dFdx(sandRelief)*r1+dFdy(sandRelief)*r2);
      normal=normalize(abs(determinant)*normal-gradient);`,
      );
  };
  material.customProgramCacheKey = () => "mj-black-sand-v2";
  return material;
}
