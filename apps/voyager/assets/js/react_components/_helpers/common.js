import React from 'react';
let conversionFixes = {
    'Cf D N A2d Barcode': 'Cf DNA 2d Barcode',
    'Cmo Sample Name': 'CMO Sample Name',
    'Pi Email': 'PI Email',
    'Qc Report Type': 'QC Report Type',
    'I G O Recommendation': 'IGO Recommendation',
    'Ci Tag': 'CI Tag',
    'Dna Input Ng': 'DNA Input Ng',
};

export function convertToTitleCase(sampleStr) {
    let removeSnakeCase = sampleStr
        .split('_')
        .map(function (singleWord) {
            return singleWord.charAt(0).toUpperCase() + singleWord.substring(1);
        })
        .join(' ');
    let addSpaces = removeSnakeCase.replace(/([A-Z])/g, ' $1');
    let addUppercase = addSpaces.charAt(0).toUpperCase() + addSpaces.slice(1);
    let removeSpaces = addUppercase.replace(/ +/g, ' ');
    let titleCase = removeSpaces.trim();
    if (titleCase in conversionFixes) {
        titleCase = conversionFixes[titleCase];
    }
    return titleCase;
}

export function convertStrToList(sampleStr, delimiter, conversionFunction) {
    if (Array.isArray(sampleStr)) {
        return sampleStr;
    }
    let convertedList = [];
    const splitList = sampleStr.split(delimiter);
    for (const singleStr of splitList) {
        if (singleStr) {
            const convertedElem = conversionFunction(singleStr);
            if (convertedElem) {
                convertedList.push(convertedElem);
            }
        }
    }

    return convertedList;
}

export function convertStrToNumList(sampleStr) {
    const strToNumConversion = (singleStr) => {
        const trimmedString = singleStr.trim();
        if (trimmedString) {
            const possibleNumber = parseFloat(singleStr);
            return possibleNumber;
        }
    };

    return convertStrToList(sampleStr, ',', strToNumConversion);
}

export function convertStrToStrList(sampleStr) {
    const strToStrConversion = (singleStr) => {
        const trimmedString = singleStr.trim();
        if (trimmedString) {
            return trimmedString;
        }
    };

    return convertStrToList(sampleStr, ',', strToStrConversion);
}

export function convertStrToBool(sampleStr) {
    if (
        sampleStr.toString().toLowerCase() === 'true' ||
        sampleStr.toString().toLowerCase() === '1'
    ) {
        return true;
    } else if (
        sampleStr.toString().toLowerCase() === 'false' ||
        sampleStr.toString().toLowerCase() === '0'
    ) {
        return false;
    }
    return sampleStr;
}

export function handlePlural(currentNum, noneResponse, singularResponse, pluralResponse) {
    if (currentNum == 0) {
        return noneResponse;
    } else if (currentNum == 1) {
        return singularResponse;
    } else {
        return pluralResponse;
    }
}

export function findMatchParts(option, inputValue) {
    let parts = [];
    if (inputValue && inputValue.length !== 0 && inputValue.trim().length !== 0) {
        const match = option.search(inputValue);
        if (match !== -1) {
            const start = 0;
            const end = option.length;
            const match_start = match;
            const match_end = match + inputValue.length;
            if (match_start !== start) {
                const part = {
                    text: option.substring(start, match_start),
                    highlight: false,
                };
                parts.push(part);
            }
            const matched_part = {
                text: option.substring(match_start, match_end),
                highlight: true,
            };
            parts.push(matched_part);
            if (match_end !== end) {
                const part = {
                    text: option.substring(match_end, end),
                    highlight: false,
                };
                parts.push(part);
            }
        } else {
            parts = [{ text: option, highlight: false }];
        }
    } else {
        parts = [{ text: option, highlight: false }];
    }
    return (
        <div>
            {parts.map((part, index) => (
                <span
                    key={index}
                    style={{
                        fontWeight: part.highlight ? 700 : 400,
                    }}
                >
                    {part.text}
                </span>
            ))}
        </div>
    );
}
