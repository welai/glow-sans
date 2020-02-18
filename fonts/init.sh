# Ensure that `fonts` is the current directory
ARG=$1

china_mirror() {
  re='https://raw.githubusercontent.com/[^/]*/([^/]*)/(.*)'
  if [[ $1 =~ $re ]]; then
    CHINA_URL="https://gitee.com/celestialphineas/${BASH_REMATCH[1]}/raw/${BASH_REMATCH[2]}"
  fi
  unset re
}

WGET() {
  if [[ $ARG == '-m' ]]; then
    china_mirror $1
    wget -q $CHINA_URL
  else
    wget -q $1
  fi
}

WGET https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/SourceHanSansSC.zip &
WGET https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/SourceHanSansK.zip &
WGET https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/OTF/SourceHanSansJ.zip &
wait
unzip \*.zip

mkdir Fira
cd Fira
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Two.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Four.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Eight.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Hair.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Thin.otf &
wait
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-UltraLight.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-ExtraLight.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Light.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Book.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Regular.otf &
wait
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Medium.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-SemiBold.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Bold.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-ExtraBold.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Normal/Roman/FiraSans-Heavy.otf &
wait

WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Two.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Four.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Eight.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Hair.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Thin.otf &
wait
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-UltraLight.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-ExtraLight.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Light.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Regular.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Book.otf &
wait
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Medium.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-SemiBold.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Bold.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-ExtraBold.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Condensed/Roman/FiraSansCondensed-Heavy.otf &
wait

WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Two.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Four.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Eight.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Hair.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Thin.otf &
wait
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-UltraLight.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-ExtraLight.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Light.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Regular.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Book.otf &
wait
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Medium.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-SemiBold.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Bold.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-ExtraBold.otf &
WGET https://raw.githubusercontent.com/bBoxType/FiraSans/master/Fira_Sans_4_3/Fonts/Fira_Sans_OTF_4301/Compressed/Roman/FiraSansCompressed-Heavy.otf &
wait
cd ..

mkdir Raleway
cd Raleway
WGET https://raw.githubusercontent.com/impallari/Raleway/master/fonts/v4020/Raleway-v4020-Thin.otf &
WGET https://raw.githubusercontent.com/impallari/Raleway/master/fonts/v4020/Raleway-v4020-ExtraLight.otf &
WGET https://raw.githubusercontent.com/impallari/Raleway/master/fonts/v4020/Raleway-v4020-Light.otf &
WGET https://raw.githubusercontent.com/impallari/Raleway/master/fonts/v4020/Raleway-v4020-Regular.otf &
WGET https://raw.githubusercontent.com/impallari/Raleway/master/fonts/v4020/Raleway-v4020-Medium.otf &
wait
WGET https://raw.githubusercontent.com/impallari/Raleway/master/fonts/v4020/Raleway-v4020-SemiBold.otf &
WGET https://raw.githubusercontent.com/impallari/Raleway/master/fonts/v4020/Raleway-v4020-Bold.otf &
WGET https://raw.githubusercontent.com/impallari/Raleway/master/fonts/v4020/Raleway-v4020-ExtraBold.otf &
WGET https://raw.githubusercontent.com/impallari/Raleway/master/fonts/v4020/Raleway-v4020-Black.otf &
wait
cd ..

for FILE in */*.otf; do
  echo otfccdump $FILE
  otfccdump $FILE --pretty --ignore-hints --ignore-glyph-order --hex-cmap -o ${FILE//.otf/.json}
  echo done
done

wait
