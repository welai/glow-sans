#!/usr/bin/env python3
# -*- encoding: utf8 -*-
import numpy as np
from cv2 import cv2
from skimage.morphology import binary_dilation, square

# Find the junctions of the skeleton image
# REF: https://answers.opencv.org/question/103162/detection-of-contours-intersections/
def find_junctions(skeleton):
    """Give the skeleton segments of a binary image.

    Parameters
    ----------
    skeleton: numpy.ndarray
        A binary image of the skeleton, with '0' representing the backgroud, and
        '1' representing the object.

    Returns
    ----------
    junction_image: numpy.ndarray
        A binary image with the found junction points in '255'
    """
    # kernels for hit and miss
    # k1, k2, k3 and k4 are used to identify intersections
    k1 = np.array([
        [-1,  1, -1],
        [ 1,  1,  1],
        [-1, -1, -1]], dtype = int)
    k2 = np.array([
        [ 1, -1,  1],
        [-1,  1, -1],
        [ 1, -1, -1]], dtype = int)
    k3 = np.array([
        [ 1, -1,  1],
        [ 0,  1,  0],
        [ 0,  1,  0]], dtype = int)
    k4 = np.array([
        [-1,  1, -1],
        [ 1,  1,  0],
        [-1,  0,  1]], dtype = int)
    # k5 is used for identifying the corners
    k5 = np.array([
        [-1,-1, 0, 0, 0 ],
        [-1,-1, 1, 0, 0 ],
        [-1,-1, 0, 1, 0 ],
        [-1,-1,-1,-1,-1 ],
        [-1,-1,-1,-1,-1 ]], dtype = int)

    skeleton = (skeleton > 0).astype(np.uint8) * 255
    # dst accumulates all matches
    dst = np.zeros(skeleton.shape, dtype = np.uint8)
    # Do hit & miss for all possible directions (0,90,180,270)
    for _ in range(4):
        dst = cv2.add(dst, cv2.morphologyEx(skeleton, cv2.MORPH_HITMISS, k1))
        dst = cv2.add(dst, cv2.morphologyEx(skeleton, cv2.MORPH_HITMISS, k2))
        dst = cv2.add(dst, cv2.morphologyEx(skeleton, cv2.MORPH_HITMISS, k3))
        dst = cv2.add(dst, cv2.morphologyEx(skeleton, cv2.MORPH_HITMISS, k4))
        dst = cv2.add(dst, cv2.morphologyEx(skeleton, cv2.MORPH_HITMISS, k5))
        # Rotate the kernels
        k1 = np.rot90(k1); k2 = np.rot90(k2); k3 = np.rot90(k3)
        k4 = np.rot90(k4); k5 = np.rot90(k5)
    return dst

def get_skeleton_segments(
    skeleton,
    prune_length = 0,
    dilated_kernel_size = 3,
    return_junction_image = False,
    junction_dilated = False):

    """Give the skeleton segments of a binary image.

    Parameters
    ----------
    skeleton: numpy.ndarray
        A binary image of the skeleton, with '0' representing the backgroud, and
        '1' representing the object.
    prune_length: int
        Number of pixels in a smallest segment.
    dilated_kernel_size: int
        Size of the kernel to dilate at the junctions.
    return_junction_image: boolean
        Return the junction image or not.
    junction_dilated: boolean
        If the returning junction image is dilated.

    Returns
    ----------
    segments: list
        A list of skeleton segments
    junction_img: numpy.ndarray
        The image for the found junctions
    """

    junction_image = find_junctions(skeleton)
    # The image border should be all-black
    junction_image[0] = junction_image[-1] = 0
    junction_image[:,0] = junction_image[:,-1] = 0
    # Dilate the junction image
    dilated_junctions = binary_dilation(junction_image//255,
        square(dilated_kernel_size))
    # skeleton with no intersections
    intersection_eliminated = np.logical_and(
        skeleton, 1 - dilated_junctions).astype(np.uint8)
    _, segment_contours, _ = cv2.findContours(intersection_eliminated * 255,
        cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    segment_contours = [ contour[:,0,::-1] for contour in segment_contours ]
    sorted_segments = []

    for contour in segment_contours:
        contour_list = [ pt.tolist() for pt in contour ]
        # The indices of the end points of a segment
        ends = [ i
            for i, pt in enumerate(contour_list)
            if contour_list.count(pt) < 2 ]
        sorted_segments.append(contour[min(ends) : max(ends) + 1])

    # Pruning
    sorted_segments = list(filter(  
        lambda segment: cv2.arcLength(segment, closed=False) >= prune_length,
        sorted_segments))

    if return_junction_image:
        return (sorted_segments,
            dilated_junctions if junction_dilated else junction_image)
    else:
        return sorted_segments
