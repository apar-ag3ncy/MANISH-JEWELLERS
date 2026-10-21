"""Build an original gold-bangle study for the legacy page, using only local Blender.

Run through Blender MCP, or with Blender's --background --python argument.
Creates a separate scene and saves an editable copy; existing user work is untouched.
This is contemporary decorative artwork, not a historical product photograph.
"""

from pathlib import Path
from math import cos, sin, pi

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
ASSET = ROOT / "assets/blender/heritage-bangles.blend"
OUTPUT = ROOT / "public/heritage/heritage-bangles.webp"
ASSET.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

scene = bpy.data.scenes.new("MJ Heritage · Gold through generations")
collection = bpy.data.collections.new("MJ Heritage · Three gold bangles")
scene.collection.children.link(collection)


def material(name, color, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = 0.96
    shader.inputs["Roughness"].default_value = roughness
    return mat


gold = material("MJ · Satin 22k gold study", (0.72, 0.43, 0.16), 0.27)
polished = material("MJ · Polished gold edges", (0.83, 0.57, 0.25), 0.19)


def band(name, radius, radial_width, height, center, mat, wave=0):
    vertices, faces = [], []
    around, profile = 256, 24
    for i in range(around):
        theta = 2 * pi * i / around
        for j in range(profile):
            phi = 2 * pi * j / profile
            r = radius + radial_width * cos(phi)
            z = height * sin(phi) + wave * sin(48 * theta)
            vertices.append((r * cos(theta), r * sin(theta), z))
    for i in range(around):
        for j in range(profile):
            faces.append((i * profile + j,
                          ((i + 1) % around) * profile + j,
                          ((i + 1) % around) * profile + (j + 1) % profile,
                          i * profile + (j + 1) % profile))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.location = center
    obj.data.materials.append(mat)
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    return obj


# Three separated, tangible bands: a quiet reference to a continuing family craft.
for index, (x, y, z) in enumerate([(-0.09, 0.02, -0.25), (0.03, 0.01, 0), (0.12, -0.02, 0.25)]):
    band(f"MJ Bangle {index + 1} · satin body", 1.12, 0.065, 0.088, (x, y, z), gold)
    for side in [-1, 1]:
        band(f"MJ Bangle {index + 1} · polished rim {side}", 1.137, 0.018, 0.018,
             (x, y, z + side * 0.068), polished)
    if index == 1:
        band("MJ Middle bangle · worked gold detail", 1.183, 0.012, 0.012,
             (x, y, z), polished, wave=0.022)


def aim(obj, target=(0, 0, 0)):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


camera_data = bpy.data.cameras.new("MJ Heritage Camera")
camera_data.type = next(i.identifier for i in camera_data.bl_rna.properties["type"].enum_items
                        if i.identifier == "ORTHO")
camera_data.ortho_scale = 3.5
camera = bpy.data.objects.new("MJ Heritage Camera", camera_data)
collection.objects.link(camera)
camera.location = (3.0, -5.5, 4.3)
aim(camera)
scene.camera = camera

for name, location, energy, size, color in [
    ("Softbox · key", (-3, -4, 5), 850, 4, (1, 0.93, 0.82)),
    ("Softbox · rim", (2, 2, 4), 1100, 3, (1, 0.97, 0.9)),
    ("Softbox · fill", (4, -2, 1), 450, 3, (0.88, 0.92, 1)),
]:
    light_type = next(i.identifier for i in bpy.types.Light.bl_rna.properties["type"].enum_items
                      if i.identifier == "AREA")
    light_data = bpy.data.lights.new(name, light_type)
    light_data.energy, light_data.size, light_data.color = energy, size, color
    light = bpy.data.objects.new(name, light_data)
    collection.objects.link(light)
    light.location = location
    aim(light)

world = bpy.data.worlds.new("MJ Heritage Studio")
world.use_nodes = True
background = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
background.inputs["Color"].default_value = (0.7, 0.65, 0.58, 1)
background.inputs["Strength"].default_value = 0.45
scene.world = world

try:
    scene.render.engine = "CYCLES"
except TypeError as error:
    raise RuntimeError(f"Local Cycles renderer is unavailable: {error}") from error
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.render.resolution_x = 1000
scene.render.resolution_y = 760
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
image_settings = scene.render.image_settings
image_settings.file_format = next(i.identifier for i in image_settings.bl_rna.properties["file_format"].enum_items
                                  if i.identifier == "WEBP")
image_settings.color_mode = next(i.identifier for i in image_settings.bl_rna.properties["color_mode"].enum_items
                                 if i.identifier == "RGBA")
image_settings.quality = 90
scene.render.filepath = str(OUTPUT)

original_scene = bpy.context.window.scene
bpy.context.window.scene = scene
bpy.context.view_layer.update()
# Use the normal writer: Blender 5.2.2 can crash copying a new scene via libraries.write.
bpy.ops.wm.save_as_mainfile(filepath=str(ASSET), compress=True, copy=True)
bpy.context.window.scene = original_scene
print(f"Created {scene.name}: {len(collection.objects)} objects. Editable source: {ASSET}")
print(f"Render target: {OUTPUT}")
