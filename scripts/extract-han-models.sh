#!/bin/bash
# Extract the Han glyphs of given cmap, and convert them to glyph models
# Running this script may take several days
# The script argument specifies the number of processes to use

N_PROCESSES=4
case $1 in
    ''|*[!0-9]*) ;;
    *) N_PROCESSES=$1 ;;
esac

WEIGHTS="ExtraLight Light Normal Regular Medium Bold Heavy"
I_PROCESS=0

for WEIGHT in $WEIGHTS; do
  # Extract SC
  EXTRACT_DIR="build-files/extracted/shs-sc/$WEIGHT"
  MODEL_DIR="build-files/models/shs-sc/$WEIGHT"
  mkdir -p $EXTRACT_DIR $MODEL_DIR
  for FILE in encoding/gid/shs-sc-han/gid-*.tsv; do
    TARGET=${FILE//'encoding/gid/shs-sc-han/'}
    TARGET=${TARGET//'.tsv'/'.json'}
    if [ -f $MODEL_DIR/$TARGET ]; then continue; fi
    echo "Extracting $FILE to $EXTRACT_DIR/$TARGET..."
    node  "scripts/extract-han-gid.js" \
          "fonts/SourceHanSansSC/SourceHanSansSC-$WEIGHT.json" \
          "$FILE" $EXTRACT_DIR/$TARGET &&
    echo "Done, now converting to glyph model..."
    npm run convert-model $EXTRACT_DIR/$TARGET $MODEL_DIR/$TARGET &&
    rm $EXTRACT_DIR/$TARGET &
    I_PROCESS=$((I_PROCESS+1))
    if (( I_PROCESS % N_PROCESSSES == 0 )); then
      wait
      I_PROCESS=0
    fi
  done
  # Extract TC/K
  EXTRACT_DIR="build-files/extracted/shs-k/$WEIGHT"
  MODEL_DIR="build-files/models/shs-k/$WEIGHT"
  mkdir -p $EXTRACT_DIR $MODEL_DIR
  for FILE in encoding/gid/shs-k-han/gid-*.tsv; do
    TARGET=${FILE//'encoding/gid/shs-k-han/'}
    TARGET=${TARGET//'.tsv'/'.json'}
    if [ -f $MODEL_DIR/$TARGET ]; then continue; fi
    echo "Extracting $FILE to $EXTRACT_DIR/$TARGET..."
    node  "scripts/extract-han-gid.js" \
          "fonts/SourceHanSansK/SourceHanSansK-$WEIGHT.json" \
          "$FILE" $EXTRACT_DIR/$TARGET &&
    echo "Done, now converting to glyph model..."
    npm run convert-model $EXTRACT_DIR/$TARGET $MODEL_DIR/$TARGET &&
    rm $EXTRACT_DIR/$TARGET &
    I_PROCESS=$((I_PROCESS+1))
    if (( I_PROCESS % N_PROCESSSES == 0 )); then
      wait
      I_PROCESS=0
    fi
  done
  # Extract J
  EXTRACT_DIR="build-files/extracted/shs-j/$WEIGHT"
  MODEL_DIR="build-files/models/shs-j/$WEIGHT"
  mkdir -p $EXTRACT_DIR $MODEL_DIR
  for FILE in encoding/gid/shs-j-han/gid-*.tsv; do
    TARGET=${FILE//'encoding/gid/shs-j-han/'}
    TARGET=${TARGET//'.tsv'/'.json'}
    if [ -f $MODEL_DIR/$TARGET ]; then continue; fi
    echo "Extracting $FILE to $EXTRACT_DIR/$TARGET..."
    node  "scripts/extract-han-gid.js" \
          "fonts/SourceHanSansJ/SourceHanSans-$WEIGHT.json" \
          "$FILE" $EXTRACT_DIR/$TARGET &&
    echo "Done, now converting to glyph model..."
    npm run convert-model $EXTRACT_DIR/$TARGET $MODEL_DIR/$TARGET &&
    rm $EXTRACT_DIR/$TARGET &
    I_PROCESS=$((I_PROCESS+1))
    if (( I_PROCESS % N_PROCESSSES == 0 )); then
      wait
      I_PROCESS=0
    fi
  done
done

wait