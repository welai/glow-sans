#!/usr/bin/env python3
# -*- encoding: utf8 -*-
import json
import numpy as np
from ref_finder import RefFinder

class GlyphModel(object):

  def _build_glyph_model(self):
    # A helper function to convert a control point representation to a list
    as_list = lambda pt: [ pt['x'], pt['y'] ]
    # On points of the contours
    on_pts = []
    # Off points of the contours
    off_pts = []
    # The contour indices of the on points
    on_contour_indices = []
    # The indices of on points that off points belong to 
    off_on_indices = []
    # coordinate boxes for alignment uses
    x_bins = [ [] for i in range(1000) ]
    y_bins = [ [] for i in range(1000) ]

    # The messy part of the function...
    for contour_index, contour in enumerate(self.glyph):
      first_on_index = len(on_pts); previous_on = True
      for pt_index, pt in enumerate(contour):
        x, y = as_list(pt)
        if pt['on']:
          if 0 <= x < 1000: x_bins[x].append('on' + str(len(on_pts)))
          if 0 <= y < 1000: y_bins[y].append('on' + str(len(on_pts)))
          previous_on = True
          on_pts.append(as_list(pt))
          on_contour_indices.append(contour_index)
        else:
          if 0 <= x < 1000: x_bins[x].append('off' + str(len(off_pts)))
          if 0 <= y < 1000: y_bins[y].append('off' + str(len(off_pts)))
          off_pts.append(as_list(pt))
          if previous_on:
            off_on_indices.append(len(on_pts) - 1)
          elif pt_index == len(contour) - 1:
            off_on_indices.append(first_on_index)
          else:
            off_on_indices.append(len(on_pts))
          previous_on = False
    
    # Off points offsets relative to the on points
    on_refs = [ self.ref_finder.find_ref(on_pt[0], on_pt[1]).tolist()
      for on_pt in on_pts ]
    on_offsets = [ [ on_pt[0] - on_refs[i][0], on_pt[1] - on_refs[i][1] ]
      for i, on_pt in enumerate(on_pts) ]
    off_offsets = [ [ off_pt[0] - on_pts[off_on_indices[i]][0],
      off_pt[1] - on_pts[off_on_indices[i]][1] ] 
      for i, off_pt in enumerate(off_pts) ]
    # Alignment information
    x_align = list(filter(lambda bin: len(bin) >= 2, x_bins))
    y_align = list(filter(lambda bin: len(bin) >= 2, y_bins))
    # Binding members
    self.on_refs = on_refs
    self.on_offsets = on_offsets
    self.off_offsets = off_offsets
    self.off_on_indices = off_on_indices
    self.on_contour_indices = on_contour_indices
    self.x_align = x_align; self.y_align = y_align

  def __init__(self, glyph):
    self.glyph = glyph
    self.ref_finder = RefFinder(glyph, 0.5)
    self._build_glyph_model()

  # A python reference implementation for restoring the glyph contours
  def restore(self):
    on_pts = np.array(self.on_refs) + np.array(self.on_offsets)
    off_pts = [ on_pts[self.off_on_indices[i]] + np.array(off_offset)
      for i, off_offset in enumerate(self.off_offsets) ]
    off_on_indices = self.off_on_indices
    on_contour_indices = self.on_contour_indices
    contours = []
    
    current_contour = []
    off_index = 0
    for on_index, pt in enumerate(on_pts):
      if on_contour_indices[on_index] != len(contours):
        contours.append(current_contour)
        current_contour = []
      current_contour.append({ 'x': pt[0], 'y': pt[1], 'on': True })
      if off_index <= len(off_pts) - 1\
      and off_on_indices[off_index] == on_index:
        off_pt1 = off_pts[off_index]; off_pt2 = off_pts[off_index+1]
        current_contour.append({ 'x': off_pt1[0], 'y': off_pt1[1], 'on': False })
        current_contour.append({ 'x': off_pt2[0], 'y': off_pt2[1], 'on': False })
        off_index += 2
    contours.append(current_contour)
    return contours

  def get_model_object(self):
    return {
      'onRefs': self.on_refs,
      'onOffsets': self.on_offsets,
      'offOffsets': self.off_offsets,
      'offOnIndices': self.off_on_indices,
      'onContourIndices': self.on_contour_indices,
      'xAlign': self.x_align, 'yAlign': self.y_align
    }

  def to_json(self):
    return json.dumps({
      'onRefs': self.on_refs,
      'onOffsets': self.on_offsets,
      'offOffsets': self.off_offsets,
      'offOnIndices': self.off_on_indices,
      'onContourIndices': self.on_contour_indices,
      'xAlign': self.x_align, 'yAlign': self.y_align
    })
