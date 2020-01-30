#!/usr/bin/env python3
# -*- encoding: utf8 -*-
import cairocffi as cairo
import numpy as np

def rasterize(glyph, scale=1):
  w = h = int(scale * 1000 + 0.5)
  surface = cairo.ImageSurface(cairo.FORMAT_A8, w, h)
  ctx = cairo.Context(surface)
  ctx.scale(scale, scale)
  ctx.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
  ctx.set_line_width(10)
  ctx.set_source_rgb(1, 1, 1)
  # Draw the contours
  for contour in glyph:
    ctx.move_to(contour[0]['x'], contour[0]['y'])
    i = 0
    while i < len(contour) - 1:
      if not contour[i]['on']: raise Exception('Invalid cubic bezier.')
      if not contour[i+1]['on']:
        end_pt = contour[i+3] if i+3 < len(contour) else contour[0]
        ctx.curve_to(contour[i+1]['x'], contour[i+1]['y'],
          contour[i+2]['x'], contour[i+2]['y'],
          end_pt['x'], end_pt['y'])
        i += 3
      else:
        end_pt = contour[i+1] if i+1 < len(contour) else contour[0]
        ctx.line_to(end_pt['x'], end_pt['y'])
        i += 1
  ctx.fill()
  # Convert to a numpy array
  buf = surface.get_data()
  arr = np.frombuffer(buf, dtype=np.uint8).reshape(h, w).copy()
  return arr
