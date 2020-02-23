#!/usr/bin/env python3
# -*- encoding: utf8 -*-
# Example: python -m scripts.glyph_model_convert FILE1 FILE2
import sys
import json
from importlib import import_module
from progressive.bar import Bar

sys.path.append('src/cv')
GlyphModel = import_module('glyph_model').GlyphModel

with open(sys.argv[1], 'r') as in_fp, open(sys.argv[2], 'w') as out_fp:
  file_js = json.load(in_fp)
  result = {}

  bar = Bar(max_value=len(file_js), fallback=True)
  bar.cursor.clear_lines(2)
  bar.cursor.save()
  i = 0
  for char in file_js:
    glyph = file_js[char]
    try:
      glyph_model = GlyphModel(glyph)
      result[char] = glyph_model.get_model_object()
    except Exception as e:
      print('In file "' + sys.argv[1] + '", gid "' + char + '":')
      print(e)
    i += 1
    bar.cursor.restore()
    bar.draw(value=i)
  json.dump(result, out_fp)
  