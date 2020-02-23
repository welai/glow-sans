#!/bin/bash

WEIGHTS="$@"

for WEIGHT in $WEIGHTS; do
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
    rm $EXTRACT_DIR/$TARGET
  done
done
