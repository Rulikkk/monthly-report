import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";

import { Input } from "./Editor";

function startsNewRemark(remarkText) {
  return remarkText.startsWith("- ");
}

function trimRemarkString(remarkText) {
  if (!startsNewRemark(remarkText)) {
    return remarkText;
  }

  return remarkText.substr(2);
}

function parseRemarksStringIntoArray(remarksText) {
  if (!remarksText) {
    return [];
  }

  const remarksArr = [];
  const arrayOfLines = remarksText.split(/\r?\n/);
  let currentRemark = trimRemarkString(arrayOfLines[0]);
  for (let ix = 1; ix < arrayOfLines.length; ix++) {
    const processedLine = arrayOfLines[ix];

    if (startsNewRemark(processedLine)) {
      // If a line starts new remark, then push previous remark into array and start new remark from processed line.
      remarksArr.push(currentRemark);
      currentRemark = trimRemarkString(processedLine);
    } else {
      // If line continues previous remark, then just append it to the end of current remark.
      currentRemark += "\r\n" + processedLine;
    }
  }

  // Push last remark into the array.
  remarksArr.push(currentRemark);

  return remarksArr;
}

function convertRemarksArrayToText(remarksArray) {
  let remarksText = "";
  for (let remark of remarksArray) {
    if (remarksText !== "") {
      remarksText += "\r\n";
    }

    remarksText += "- " + remark;
  }

  return remarksText;
}

function processNewRemarks(remarksText, updateRemarks) {
  const remarksArr = parseRemarksStringIntoArray(remarksText);
  updateRemarks(remarksArr);
}

const debouncedProcessNewRemarks = debounce(processNewRemarks, 200);

const BenchEditorRemarks = ({ remarks, onRemarksUpdate }) => {
  const [remarksText, setRemarksText] = useState(
    convertRemarksArrayToText(remarks)
  );

  useEffect(
    () =>
      debouncedProcessNewRemarks(remarksText, onRemarksUpdate, setRemarksText),
    // To suppress warning for onRemarksUpdate
    // eslint-disable-next-line
    [remarksText]
  );

  // Update the text in state if remarks array has been changed.
  useEffect(() => {
    setRemarksText(convertRemarksArrayToText(remarks));
  }, [remarks]);

  return (
    <div className="p-2">
      <h3>Remarks</h3>
      <Input
        textarea
        value={remarksText}
        onChange={value => setRemarksText(value)}
      />
    </div>
  );
};

export default BenchEditorRemarks;
