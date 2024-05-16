set -e

# use when debugging
#set -x

# read input
function parseBlackFramesRecords {
    readarray -t lines

    declare -a result=()

    local regex="frame:([0-9]+) pblack.*?t:([0-9]+\.[0-9]{3})"

    for f in "${lines[@]}"
    do
        if [[ $f =~ $regex ]]; then
            #echo "${BASH_REMATCH[1]} ${BASH_REMATCH[2]}-"
            result+=("${BASH_REMATCH[1]} ${BASH_REMATCH[2]}")
        fi
    done

    printf '%s\n' "${result[@]}"
}

function findBlackFrames {
    local inputFile=$1

    ffmpeg -i $inputFile -vf blackframe=threshold=98 -f null - 2>&1
}

function blackFramesToClapboard {
    readarray -t blackframeRecords


    declare -a result=()

    local lastRecord=("0 0.000")
    local lookingForStart=1

    for rawRecord in "${blackframeRecords[@]}"
    do
        record=(${rawRecord[@]})
        tmpLastRecord=(${lastRecord[@]})
        lastRecord=(${record[@]})

        if [[ ${record[0]} = $((${tmpLastRecord[0]} + 1)) ]]; then
            continue
        fi

        if [[ $lookingForStart = 0 ]]; then
            result+=("${tmpLastRecord[1]} ${record[1]}")
            lookingForStart=1
            continue
        fi

        lookingForStart=0
    done

    printf '%s\n' "${result[@]}"
}

function cutRelevantParts {
    local inputFileName=$1
    local outputFileNameBase=$2

    readarray -t parts

    for i in "${!parts[@]}"; do
        outputFileName="`printf "%03d" $i`_${outputFileNameBase}"

        fromTo=(${parts[i]})
        # this might be needed for older browsers lacking support for VP9
        #cutVideo $inputFileName "$OUTPUT_DIR/1080/$outputFileName" "${fromTo[0]}" "${fromTo[1]}" 1080 libvpx-vp8 30 "colormatrix=bt709:bt601,"
        cutVideo $inputFileName "$OUTPUT_DIR/1080/$outputFileName" "${fromTo[0]}" "${fromTo[1]}" 1080 libvpx-vp9 30 "colormatrix=bt709:bt601,"
        cutVideo $inputFileName "$OUTPUT_DIR/2160/$outputFileName" "${fromTo[0]}" "${fromTo[1]}" 2160 libvpx-vp9 30 ""
    done
}

function cutVideo {
    local inputFileName=$1
    local outputFileName=$2
    local start=$3
    local end=$4

    local TARGET_HEIGHT=$5
    local CODEC=$6
    local QUALITY=$7
    local COLOR_MATRIX=$8

    ffmpeg -ss $start -to $end -i "$inputFileName" -b:v 0 -crf "$QUALITY" -c:v "$CODEC" -vf "${COLOR_MATRIX}scale=-1:$TARGET_HEIGHT" "$outputFileName"
}


OUTPUT_DIR=dist/cutterOutput
DEBUG_FILE=dist/cutterOutput/debug.txt

if [ "$#" -ne 2 ]; then
    echo "Invalid parameters"
    exit 1
fi

rm $OUTPUT_DIR -rf
mkdir $OUTPUT_DIR
mkdir $OUTPUT_DIR/1080
mkdir $OUTPUT_DIR/2160

inputFileName=$1
outputFileName=$2
findBlackFrames $inputFileName | tee $DEBUG_FILE | parseBlackFramesRecords | blackFramesToClapboard | cutRelevantParts $inputFileName $outputFileName

# debug - not working because ffmpeg probably outputs some weird characters
#findBlackFrames $inputFileName | tee $DEBUG_FILE
#strings -1 "$DEBUG_FILE" | parseBlackFramesRecords | blackFramesToClapboard | cutRelevantParts $inputFileName $outputFileName
