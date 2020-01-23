# Ensure that `fonts` is the current directory

wget https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/SourceHanSansSC.zip &
wget https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/SourceHanSansK.zip &
wget https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/SourceHanSansJ.zip &
wait
unzip \*.zip

for FILE in */*.otf; do
  echo otfccdump $FILE
  otfccdump $FILE --pretty --ignore-hints --ignore-glyph-order --hex-cmap -o ${FILE//.otf/.json}
  echo done
done

wait
