#!/bin/bash
# The script argument specifies the number of processes to use

N_PROCESSES=4
case $1 in
    ''|*[!0-9]*) ;;
    *) N_PROCESSES=$1 ;;
esac

WEIGHTS="ExtraLight Light Normal Regular Medium Bold Heavy"

EXTRACT_DIR="build-files/extracted/kana-like"
MODEL_DIR="build-files/models/kana-like"
mkdir -p $EXTRACT_DIR $MODEL_DIR

for WEIGHT in $WEIGHTS; do
  if [ -f $MODEL_DIR/$WEIGHT.json ]; then continue; fi
  echo "Extracting $EXTRACT_DIR/$WEIGHT.json..."
  node  "scripts/extract-han-gid.js" \
        "encoding/gid/kana-like.tsv" "$EXTRACT_DIR/$WEIGHT.json" \
        "fonts/SourceHanSansJ/SourceHanSans-$WEIGHT.json" &&
  echo "Done, now converting to glyph model..."
  npm run convert-model $EXTRACT_DIR/$WEIGHT.json $MODEL_DIR/$WEIGHT.json &&
  rm $EXTRACT_DIR/$WEIGHT.json &
  I_PROCESS=$((I_PROCESS+1))
  if (( I_PROCESS % N_PROCESSES == 0 )); then
    wait
    I_PROCESS=0
  fi
done