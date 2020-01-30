#!/usr/bin/env python3
# -*- encoding: utf8 -*-
# Example: python -m scripts.glyph_model_convert FILE1 FILE2
import sys
import json
from importlib import import_module

sys.path.append('src/cv')
GlyphModel = import_module('glyph_model').GlyphModel

with open(sys.argv[1], 'r') as in_fp, open(sys.argv[2], 'w') as out_fp:
  file_js = json.load(in_fp)
  result = {}
  for char in file_js:
    glyph = file_js[char]
    glyph_model = GlyphModel(glyph)
    result[char] = glyph_model.get_model_object()
  json.dump(result, out_fp)
  